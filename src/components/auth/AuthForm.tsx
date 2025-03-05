
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthFormProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AuthForm = ({ activeTab, setActiveTab }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-medium text-center">
            {activeTab === "login" ? "Welcome Back" : "Join Our Team"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "login" 
              ? "Sign in to your consultant account" 
              : "Begin your journey as a Vamna Fragrances consultant"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading} 
              />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading}
                onSuccess={() => setActiveTab("login")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our
            {" "}
            <a href="/terms" className="text-accent hover:underline">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
