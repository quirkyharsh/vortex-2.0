import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, LoginData } from "../../../shared/schema";
import { useAuth } from "@/contexts/auth-context";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (userData) => {
      login(userData);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      setLocation('/');
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-400/10 rounded-full blur-xl animate-bounce delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6 group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-bold text-xs">V.AI</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Varta.AI</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in">Welcome Back</h2>
          <p className="text-gray-300 text-lg">Sign in to continue your journey</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 relative shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
          {/* Signup Link in top right */}
          <Link href="/signup">
            <div className="absolute top-6 right-6 text-sm text-white/70 hover:text-white cursor-pointer font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              Create Account
              <span className="text-base transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-12">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 font-semibold text-sm uppercase tracking-wider">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="h-14 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:bg-white/10 transition-all duration-300 text-lg"
                      placeholder="Enter your email address"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/90 font-semibold text-sm uppercase tracking-wider">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="h-14 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 focus:bg-white/10 transition-all duration-300 text-lg pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="h-6 w-6" />
                        ) : (
                          <Eye className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <Label htmlFor="remember" className="text-sm text-white/80 hover:text-white cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password">
                <span className="text-sm text-purple-300 hover:text-purple-200 cursor-pointer transition-colors">
                  Forgot password?
                </span>
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/30 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing you in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Forgot Password Link - Bottom Center */}
            <div className="text-center mt-8">
              <Link href="/forgot-password">
                <span className="text-sm text-white/60 hover:text-purple-300 cursor-pointer transition-all duration-300 hover:underline">
                  Forgot your password?
                </span>
              </Link>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <span className="text-white/70 text-sm">Don't have an account? </span>
              <Link href="/signup">
                <span className="text-purple-300 hover:text-purple-200 cursor-pointer font-semibold text-sm transition-all duration-300 hover:underline">
                  Create one now
                </span>
              </Link>
            </div>
          </form>
        </Form>
        </div>
      </div>
    </div>
  );
}