import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  Trash2, 
  MoreVertical,
  Calendar,
  HardDrive,
  ArrowRight,
  Music,
  Video,
  Presentation,
  File as FileIcon,
  Loader2
} from 'lucide-react';
import type { File, ConvertedFile } from '@/lib/types';

interface AssetCardProps {
  file: (File | ConvertedFile) & { type?: 'original' | 'converted' };
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onShare?: () => void;
  isDeleting?: boolean;
  onDownloadLog?: () => void;
  isDownloadingLog?: boolean;
  isDownloading?: boolean;
}

const FILE_TYPE_ICONS = {
  'pdf': FileText,
  'docx': FileIcon,
  'pptx': Presentation,
  'mp3': Music,
  'wav': Music,
  'mp4': Video,
  'avi': Video,
} as const;

const FILE_TYPE_COLORS = {
  'pdf': 'text-red-500 bg-red-100 dark:bg-red-900/30',
  'docx': 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  'pptx': 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
  'mp3': 'text-green-500 bg-green-100 dark:bg-green-900/30',
  'wav': 'text-green-500 bg-green-100 dark:bg-green-900/30',
  'mp4': 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  'avi': 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
} as const;

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
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  if (diffInHours < 48) return 'Yesterday';
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
  
  return date.toLocaleDateString();
};

export default function AssetCard({ 
  file, 
  onPreview, 
  onDownload, 
  onDelete, 
  onShare,
  isDeleting = false,
  onDownloadLog,
  isDownloadingLog = false,
  isDownloading = false
}: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const filename = file.originalName || file.filename || '';
  const fileExtension = getFileExtension(filename);
  const IconComponent = FILE_TYPE_ICONS[fileExtension as keyof typeof FILE_TYPE_ICONS] || FileIcon;
  const iconStyle = FILE_TYPE_COLORS[fileExtension as keyof typeof FILE_TYPE_COLORS] || 'text-gray-500 bg-gray-100 dark:bg-gray-800';

  // Generate a placeholder image based on file type
  const getPreviewImage = () => {
    const type = fileExtension;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) {
      return `https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240`;
    } else if (['pdf', 'docx'].includes(type)) {
      return `https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240`;
    } else if (type === 'pptx') {
      return `https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240`;
    } else if (['mp4', 'avi'].includes(type)) {
      return `https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240`;
    } else if (['mp3', 'wav'].includes(type)) {
      return `https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240`;
    }
    return `https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <Card className="glass border-0 h-full overflow-hidden file-preview">
        <CardContent className="p-0">
          {/* Preview Image */}
          <div className="relative h-40 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 ${!imageLoaded ? 'animate-pulse' : ''}`}>
              <img
                src={getPreviewImage()}
                alt={`Preview of ${filename}`}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } ${isHovered ? 'scale-110' : 'scale-100'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-black/0 transition-all duration-300 ${
              isHovered ? 'bg-black/20' : ''
            }`} />
            
            {/* File Type Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="glass text-xs font-medium">
                {fileExtension.toUpperCase()}
              </Badge>
            </div>
            
            {/* Converted Badge */}
            {file.type === 'converted' && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-500 text-white text-xs">
                  Converted
                </Badge>
              </div>
            )}
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3 flex items-center space-x-1"
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={onPreview}
                className="h-8 w-8 p-0 glass hover:bg-white/20"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </motion.div>
            
            {/* Duration Badge for Audio/Video */}
            {(['mp3', 'wav', 'mp4', 'avi'].includes(fileExtension)) && (
              <div className="absolute bottom-3 right-3">
                <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                  {fileExtension.includes('mp4') || fileExtension.includes('avi') ? '5:23' : '12:45'}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-4">
            {/* File Icon and Name */}
            <div className="flex items-start space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyle}`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-white truncate" title={filename}>
                  {filename}
                </h3>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <HardDrive className="h-3 w-3" />
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Language Information */}
            {('sourceLanguage' in file || 'targetLanguage' in file) && (
              <div className="flex items-center space-x-2 flex-wrap">
                {'sourceLanguage' in file && file.sourceLanguage && (
                  <Badge variant="outline" className="text-xs">
                    {file.sourceLanguage.toUpperCase()}
                  </Badge>
                )}
                
                {'targetLanguages' in file && file.targetLanguages && file.targetLanguages.length > 0 && (
                  <>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {file.targetLanguages.slice(0, 3).map((lang: string) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang.toUpperCase()}
                        </Badge>
                      ))}
                      {file.targetLanguages.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{file.targetLanguages.length - 3}
                        </Badge>
                      )}
                    </div>
                  </>
                )}
                
                {'targetLanguage' in file && file.targetLanguage && (
                  <>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <Badge variant="outline" className="text-xs">
                      {file.targetLanguage.toUpperCase()}
                    </Badge>
                  </>
                )}
              </div>
            )}
            
            {/* Status Badge */}
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
                    {Math.round(file.conversionProgress)}%
                  </span>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownload}
                  disabled={isDeleting || isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download
                </Button>
                
                {file.type === 'converted' && onDownloadLog && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDownloadLog}
                    disabled={isDeleting || isDownloadingLog}
                  >
                    {isDownloadingLog ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Log
                  </Button>
                )}
                
                {onShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShare}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-0">
                  <DropdownMenuItem onClick={onPreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  {onShare && (
                    <DropdownMenuItem onClick={onShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={onDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
