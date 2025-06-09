import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  User, 
  Bell, 
  Globe, 
  Palette, 
  Save,
  Lock,
  Mail,
  Clock
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useTheme } from "@/hooks/useTheme";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    preferredLanguage: "en",
  });

  const [notifications, setNotifications] = useState({
    conversionComplete: true,
    errorNotifications: true,
    weeklyDigest: false,
    productUpdates: false,
  });

  const { data: preferencesData, isLoading } = useQuery({
    queryKey: ["/api/preferences"],
    retry: false,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', '/api/preferences', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
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
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Initialize form data from user and preferences
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        preferredLanguage: user.preferredLanguage || "en",
      });
    }
  }, [user]);

  useEffect(() => {
    if (preferencesData?.preferences) {
      const prefs = preferencesData.preferences;
      if (prefs.notificationSettings) {
        setNotifications(prefs.notificationSettings);
      }
    }
  }, [preferencesData]);

  const handleSave = () => {
    const data = {
      notificationSettings: notifications,
      defaultSourceLanguage: "auto",
      defaultTargetLanguages: [],
      theme,
    };

    updatePreferencesMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
            </div>
          ))}
        </div>
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
          <h1 className="text-3xl font-bold mb-4">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your LingoMorph experience
          </p>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">Profile Picture</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Managed through your authentication provider
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="glass border-0"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Managed by your authentication provider</p>
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="glass border-0"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Managed by your authentication provider</p>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="glass border-0"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Managed by your authentication provider</p>
                </div>
                <div>
                  <Label htmlFor="preferredLanguage">Interface Language</Label>
                  <Select 
                    value={formData.preferredLanguage} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, preferredLanguage: value }))}
                    disabled
                  >
                    <SelectTrigger className="glass border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Theme</Label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {[
                    { key: "light", label: "Light", icon: "☀️" },
                    { key: "dark", label: "Dark", icon: "🌙" },
                    { key: "system", label: "System", icon: "💻" }
                  ].map((themeOption) => (
                    <button
                      key={themeOption.key}
                      onClick={() => setTheme(themeOption.key as any)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === themeOption.key 
                          ? "border-primary bg-primary/10" 
                          : "border-gray-200 dark:border-gray-700 glass"
                      }`}
                    >
                      <div className="text-2xl mb-2">{themeOption.icon}</div>
                      <div className="font-medium">{themeOption.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  key: "conversionComplete",
                  icon: <Clock className="h-5 w-5" />,
                  title: "Conversion Complete",
                  description: "Get notified when file conversion is complete"
                },
                {
                  key: "errorNotifications",
                  icon: <Bell className="h-5 w-5" />,
                  title: "Error Notifications",
                  description: "Get notified when conversion fails"
                },
                {
                  key: "weeklyDigest",
                  icon: <Mail className="h-5 w-5" />,
                  title: "Weekly Digest",
                  description: "Receive weekly usage summary"
                },
                {
                  key: "productUpdates",
                  icon: <Globe className="h-5 w-5" />,
                  title: "Product Updates",
                  description: "Get notified about new features and improvements"
                }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      {setting.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{setting.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[setting.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, [setting.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Authentication</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Managed through your authentication provider
                  </p>
                </div>
                <Button variant="outline" className="glass border-0" disabled>
                  External Provider
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Sign Out</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sign out of your LingoMorph account
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="glass border-0 text-red-600 hover:text-red-700"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleSave}
            disabled={updatePreferencesMutation.isPending}
            className="gradient-primary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {updatePreferencesMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
