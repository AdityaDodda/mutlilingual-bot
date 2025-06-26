import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Globe, 
  Upload, 
  Languages, 
  Download, 
  FileText, 
  Video, 
  Music, 
  Presentation,
  Zap,
  Shield,
  Star
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Languages className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              LingoMorph
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Pricing</a>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/login'}
            className="gradient-primary text-white hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 text-sm">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Translation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Transform Your Content
              <br />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Across Languages
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload documents, presentations, audio, and video files. Our AI instantly converts them 
              into 100+ languages while preserving formatting and context.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/login'}
                className="gradient-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 neumorphic"
              >
                <Upload className="mr-2 h-5 w-5" />
                Start Converting Now
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="glass border-0 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Hero Image/Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="glass rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-purple-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: FileText, label: "Documents", color: "text-red-500" },
                  { icon: Presentation, label: "Presentations", color: "text-blue-500" },
                  { icon: Music, label: "Audio", color: "text-green-500" },
                  { icon: Video, label: "Video", color: "text-purple-500" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="text-center p-4"
                  >
                    <div className={`w-16 h-16 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center mx-auto mb-3 animate-float`} style={{ animationDelay: `${index * 0.5}s` }}>
                      <item.icon className={`h-8 w-8 ${item.color}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white/30 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need for seamless content translation</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Languages,
                title: "100+ Languages",
                description: "Support for over 100 languages with native speaker quality translations"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Convert files in minutes, not hours. Our AI processes content at incredible speed"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Enterprise-grade security ensures your sensitive documents remain protected"
              },
              {
                icon: FileText,
                title: "Format Preservation",
                description: "Maintain original formatting, layouts, and styling across all file types"
              },
              {
                icon: Globe,
                title: "Auto-Detection",
                description: "Automatically detect source language and optimize translation accuracy"
              },
              {
                icon: Download,
                title: "Multiple Formats",
                description: "Export to PDF, DOCX, PPTX, MP3, MP4 and more based on your needs"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass border-0 h-full card-hover">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Simple, fast, and reliable in just 3 steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Files",
                description: "Drag and drop your documents, presentations, audio, or video files. We support all major formats."
              },
              {
                step: "02", 
                title: "Select Languages",
                description: "Choose your target languages from our list of 100+ supported languages. Our AI auto-detects the source."
              },
              {
                step: "03",
                title: "Download Results",
                description: "Get your translated files in minutes. Preview before downloading and access them anytime in your library."
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white/30 dark:bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Go Global?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of users who trust LingoMorph for their content translation needs.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/login'}
              className="gradient-primary text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 neumorphic animate-glow"
            >
              Start Your Free Trial
            </Button>
            <div className="flex items-center justify-center mt-6 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-400">Rated 4.9/5 by 10,000+ users</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Languages className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              LingoMorph
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 LingoMorph. All rights reserved. Transform your content across languages.
          </p>
        </div>
      </footer>
    </div>
  );
}
