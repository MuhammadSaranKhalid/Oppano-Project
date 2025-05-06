"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@refinedev/core";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { supabaseBrowserClient as supabase } from "@utils/supabase/client";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Use the Refine useLogin hook
  const { mutate: login, isLoading: isLoginLoading } = useLogin();

  // Check for verification success message
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      setSuccess("Email verified successfully! You can now log in.");
    }
  }, [searchParams]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Use both form submission loading state and login mutation loading state
  const isLoading = form.formState.isSubmitting || isLoginLoading;

  function onSubmit(values: LoginFormValues) {
    setError(null);
    setSuccess(null);

    // Use the login function from useLogin hook
    // This will call the login method from your authProviderClient
    login(
      { email: values.email, password: values.password },
      {
        onSuccess: (data) => {
          // Only proceed if the login was actually successful
          if (data?.success) {
            setSuccess("Login successful! Redirecting to your dashboard...");

            // The redirectTo from the auth provider will be used automatically
            // But we can also handle navigation manually if needed
            if (data?.redirectTo) {
              router.push(data.redirectTo);
            } else {
              router.push(redirectTo);
            }
            router.refresh();
          } else {
            // Handle case where success is false but no error was thrown
            setError(
              "Login failed. Please check your credentials and try again."
            );
          }
        },
        onError: (error: any) => {
          console.error("Login error:", error);
          setError(
            error?.message ||
              "Failed to sign in. Please check your credentials and try again."
          );

          // Focus on the email field if it's an invalid email
          if (error?.name === "invalid_email") {
            form.setFocus("email");
          }

          // Focus on the password field for credential errors
          if (
            error?.name === "invalid_credentials" ||
            error?.name === "LoginError"
          ) {
            form.setFocus("password");
          }
        },
      }
    );
  }

  async function handleGoogleSignIn() {
    try {
      setError(null);
      setSuccess(null);
      setIsGoogleLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Google sign in error:", error);
      setError(
        error.message || "Failed to sign in with Google. Please try again."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8 bg-[#f8f8f8]">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <Link href="/">
            <Image
              src="/opano-logo.png"
              alt="Opano Logo"
              width={180}
              height={48}
              className="h-10 w-auto mx-auto"
              priority
            />
          </Link>
        </div>

        <Card className="w-full border-[#dadbd8] shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#1d1c1d]">
              Log in to Opano
            </CardTitle>
            <CardDescription className="text-center text-[#616061]">
              Enter your email and password to access your workspaces
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-50 text-green-700 animate-in fade-in-50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#1d1c1d]">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@work-email.com"
                          {...field}
                          disabled={isLoading}
                          className="border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0"
                          autoComplete="email"
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium text-[#1d1c1d]">
                          Password
                        </FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-[#ff6a00] hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            disabled={isLoading}
                            className="border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10"
                            autoComplete="current-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full px-3 py-2 text-[#696969] hover:text-[#1d1c1d] hover:bg-transparent"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>

                <div className="flex items-center gap-2 py-2">
                  <Separator className="flex-1 bg-[#dadbd8]" />
                  <span className="text-xs text-[#616061]">OR</span>
                  <Separator className="flex-1 bg-[#dadbd8]" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#bbbbbb] hover:bg-[#f8f8f8] hover:text-[#1d1c1d]"
                  disabled={isLoading || isGoogleLoading}
                  onClick={handleGoogleSignIn}
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting to Google...
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        className="mr-2"
                      >
                        <path
                          fill="#4285f4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34a853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#fbbc05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#ea4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue With Google
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-[#696969]">
              Do not have an account?{" "}
              <Link href="/signup" className="text-[#ff6a00] hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="w-full max-w-md mx-auto px-4 mt-8 flex items-center justify-between text-sm text-[#616061]">
        <div className="flex space-x-4">
          <Link href="#" className="hover:underline">
            Privacy & Terms
          </Link>
          <Link href="#" className="hover:underline">
            Contact Us
          </Link>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center hover:bg-transparent hover:underline p-0"
        >
          <span className="mr-1">Change region</span>
          <ChevronDown size={16} />
        </Button>
      </div>
    </div>
  );
}
