import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  File as FileIcon, 
  Video, 
  Music, 
  Presentation,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FileUploaderProps {
  onUpload: (files: FileList) => void;
  isUploading?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
}

const FILE_TYPE_ICONS = {
  'application/pdf': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileIcon,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': Presentation,
  'audio/mpeg': Music,
  'audio/wav': Music,
  'video/mp4': Video,
  'video/avi': Video,
};

const FILE_TYPE_COLORS = {
  'application/pdf': 'text-red-500',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'text-blue-500',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'text-orange-500',
  'audio/mpeg': 'text-green-500',
  'audio/wav': 'text-green-500',
  'video/mp4': 'text-purple-500',
  'video/avi': 'text-purple-500',
};

export default function FileUploader({ 
  onUpload, 
  isUploading = false, 
  maxFiles = 10,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  acceptedTypes = [
    // 'application/pdf',
    // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // 'audio/mpeg',
    // 'audio/wav',
    // 'video/mp4',
    // 'video/avi',
  ]
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((files: FileList): { valid: File[], errors: string[] } => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    // Only allow the first file
    const fileArray = Array.from(files).slice(0, 1);
    fileArray.forEach((file) => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        newErrors.push(`${file.name}: Unsupported file type`);
        return;
      }
      // Check file size
      if (file.size > maxFileSize) {
        newErrors.push(`${file.name}: File too large (max ${maxFileSize / 1024 / 1024}MB)`);
        return;
      }
      validFiles.push(file);
    });
    // Only allow one file in total
    if (selectedFiles.length + validFiles.length > 1) {
      newErrors.push(`Only one file allowed`);
      return { valid: [], errors: newErrors };
    }
    return { valid: validFiles, errors: newErrors };
  }, [acceptedTypes, maxFileSize, selectedFiles.length]);

  const handleFileSelect = useCallback((files: FileList) => {
    const { valid, errors } = validateFiles(files);
    
    setErrors(errors);
    
    if (valid.length > 0) {
      const newFiles = [...selectedFiles, ...valid];
      setSelectedFiles(newFiles);
      
      // Create a new FileList-like object for the callback
      const dataTransfer = new DataTransfer();
      newFiles.forEach(file => dataTransfer.items.add(file));
      onUpload(dataTransfer.files);
    }
  }, [selectedFiles, validateFiles, onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    if (newFiles.length === 0) {
      setErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [selectedFiles]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card 
        className={`glass border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-primary/10 scale-[1.02]' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-12 text-center">
          <motion.div
            animate={{ 
              y: isDragOver ? -10 : 0,
              scale: isDragOver ? 1.1 : 1 
            }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDragOver ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800'
            } transition-colors duration-300`}>
              <Upload className={`h-10 w-10 ${
                isDragOver ? 'text-primary' : 'text-gray-400'
              } transition-colors duration-300`} />
            </div>
          </motion.div>
          
          <h3 className="text-xl font-semibold mb-2">
            {isDragOver ? 'Drop your files here' : 'Upload your files'}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Drag and drop files here, or click to browse
          </p>
          
          <Button
            type="button"
            disabled={isUploading}
            className="gradient-primary text-white hover:opacity-90 transition-opacity"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </>
            )}
          </Button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Supports: PPTX{/* PDF, DOCX, MP3, MP4, WAV, AVI (Max {maxFileSize / 1024 / 1024}MB each)*/}
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Error Messages */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="font-semibold flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Selected Files ({selectedFiles.length})
          </h4>
          
          <div className="space-y-3">
            {selectedFiles.map((file, index) => {
              const IconComponent = FILE_TYPE_ICONS[file.type as keyof typeof FILE_TYPE_ICONS] || FileIcon;
              const iconColor = FILE_TYPE_COLORS[file.type as keyof typeof FILE_TYPE_COLORS] || 'text-gray-500';
              
              return (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 glass rounded-xl file-preview"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/50 dark:bg-black/20 rounded-lg flex items-center justify-center">
                      <IconComponent className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-xs">{file.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
