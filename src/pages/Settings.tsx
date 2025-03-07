import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Bell, User, Shield, Moon, Mail, Globe, Sun, Laptop } from "lucide-react";

const profileFormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
  language: z.string(),
});

const notificationFormSchema = z.object({
  marketingEmails: z.boolean().default(false),
  socialNotifications: z.boolean().default(true),
  securityNotifications: z.boolean().default(true),
  productUpdates: z.boolean().default(true),
});

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate("/auth");
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: "jane.doe@example.com",
      name: "Jane Doe",
      phone: "+1 (555) 123-4567",
      language: "en",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      marketingEmails: false,
      socialNotifications: true,
      securityNotifications: true,
      productUpdates: true,
    },
  });

  function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  }

  function onNotificationSubmit(data: z.infer<typeof notificationFormSchema>) {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-1/4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account preferences.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 px-6 pb-6">
                  <Button 
                    variant={activeTab === "account" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("account")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                  <Button 
                    variant={activeTab === "notifications" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    variant={activeTab === "privacy" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("privacy")}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy
                  </Button>
                  <Button 
                    variant={activeTab === "appearance" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("appearance")}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Appearance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full md:w-3/4">
            {activeTab === "account" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your personal information and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="pt">Portuguese</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and updates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...notificationForm}>
                    <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={notificationForm.control}
                          name="marketingEmails"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Marketing Emails</FormLabel>
                                <FormDescription>
                                  Receive emails about new products and offers.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="socialNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Social Notifications</FormLabel>
                                <FormDescription>
                                  Receive notifications about mentions, comments, etc.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="securityNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Security Alerts</FormLabel>
                                <FormDescription>
                                  Receive notifications about account security.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="productUpdates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Product Updates</FormLabel>
                                <FormDescription>
                                  Receive notifications about product updates and changes.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit">Save Preferences</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "privacy" && (
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Manage your privacy preferences and data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Data Usage</h3>
                    <p className="text-sm text-muted-foreground">
                      Control how your data is used and shared.
                    </p>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="data-usage" />
                      <label
                        htmlFor="data-usage"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Allow data collection for improving services
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Account Visibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your account and activity.
                    </p>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="profile-visibility" defaultChecked />
                      <label
                        htmlFor="profile-visibility"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Make profile visible to other users
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Download Your Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Download a copy of your data or request data deletion.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button variant="outline">Download Data</Button>
                      <Button variant="outline" className="text-red-500 hover:text-red-600">
                        Request Data Deletion
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize how the application looks and feels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred color theme.
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <Button variant="outline" className="justify-start">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Button>
                      <Button variant="default" className="justify-start">
                        <Laptop className="h-4 w-4 mr-2" />
                        System
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Font Size</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjust the size of text throughout the application.
                    </p>
                    <div className="flex items-center space-x-2 pt-2">
                      <Button variant="outline" className="h-8 w-8 p-0">A-</Button>
                      <Slider defaultValue={[50]} max={100} step={10} />
                      <Button variant="outline" className="h-8 w-8 p-0">A+</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
