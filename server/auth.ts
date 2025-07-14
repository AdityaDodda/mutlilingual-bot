import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    // profileImageUrl?: string;
    claims?: {
      sub: string;
    };
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Check for JWT token in Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(token, process.env.SESSION_SECRET!) as any;
      
      const user = await storage.getUser(decoded.userId);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email!,
          firstName: user.firstName,
          lastName: user.lastName,
          // profileImageUrl: user.profileImageUrl,
          claims: { sub: user.id }
        };
        return next();
      }
    }

    // Fallback to existing session-based auth for Replit
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};