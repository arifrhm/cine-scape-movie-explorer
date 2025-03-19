
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginFormData } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Lock } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";

// Define form schema with Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuthStore();
  
  // Initialize form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  // Demo credentials info
  const fillDemoCredentials = () => {
    form.setValue("email", "user@example.com");
    form.setValue("password", "password");
  };
  
  return (
    <AnimatedPage>
      <main className="min-h-screen pt-16 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8 bg-card p-8 sm:p-10 rounded-xl shadow-sm border"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to CineScape
            </p>
          </div>
          
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your password"
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
          
          {/* Demo credentials */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground py-2">
              Demo credentials
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-sm text-left max-w-sm mx-auto">
              <div className="mb-2">
                <span className="text-muted-foreground">Email:</span> user@example.com
              </div>
              <div>
                <span className="text-muted-foreground">Password:</span> password
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fillDemoCredentials}
              className="mt-3 h-8"
            >
              Fill demo credentials
            </Button>
          </div>
          
          {/* Sign up link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </div>
          
          {/* Secure login badge */}
          <div className="flex items-center justify-center text-xs text-muted-foreground mt-6">
            <Lock className="h-3 w-3 mr-1" />
            <span>Secure Login</span>
          </div>
        </motion.div>
      </main>
    </AnimatedPage>
  );
};

export default Login;
