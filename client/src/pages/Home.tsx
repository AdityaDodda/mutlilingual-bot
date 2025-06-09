import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Upload, 
  FileText, 
  Languages, 
  Clock, 
  Download, 
  ArrowRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: filesData, isLoading: isLoadingFiles } = useQuery({
    queryKey: ["/api/files"],
    retry: false,
  });

  const { data: statsData } = useQuery({
    queryKey: ["/api/files/converted"],
    retry: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
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
  }, [user, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const recentFiles = filesData?.files?.slice(0, 3) || [];
  const totalFiles = filesData?.files?.length || 0;
  const convertedFiles = statsData?.convertedFiles?.length || 0;
  const processingFiles = filesData?.files?.filter((f: any) => f.status === "processing")?.length || 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="glass border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Welcome back, {user.firstName || "User"}! 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                    Ready to transform your content across languages?
                  </p>
                  <Link to="/upload">
                    <Button className="gradient-primary text-white hover:opacity-90 transition-opacity">
                      <Upload className="mr-2 h-4 w-4" />
                      Start Converting
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 md:mt-0 grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{totalFiles}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Files</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{convertedFiles}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Converted</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: FileText,
              title: "Total Files",
              value: totalFiles,
              color: "text-blue-600",
              bgColor: "bg-blue-100 dark:bg-blue-900/30"
            },
            {
              icon: Languages,
              title: "Languages",
              value: "12+",
              color: "text-green-600", 
              bgColor: "bg-green-100 dark:bg-green-900/30"
            },
            {
              icon: Clock,
              title: "Processing",
              value: processingFiles,
              color: "text-orange-600",
              bgColor: "bg-orange-100 dark:bg-orange-900/30"
            },
            {
              icon: Download,
              title: "Downloads",
              value: convertedFiles,
              color: "text-purple-600",
              bgColor: "bg-purple-100 dark:bg-purple-900/30"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass border-0 card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="glass border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <Upload className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Quick Upload</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Drag and drop your files or click to browse and start converting
                </p>
                <Link to="/upload">
                  <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-opacity">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Files
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="glass border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Activity className="mr-2 h-6 w-6" />
                  Recent Activity
                </h2>
                <Link to="/library">
                  <Button variant="outline" className="glass border-0">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {isLoadingFiles ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : recentFiles.length > 0 ? (
                <div className="space-y-4">
                  {recentFiles.map((file: any, index: number) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 glass rounded-xl file-preview"
                    >
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{file.originalName}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {file.sourceLanguage?.toUpperCase() || "EN"}
                          </Badge>
                          {file.targetLanguages && file.targetLanguages.length > 0 && (
                            <>
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                              <div className="flex space-x-1">
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
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={file.status === "completed" ? "default" : 
                                  file.status === "processing" ? "secondary" : "outline"}
                        >
                          {file.status}
                        </Badge>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No files yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Upload your first file to get started with LingoMorph
                  </p>
                  <Link to="/upload">
                    <Button className="gradient-primary text-white">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Now
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
