import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";
// Removed LanguageSelector as we are building a custom multi-select
// import LanguageSelector from "@/components/LanguageSelector"; 
import ConversionStatus from "@/components/ConversionStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Upload as UploadIcon, 
  Settings, 
  ChevronDown, 
  Wand2,
  Languages,
  Eye,
  ArrowRight,
  Clock,
  Check // Added Check icon for multi-select visual
} from "lucide-react";
import type { File } from "@/lib/types";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
// Assuming you have a utility for merging class names (e.g., from shadcn/ui)
// import { cn } from "@/lib/utils"; 

export default function Upload() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState<string>("");
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionJobId, setConversionJobId] = useState<number | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<string>("auto");

  const MAX_TARGET_LANGUAGES = 10;

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      const response = await apiRequest('POST', '/api/files/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setUploadedFiles(data.files);
      toast({
        title: "Files uploaded successfully",
        description: `${data.files.length} file(s) uploaded and ready for conversion`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const conversionMutation = useMutation({
    mutationFn: async () => {
      if (uploadedFiles.length === 0 || targetLanguages.length === 0) {
        throw new Error("Please upload files and select target languages");
      }

      const results = [];
      // This loop assumes a single conversion job ID per file. If your backend
      // supports a single job for multiple files, you might adjust this.
      for (const file of uploadedFiles) {
        const response = await apiRequest('POST', `/api/files/${file.id}/convert`, {
          sourceLanguage,
          targetLanguages,
          outputFormat,
          preserveFormatting,
        });
        const result = await response.json();
        results.push(result);
      }
      return results;
    },
    onSuccess: (data) => {
      setIsConverting(true);
      // Assuming the first file's job ID is representative for the status check
      if (data.length > 0) {
        setConversionJobId(data[0].jobId); 
      }
      toast({
        title: "Conversion started",
        description: "Your files are being processed. You'll be notified when complete.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: (error) => {
      toast({
        title: "Conversion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (files: FileList) => {
    uploadMutation.mutate(files);
  };

  const handleRemoveFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // New function to handle adding/removing target languages
  const handleToggleTargetLanguage = (langCode: string) => {
    setTargetLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      } else if (prev.length < MAX_TARGET_LANGUAGES) {
        return [...prev, langCode];
      } else {
        return prev;
      }
    });
  };

  const handleConvert = () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files to convert",
        description: "Please upload files first",
        variant: "destructive",
      });
      return;
    }

    if (targetLanguages.length === 0) {
      toast({
        title: "No target languages selected",
        description: "Please select at least one target language",
        variant: "destructive",
      });
      return;
    }

    conversionMutation.mutate();
  };

  if (isConverting && conversionJobId) {
    return (
      <Layout>
        <ConversionStatus 
          // Note: ConversionStatus currently takes a single fileId. 
          // If you support multiple files being converted simultaneously, 
          // you might need to adjust ConversionStatus or pass a list of IDs.
          fileId={uploadedFiles[0]?.id} 
          onComplete={() => {
            setIsConverting(false);
            setConversionJobId(null);
            setUploadedFiles([]);
            setTargetLanguages([]);
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Convert Your Files</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload your files and transform them into any language in seconds
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UploadIcon className="mr-2 h-5 w-5" />
                File Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader 
                onUpload={handleFileUpload}
                isUploading={uploadMutation.isPending}
              />
              
              {/* Source Language Selector (Existing) */}
              <div className="mt-6">
                <label className="block font-semibold mb-2">Source Language</label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-full glass border-0">
                    <SelectValue placeholder="Select source language..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">
                      <div className="flex items-center">
                        <Wand2 className="mr-2 h-4 w-4 opacity-70" />
                        <span>Auto-Detect (Recommended)</span>
                      </div>
                    </SelectItem>
                    {SUPPORTED_LANGUAGES.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">{language.flag}</span>
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Language Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold">Target Languages</label>
                  <span className="text-xs text-gray-500">Max {MAX_TARGET_LANGUAGES}</span>
                </div>
                {/* 
                  We are using the ShadCN `Select` component for its Trigger and Content structure.
                  However, the actual multi-select logic is handled manually within the SelectContent 
                  using custom divs instead of `SelectItem` to prevent closing on each click.
                */}
                <Select>
                  <SelectTrigger className="w-full glass border-0 min-h-[40px]"> {/* min-h for consistent height */}
                    {targetLanguages.length > 0 ? (
                      <div className="flex flex-wrap gap-2 py-1 px-1"> {/* Added padding for visual alignment */}
                        {targetLanguages.slice(0, 3).map(code => { // Display up to 3 badges
                          const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
                          return lang ? (
                            <Badge key={code} variant="secondary" className="pr-1 text-sm">
                              <span className="mr-1 text-base">{lang.flag}</span>{lang.name}
                            </Badge>
                          ) : null;
                        })}
                        {targetLanguages.length > 3 && ( // Indicate if more languages are selected
                          <Badge variant="outline" className="text-gray-500 text-sm">
                            +{targetLanguages.length - 3} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">Select target languages...</span>
                    )}
                  </SelectTrigger>
                  <SelectContent className="glass max-h-60 overflow-y-auto">
                    {SUPPORTED_LANGUAGES.map((language) => {
                      const isSelected = targetLanguages.includes(language.code);
                      const isDisabled = !isSelected && targetLanguages.length >= MAX_TARGET_LANGUAGES;
                      return (
                        <div 
                          key={language.code}
                          // Replicating ShadCN SelectItem styling for visual consistency
                          className={`relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                          onClick={(e) => {
                            e.preventDefault(); // Prevents any default browser behavior, though not strictly needed here for Select behavior
                            if (!isDisabled) handleToggleTargetLanguage(language.code);
                          }}
                        >
                          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            {isSelected && (
                              <Check className="h-4 w-4" />
                            )}
                          </span>
                          <span className="mr-3 text-lg">{language.flag}</span>
                          <span>{language.name}</span>
                        </div>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Uploaded Files</h4>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 glass rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <UploadIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{file.originalName}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              {file.sourceLanguage && (
                                <>
                                  <span>•</span>
                                  <Badge variant="secondary">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {file.sourceLanguage.toUpperCase()}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Advanced Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="glass border-0">
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-white/10 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Advanced Options
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Output Format</label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger className="glass border-0">
                        <SelectValue placeholder="Same as original" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="docx">DOCX</SelectItem>
                        <SelectItem value="pptx">PPTX</SelectItem>
                        <SelectItem value="txt">Text Summary</SelectItem>
                        <SelectItem value="mp3">Audio Translation</SelectItem>
                        <SelectItem value="mp4">Video with Subtitles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="preserve-formatting"
                        checked={preserveFormatting}
                        onCheckedChange={(checked) => setPreserveFormatting(!!checked)}
                      />
                      <label htmlFor="preserve-formatting" className="text-sm">
                        Preserve original formatting
                      </label>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </motion.div>

        {/* Convert Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleConvert}
            disabled={uploadedFiles.length === 0 || targetLanguages.length === 0 || conversionMutation.isPending}
            className="gradient-primary text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 neumorphic"
          >
            {conversionMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Converting...
              </>
            ) : (
              <>
                <Wand2 className="mr-3 h-5 w-5" />
                Convert Files
              </>
            )}
          </Button>
          
          {uploadedFiles.length > 0 && targetLanguages.length > 0 && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Estimated time: 2-5 minutes</span>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}