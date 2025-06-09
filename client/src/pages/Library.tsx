import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import AssetCard from "@/components/AssetCard";
import PreviewModal from "@/components/PreviewModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Search, 
  Grid3X3, 
  List,
  FileText,
  Filter,
  SortAsc,
  RefreshCw,
  Folder
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { File, ConvertedFile } from "@/lib/types";

type ViewMode = "grid" | "list";
type SortBy = "recent" | "name" | "size" | "type";
type FilterType = "all" | "pdf" | "docx" | "pptx" | "mp3" | "mp4" | "wav" | "avi";

export default function Library() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedFile, setSelectedFile] = useState<File | ConvertedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: filesData, isLoading: isLoadingFiles, error: filesError } = useQuery({
    queryKey: ["/api/files"],
    retry: false,
  });

  const { data: convertedFilesData, isLoading: isLoadingConverted } = useQuery({
    queryKey: ["/api/files/converted"],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileId: number) => {
      await apiRequest('DELETE', `/api/files/${fileId}`);
    },
    onSuccess: () => {
      toast({
        title: "File deleted",
        description: "File has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/converted"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isLoading = isLoadingFiles || isLoadingConverted;
  const files = filesData?.files || [];
  const convertedFiles = convertedFilesData?.convertedFiles || [];

  // Combine and filter files
  const allFiles = [
    ...files.map((f: File) => ({ ...f, type: 'original' })),
    ...convertedFiles.map((f: ConvertedFile) => ({ ...f, type: 'converted' }))
  ];

  const filteredFiles = allFiles.filter(file => {
    // Search filter
    if (searchQuery && !file.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !file.filename?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filterType !== "all") {
      const fileExtension = file.originalName?.split('.').pop()?.toLowerCase() || 
                           file.filename?.split('.').pop()?.toLowerCase() || '';
      if (filterType !== fileExtension) {
        return false;
      }
    }

    return true;
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.originalName || a.filename || '').localeCompare(b.originalName || b.filename || '');
      case "size":
        return (b.size || 0) - (a.size || 0);
      case "type":
        const aExt = (a.originalName || a.filename || '').split('.').pop() || '';
        const bExt = (b.originalName || b.filename || '').split('.').pop() || '';
        return aExt.localeCompare(bExt);
      case "recent":
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const handlePreview = (file: File | ConvertedFile) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const handleDelete = (fileId: number) => {
    deleteMutation.mutate(fileId);
  };

  const handleDownload = (file: File | ConvertedFile) => {
    // In a real implementation, this would download the file
    toast({
      title: "Download started",
      description: `Downloading ${file.originalName || file.filename}`,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Asset Library</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and access your converted files
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass border-0 pl-10 w-64"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-1 glass rounded-xl p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-primary text-white" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-primary text-white" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-wrap items-center gap-4"
        >
          <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
            <SelectTrigger className="glass border-0 w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="docx">DOCX</SelectItem>
              <SelectItem value="pptx">PPTX</SelectItem>
              <SelectItem value="mp3">MP3</SelectItem>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="wav">WAV</SelectItem>
              <SelectItem value="avi">AVI</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
            <SelectTrigger className="glass border-0 w-48">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="size">File Size</SelectItem>
              <SelectItem value="type">File Type</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="glass border-0"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/files"] });
              queryClient.invalidateQueries({ queryKey: ["/api/files/converted"] });
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Files", value: allFiles.length, color: "text-blue-600" },
            { label: "Original Files", value: files.length, color: "text-green-600" },
            { label: "Converted Files", value: convertedFiles.length, color: "text-purple-600" },
            { label: "Filtered Results", value: sortedFiles.length, color: "text-orange-600" }
          ].map((stat, index) => (
            <Card key={stat.label} className="glass border-0">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Files Grid/List */}
        {sortedFiles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedFiles.map((file, index) => (
                  <motion.div
                    key={`${file.id}-${file.type}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <AssetCard
                      file={file}
                      onPreview={() => handlePreview(file)}
                      onDownload={() => handleDownload(file)}
                      onDelete={() => handleDelete(file.id)}
                      isDeleting={deleteMutation.isPending}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedFiles.map((file, index) => (
                  <motion.div
                    key={`${file.id}-${file.type}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="glass rounded-xl p-6 flex items-center justify-between file-preview"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{file.originalName || file.filename}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                          {file.type === "converted" && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                Converted
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(file)}>
                        Preview
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                        Download
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(file.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center py-16"
          >
            <Folder className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4">
              {searchQuery || filterType !== "all" ? "No matching files" : "No files yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {searchQuery || filterType !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Upload your first file to get started with LingoMorph"
              }
            </p>
            {!searchQuery && filterType === "all" && (
              <Button className="gradient-primary text-white">
                Upload Files
              </Button>
            )}
          </motion.div>
        )}

        {/* Preview Modal */}
        <PreviewModal
          file={selectedFile}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedFile(null);
          }}
        />
      </div>
    </Layout>
  );
}
