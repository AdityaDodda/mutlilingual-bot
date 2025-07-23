import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { 
  Languages, 
  Home, 
  Upload, 
  FolderOpen, 
  Settings,
  Sun,
  Moon,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Text Translate", href: "/text-translate", icon: Languages },
    { name: "Library", href: "/library", icon: FolderOpen },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation Header */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Languages className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                LingoMorph
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? "bg-primary text-white shadow-lg" 
                      : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-white/10"
                  }`}>
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg glass hover:bg-white/20 transition-all"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-gray-300" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
            </Button>
            
            {/* User Profile */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg uppercase">
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { localStorage.removeItem('token'); window.location.href = "/"; }}
              className="hidden md:flex items-center space-x-2 p-2 rounded-lg glass hover:bg-white/20 transition-all text-gray-600 dark:text-gray-300"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg glass hover:bg-white/20 transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 border-t border-white/20 dark:border-gray-700/20 pt-4"
            >
              <div className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                          isActive 
                            ? "bg-primary text-white shadow-lg" 
                            : "text-gray-600 dark:text-gray-300 hover:bg-white/10"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
                
                {/* Mobile User Section */}
                <div className="border-t border-white/20 dark:border-gray-700/20 pt-4 mt-4">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl uppercase">
                      {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { localStorage.removeItem('token'); window.location.href = "/"; }}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-all text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
