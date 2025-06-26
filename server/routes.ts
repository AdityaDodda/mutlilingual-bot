import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { setupAuth, isAuthenticated } from "./replitAuth";
import { authenticateToken, type AuthenticatedRequest } from "./auth";
import { insertFileSchema, insertUserPreferencesSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { z } from "zod";
import { spawn } from "child_process";
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "audio/mpeg",
      "audio/wav",
      "video/mp4",
      "video/avi",
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Please upload PDF, DOCX, PPTX, MP3, WAV, MP4, or AVI files."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  // await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', authenticateToken, async (req: any, res) => {
    try {
      return res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Email/password authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Create new user
      const user = await storage.createUserWithPassword({
        email,
        password,
        firstName,
        lastName,
      });

      // Generate JWT token
      const jwt = await import('jsonwebtoken');
      const token = jwt.default.sign(
        { userId: user.id, email: user.email },
        process.env.SESSION_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({
        user: { ...user, password: undefined }, // Don't send password back
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const bcrypt = await import('bcrypt');
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const jwt = await import('jsonwebtoken');
      const token = jwt.default.sign(
        { userId: user.id, email: user.email },
        process.env.SESSION_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({
        user: { ...user, password: undefined }, // Don't send password back
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to sign in" });
    }
  });

  // File upload endpoint
  app.post('/api/files/upload', upload.array('files'), async (req: any, res) => {
    try {
      let userId: string | null = null;

      // Check for JWT token first
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        const jwt = await import('jsonwebtoken');
        try {
          const decoded = jwt.default.verify(token, process.env.SESSION_SECRET!) as any;
          userId = decoded.userId;
        } catch (jwtError) {
          // Token invalid, continue to session check
        }
      }

      // Fallback to session-based auth
      if (!userId && req.isAuthenticated && req.isAuthenticated()) {
        userId = req.user.claims.sub;
      }

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedFiles = [];
      
      for (const file of files) {
        // Auto-detect language (simplified implementation)
        const sourceLanguage = await detectLanguage(file);
        
        const fileData = {
          userId,
          originalName: file.originalname,
          filename: file.filename,
          mimeType: file.mimetype,
          size: file.size,
          sourceLanguage,
          status: "uploaded" as const,
        };

        const newFile = await storage.createFile(fileData);
        uploadedFiles.push(newFile);
      }

      res.json({ files: uploadedFiles });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ message: "Failed to upload files" });
    }
  });

  // Start conversion endpoint
  app.post('/api/files/:id/convert', authenticateToken, async (req: any, res) => {
    try {
      const fileId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { targetLanguages, outputFormat, preserveFormatting } = req.body;

      // Validate request
      const conversionSchema = z.object({
        targetLanguages: z.array(z.string()).min(1),
        outputFormat: z.string().optional(),
        preserveFormatting: z.boolean().optional(),
      });

      const validatedData = conversionSchema.parse({ targetLanguages, outputFormat, preserveFormatting });

      // Check if user owns the file
      const file = await storage.getFile(fileId);
      if (!file || file.userId !== userId) {
        return res.status(404).json({ message: "File not found" });
      }

      // Update file with conversion parameters
      await storage.updateFileStatus(fileId, "processing", 0);
      
      // Create conversion job
      const job = await storage.createConversionJob({
        fileId,
        status: "processing",
        progress: 0,
        startedAt: new Date(),
      });

      // Call the Python script for each target language
      const inputPath = path.join(__dirname, '..', 'uploads', file.filename);
      for (const targetLang of validatedData.targetLanguages) {
        const outputFilename = `converted_${targetLang}_${Date.now()}.pptx`;
        const outputPath = path.join(__dirname, '..', 'uploads', outputFilename);
        await runPythonConversion(inputPath, outputPath, targetLang);
        const stats = fs.statSync(outputPath);
        await storage.createConvertedFile({
          originalFileId: fileId,
          targetLanguage: targetLang,
          filename: outputFilename,
          outputFormat: outputFilename.split('.').pop() || 'pptx',
          size: stats.size,
          downloadUrl: `/uploads/${outputFilename}`,
        });
      }
      await storage.updateFileStatus(fileId, "completed", 100);
      res.json({ message: "Conversion started", jobId: job.id });
    } catch (error) {
      console.error("Error starting conversion:", error);
      res.status(500).json({ message: "Failed to start conversion" });
    }
  });

  // Get conversion status
  app.get('/api/files/:id/status', authenticateToken, async (req: any, res) => {
    try {
      const fileId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      const file = await storage.getFile(fileId);
      if (!file || file.userId !== userId) {
        return res.status(404).json({ message: "File not found" });
      }

      const jobs = await storage.getConversionJobsByFile(fileId);
      const convertedFiles = await storage.getConvertedFilesByOriginal(fileId);

      res.json({
        file,
        jobs,
        convertedFiles,
        progress: file.conversionProgress || 0,
        status: file.status,
      });
    } catch (error) {
      console.error("Error fetching conversion status:", error);
      res.status(500).json({ message: "Failed to fetch conversion status" });
    }
  });

  // Get user's files
  app.get('/api/files', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const files = await storage.getFilesByUser(userId);
      res.json({ files });
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Get converted files for a user
  app.get('/api/files/converted', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const convertedFiles = await storage.getConvertedFilesByUser(userId);
      res.json({ convertedFiles });
    } catch (error) {
      console.error("Error fetching converted files:", error);
      res.status(500).json({ message: "Failed to fetch converted files" });
    }
  });

// Download an ORIGINAL file
app.get('/api/files/:id/download', authenticateToken, async (req: any, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const userId = req.user.claims.sub;

    const file = await storage.getFile(fileId); // Assuming storage.getFile finds an original file

    if (!file || file.userId !== userId) {
      return res.status(404).json({ message: "File not found or you don't have permission." });
    }

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    const downloadName = file.originalName || file.filename;

    // res.download() handles setting the correct headers and streaming the file
    res.download(filePath, downloadName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        // Avoid sending another response if headers were already sent
        if (!res.headersSent) {
          res.status(500).send("Could not download the file.");
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while downloading file." });
  }
});

// Download a CONVERTED file
app.get('/api/files/converted/:id/download', authenticateToken, async (req: any, res) => {
  try {
    const convertedFileId = parseInt(req.params.id);
    const userId = req.user.claims.sub;

    // You need a way to get a converted file and check its ownership
    // This might involve joining with the original file's table
    const convertedFile = await storage.getConvertedFile(convertedFileId); // You may need to implement this
    // A robust check to ensure the user requesting the converted file is the owner
    // of the original file. This is a placeholder for your actual logic.
    const originalFile = await storage.getFile(convertedFile.originalFileId);
    if (!originalFile || originalFile.userId !== userId) {
       return res.status(404).json({ message: "File not found or you don't have permission." });
    }
    
    if (!convertedFile) {
      return res.status(404).json({ message: "Converted file not found." });
    }

    const filePath = path.join(__dirname, '..', 'uploads', convertedFile.filename);
    const downloadName = convertedFile.filename; 

    res.download(filePath, downloadName, (err) => {
      if (err) {
        console.error("Error downloading converted file:", err);
        if (!res.headersSent) {
          res.status(500).send("Could not download the file.");
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while downloading file." });
  }
});

  // Delete file
  app.delete('/api/files/:id', authenticateToken, async (req: any, res) => {
    try {
      const fileId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      const file = await storage.getFile(fileId);
      if (!file || file.userId !== userId) {
        return res.status(404).json({ message: "File not found" });
      }

      await storage.deleteFile(fileId);
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // User preferences endpoints
  app.get('/api/preferences', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json({ preferences });
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.put('/api/preferences', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferencesData = { ...req.body, userId };
      
      const validatedData = insertUserPreferencesSchema.parse(preferencesData);
      const preferences = await storage.upsertUserPreferences(validatedData);
      
      res.json({ preferences });
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

// GET /logout — for browser redirect-based logout (optional)
app.get('/logout', (_req, res) => {
  res.redirect('/login');
});

// GET /api/logout — for frontend to call via fetch/apiRequest
app.get('/api/logout', (_req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});


  const httpServer = createServer(app);
  return httpServer;
}

// Simplified language detection (in a real app, this would use a proper service)
async function detectLanguage(file: Express.Multer.File): Promise<string> {
  // This is a placeholder - in a real implementation, you would:
  // 1. Extract text from the file based on its type
  // 2. Use a language detection service like Google Cloud Translation API
  // 3. Return the detected language code
  return "en"; // Default to English
}

const pythonExecutable = path.join(__dirname, '..', 'multi', 'scripts', 'python.exe');

async function runPythonConversion(inputPath, outputPath, targetLang) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(pythonExecutable, [
      'English to FrenchV2.py',
      inputPath,
      outputPath,
      targetLang
    ], {
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
}
