import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Languages, Globe, FileText, Zap, Shield, Users,ArrowRight,Mail,Lock,Eye,EyeOff,Loader2} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupShowPassword, setSignupShowPassword] = useState(false);
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string; firstName: string; lastName: string }) => {
      const response = await apiRequest('POST', '/api/auth/register', credentials);
      if (!response.ok) throw new Error((await response.json()).message || 'Registration failed');
      return response.json();
    },
    onSuccess: (data) => {
      // Auto-login after signup
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate({ email, password });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupFirstName || !signupLastName || !signupEmail || !signupPassword || !signupConfirm) {
      toast({
        title: "Missing information",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    if (signupPassword !== signupConfirm) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    signupMutation.mutate({ email: signupEmail, password: signupPassword, firstName: signupFirstName, lastName: signupLastName });
  };

  const handleDemoLogin = () => {
    setEmail("demo@lingomorph.com");
    setPassword("demoqwerty");
    loginMutation.mutate({ email: "demo@lingomorph.com", password: "demoqwerty" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-conic from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-spin-slow rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-conic from-green-500/20 via-blue-500/20 to-purple-500/20 animate-spin-slow-reverse rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Languages className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LingoMorph
              </h1>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Transform Content Across
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                100+ Languages
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0">
              The world's most advanced multilingual content converter. Upload documents, presentations, and media files - get them converted to any language in minutes.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-xl p-4 border-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Multiple Formats</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">PDF, DOCX, PPTX, Audio & Video</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass rounded-xl p-4 border-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Lightning Fast</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">AI-powered conversions in minutes</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass rounded-xl p-4 border-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">100+ Languages</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Global language support</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass rounded-xl p-4 border-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Team Collaboration</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Share and work together</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <Card className="w-full max-w-md glass border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">
                {isSignUp ? "Create New Account" : "Welcome Back"}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                {isSignUp ? "Sign up to get started" : "Sign in to continue your linguistic journey"}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {isSignUp ? (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname" className="flex items-center">
                      First Name
                    </Label>
                    <Input
                      id="signup-firstname"
                      type="text"
                      placeholder="First Name"
                      value={signupFirstName}
                      onChange={(e) => setSignupFirstName(e.target.value)}
                      className="glass border-0 bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname" className="flex items-center">
                      Last Name
                    </Label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      placeholder="Last Name"
                      value={signupLastName}
                      onChange={(e) => setSignupLastName(e.target.value)}
                      className="glass border-0 bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="glass border-0 bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={signupShowPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="glass border-0 bg-white/50 dark:bg-gray-800/50 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setSignupShowPassword(!signupShowPassword)}
                      >
                        {signupShowPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Confirm Password
                    </Label>
                    <Input
                      id="signup-confirm"
                      type={signupShowPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      className="glass border-0 bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full gradient-primary text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    {signupMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing Up...
                      </>
                    ) : (
                      <>
                        Sign Up
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Already have an account?
                      <button
                        type="button"
                        className="ml-1 text-blue-600 hover:underline dark:text-blue-400"
                        onClick={() => setIsSignUp(false)}
                      >
                        Sign In
                      </button>
                    </span>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass border-0 bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass border-0 bg-white/50 dark:bg-gray-800/50 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                    </label>
                    {/* <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                      Forgot password?
                    </a> */}
                  </div>

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full gradient-primary text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {/* <div className="flex flex-col items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Don't have an account?
                      <button
                        type="button"
                        className="ml-1 text-blue-600 hover:underline dark:text-blue-400"
                        onClick={() => setIsSignUp(true)}
                      >
                        Sign Up
                      </button>
                    </span>
                  </div> */}
                </form>
              )}

              {/* <div className="relative">
                <Separator className="my-6" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-3 text-sm text-gray-600 dark:text-gray-400">
                  or try demo
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full glass border-0 py-3 hover:bg-white/20 dark:hover:bg-gray-800/20"
                onClick={handleDemoLogin}
                disabled={loginMutation.isPending}
              >
                <Users className="mr-2 h-4 w-4" />
                Demo Login
              </Button> */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}