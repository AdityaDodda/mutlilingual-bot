import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { 
  X, 
  Download, 
  Share2, 
  FileText, 
  Play, 
  Pause, 
  Volume2,
  Maximize,
  Eye,
  Calendar,
  HardDrive,
  Languages
} from 'lucide-react';
import type { File, ConvertedFile } from '@/lib/types';

interface PreviewModalProps {
  file: (File | ConvertedFile) | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

function PDFPreview() {
  return (
    <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">PDF Preview</h3>
        <p className="text-gray-600 dark:text-gray-400">
          PDF preview would be displayed here using a PDF viewer library
        </p>
      </div>
    </div>
  );
}

function DocumentPreview() {
  return (
    <div className="w-full h-96 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        <FileText className="h-8 w-8 mx-auto mb-2" />
        <p>Document preview would be rendered here</p>
      </div>
    </div>
  );
}

function VideoPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="w-full h-96 bg-black rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {isPlaying ? (
              <Pause className="h-10 w-10" />
            ) : (
              <Play className="h-10 w-10 ml-1" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">Video Preview</h3>
          <p className="text-gray-300">Click to play video content</p>
        </div>
      </div>
      
      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="flex-1 h-2 bg-white/30 rounded-full">
            <div className="h-full w-1/3 bg-white rounded-full"></div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AudioPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="w-full h-96 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 bg-white/50 dark:bg-black/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            {isPlaying ? (
              <Pause className="h-10 w-10 text-white" />
            ) : (
              <Play className="h-10 w-10 text-white ml-1" />
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Audio Preview</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Click to play audio content</p>
        
        {/* Audio Progress */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>2:34</span>
            <span>12:45</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-full w-1/5 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PresentationPreview() {
  return (
    <div className="w-full h-96 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="h-8 bg-gray-100 dark:bg-gray-700 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
      </div>
      
      <div className="p-8 h-full">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        
        <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">Presentation slide 1 of 12</p>
        </div>
      </div>
    </div>
  );
}

export default function PreviewModal({ 
  file, 
  isOpen, 
  onClose, 
  onDownload, 
  onShare 
}: PreviewModalProps) {
  if (!file) return null;

  const filename = file.originalName || file.filename || '';
  const fileExtension = getFileExtension(filename);
  
  const renderPreview = () => {
    switch (fileExtension) {
      case 'pdf':
        return <PDFPreview />;
      case 'docx':
        return <DocumentPreview />;
      case 'pptx':
        return <PresentationPreview />;
      case 'mp4':
      case 'avi':
        return <VideoPreview />;
      case 'mp3':
      case 'wav':
        return <AudioPreview />;
      default:
        return <DocumentPreview />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-0 max-w-4xl w-full max-h-[90vh] p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold">{filename}</DialogTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Badge variant="secondary" className="text-xs">
                      {fileExtension.toUpperCase()}
                    </Badge>
                    <span>•</span>
                    <HardDrive className="h-3 w-3" />
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {onDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDownload}
                    className="hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
                
                {onShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShare}
                    className="hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {/* Content */}
          <div className="p-6">
            <ScrollArea className="h-full">
              {/* File Info */}
              <div className="mb-6 space-y-4">
                {/* Language Information */}
                {('sourceLanguage' in file || 'targetLanguage' in file) && (
                  <div className="flex items-center space-x-2">
                    <Languages className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div className="flex items-center space-x-2">
                      {'sourceLanguage' in file && file.sourceLanguage && (
                        <Badge variant="outline" className="text-xs">
                          {file.sourceLanguage.toUpperCase()}
                        </Badge>
                      )}
                      
                      {'targetLanguages' in file && file.targetLanguages && file.targetLanguages.length > 0 && (
                        <>
                          <span className="text-gray-400">→</span>
                          <div className="flex flex-wrap gap-1">
                            {file.targetLanguages.map((lang: string) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {'targetLanguage' in file && file.targetLanguage && (
                        <>
                          <span className="text-gray-400">→</span>
                          <Badge variant="outline" className="text-xs">
                            {file.targetLanguage.toUpperCase()}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Status */}
                {'status' in file && (
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={
                        file.status === 'completed' ? 'default' : 
                        file.status === 'processing' ? 'secondary' : 
                        file.status === 'failed' ? 'destructive' : 'outline'
                      }
                      className="text-xs"
                    >
                      {file.status}
                    </Badge>
                    
                    {file.status === 'processing' && 'conversionProgress' in file && file.conversionProgress !== undefined && (
                      <span className="text-xs text-gray-500">
                        {Math.round(file.conversionProgress)}% complete
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Preview */}
              <div className="mb-6">
                {renderPreview()}
              </div>
              
              {/* Additional Information */}
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold mb-3">File Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">File Name:</span>
                    <p className="font-medium break-all">{filename}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                    <p className="font-medium">{formatFileSize(file.size)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">File Type:</span>
                    <p className="font-medium">{fileExtension.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <p className="font-medium">{formatDate(file.createdAt)}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
