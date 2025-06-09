import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  FileText, 
  Languages, 
  Upload, 
  Download, 
  Share2, 
  Users, 
  Clock, 
  Shield, 
  Zap,
  Globe,
  FileAudio,
  FileVideo,
  Presentation,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: FileText,
    title: "Multi-Format Support",
    description: "Convert PDF, DOCX, PPTX, MP3, MP4, WAV, and AVI files seamlessly",
    formats: ["PDF", "DOCX", "PPTX", "MP3", "MP4", "WAV", "AVI"]
  },
  {
    icon: Languages,
    title: "100+ Languages",
    description: "Support for over 100 languages with AI-powered translation",
    languages: ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic", "+94 more"]
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Advanced processing engine delivers results in minutes, not hours",
    metrics: ["<5 min", "Average", "Processing"]
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and secure file handling for your sensitive documents",
    security: ["SSL/TLS", "AES-256", "SOC 2"]
  }
];

const fileTypes = [
  { icon: FileText, name: "Documents", types: ["PDF", "DOCX"], color: "bg-blue-500" },
  { icon: Presentation, name: "Presentations", types: ["PPTX"], color: "bg-orange-500" },
  { icon: FileAudio, name: "Audio", types: ["MP3", "WAV"], color: "bg-green-500" },
  { icon: FileVideo, name: "Video", types: ["MP4", "AVI"], color: "bg-purple-500" }
];

const workflow = [
  { step: 1, title: "Upload Files", description: "Drag & drop or select your files", icon: Upload },
  { step: 2, title: "Select Languages", description: "Choose target languages from 100+ options", icon: Languages },
  { step: 3, title: "AI Processing", description: "Our AI engine converts your content", icon: Zap },
  { step: 4, title: "Download & Share", description: "Get your converted files instantly", icon: Download }
];

export default function Features() {
  const { user } = useAuth() as { user: any };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LingoMorph
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {user?.firstName || user?.email}
            </span>
            <Link href="/upload">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Start Converting
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              World-Class Multilingual
              <br />
              Document Converter
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your documents, presentations, and media files into any of 100+ languages 
              with AI-powered precision and enterprise-grade security.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/upload">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Files
                </Button>
              </Link>
              <Link href="/library">
                <Button size="lg" variant="outline">
                  <FileText className="mr-2 h-5 w-5" />
                  View Library
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* File Types */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Supported File Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fileTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap justify-center gap-2">
                      {type.types.map((format) => (
                        <Badge key={format} variant="secondary">{format}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {workflow.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  {index < workflow.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-gray-400 ml-4 hidden md:block" />
                  )}
                </div>
                <step.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {feature.formats && feature.formats.map((format) => (
                        <Badge key={format} variant="outline">{format}</Badge>
                      ))}
                      {feature.languages && feature.languages.slice(0, 6).map((lang) => (
                        <Badge key={lang} variant="outline">{lang}</Badge>
                      ))}
                      {feature.metrics && feature.metrics.map((metric) => (
                        <Badge key={metric} variant="outline">{metric}</Badge>
                      ))}
                      {feature.security && feature.security.map((sec) => (
                        <Badge key={sec} variant="outline">{sec}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Languages</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">7</div>
              <div className="text-gray-600 dark:text-gray-300">File Types</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-300">Accuracy</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">&lt;5min</div>
              <div className="text-gray-600 dark:text-gray-300">Avg Processing</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust LingoMorph for their multilingual document needs.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/upload">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Upload className="mr-2 h-5 w-5" />
                  Start Converting Now
                </Button>
              </Link>
              <Link href="/library">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <FileText className="mr-2 h-5 w-5" />
                  View My Files
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}