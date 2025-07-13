import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  Eye, 
  Home,
  RefreshCw,
  Zap,
  FileText,
  Languages
} from 'lucide-react';
import type { File, ConversionJob, ConvertedFile } from '@/lib/types';

interface ConversionStatusProps {
  fileId: number;
  onComplete?: () => void;
  refreshInterval?: number;
}

const STATUS_STEPS = [
  { key: 'uploaded', label: 'Uploaded', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Zap },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
];

export default function ConversionStatus({ 
  fileId, 
  onComplete,
  refreshInterval = 20000
}: ConversionStatusProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/files/${fileId}/status`],
    refetchInterval: (data) => {
      // Stop polling when conversion is complete or failed
      const status = data?.file?.status;
      return status === 'completed' || status === 'failed' ? false : refreshInterval;
    },
    retry: false,
  });

  const file: File | undefined = data?.file;
  const jobs: ConversionJob[] = data?.jobs || [];
  const convertedFiles: ConvertedFile[] = data?.convertedFiles || [];
  const progress = data?.progress || 0;
  const status = data?.status || 'unknown';

  // Update current step based on status
  useEffect(() => {
    if (status === 'uploaded') setCurrentStep(0);
    else if (status === 'processing') setCurrentStep(1);
    else if (status === 'completed') setCurrentStep(2);
  }, [status]);

  // Call onComplete when conversion is finished
  useEffect(() => {
    if (status === 'completed' && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // Wait 3 seconds before calling onComplete
      
      return () => clearTimeout(timer);
    }
  }, [status, onComplete]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="glass border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading conversion status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="glass border-0">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Status</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error?.message || 'Failed to load conversion status'}
            </p>
            <Link href="/">
              <Button variant="outline" className="glass border-0">
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';
  const isProcessing = status === 'processing';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="glass border-0">
          <CardContent className="p-8">
            {/* Status Icon */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ 
                  rotate: isProcessing ? 360 : 0,
                  scale: isCompleted ? [1, 1.2, 1] : 1 
                }}
                transition={{ 
                  duration: isProcessing ? 2 : 0.5,
                  repeat: isProcessing ? Infinity : 0,
                  ease: "linear"
                }}
                className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-100 dark:bg-green-900/30' :
                  isFailed ? 'bg-red-100 dark:bg-red-900/30' :
                  'gradient-primary'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                ) : isFailed ? (
                  <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                ) : (
                  <RefreshCw className="h-12 w-12 text-white" />
                )}
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">
                {isCompleted ? 'Conversion Complete!' :
                 isFailed ? 'Conversion Failed' :
                 'Converting Your Files'}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300">
                {isCompleted ? 'Your files have been successfully converted' :
                 isFailed ? 'There was an error processing your files' :
                 'Please wait while we process your content...'}
              </p>
            </div>

            {/* File Info */}
            <div className="flex items-center justify-center space-x-4 mb-8 p-4 glass rounded-xl">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{file.originalName}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  {file.sourceLanguage && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        {file.sourceLanguage.toUpperCase()}
                      </Badge>
                    </>
                  )}
                  {file.targetLanguages && file.targetLanguages.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Languages className="h-3 w-3" />
                        <span>{file.targetLanguages.join(', ').toUpperCase()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                {STATUS_STEPS.map((step, index) => {
                  const isActive = index <= currentStep;
                  const isCurrent = index === currentStep;
                  const StepIcon = step.icon;
                  
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isActive 
                          ? isCurrent && isProcessing
                            ? 'gradient-primary animate-pulse'
                            : 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}>
                        {isCurrent && isProcessing ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (
                          <StepIcon className="h-6 w-6" />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
                
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-3 glass"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Estimated time remaining: {Math.max(1, Math.ceil((100 - progress) / 20))} minute(s)
                </p>
              </div>
            )}

            {/* Conversion Jobs */}
            {jobs.length > 0 && (
              <div className="mb-8">
                <h4 className="font-semibold mb-4">Conversion Jobs</h4>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          job.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                          job.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' :
                          'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          {job.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : job.status === 'failed' ? (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Job #{job.id}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {job.status === 'completed' ? 'Completed' :
                             job.status === 'failed' ? 'Failed' :
                             'Processing...'}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(job.progress)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Converted Files */}
            {convertedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <h4 className="font-semibold mb-4">Converted Files</h4>
                <div className="grid gap-3">
                  {convertedFiles.map((convertedFile) => (
                    <div key={convertedFile.id} className="flex items-center justify-between p-4 glass rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{convertedFile.filename}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Badge variant="secondary" className="text-xs">
                              {convertedFile.targetLanguage.toUpperCase()}
                            </Badge>
                            <span>{convertedFile.outputFormat.toUpperCase()}</span>
                            <span>•</span>
                            <span>{(convertedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              {isCompleted ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button className="gradient-primary text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Download All Files
                  </Button>
                  <Link href="/library">
                    <Button variant="outline" className="glass border-0">
                      <Eye className="mr-2 h-4 w-4" />
                      View in Library
                    </Button>
                  </Link>
                </div>
              ) : isFailed ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className="glass border-0"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="glass border-0">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Processing... Please do not close this page</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
