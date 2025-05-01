"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";
import { useRegister } from "@refinedev/core";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: register } = useRegister();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
    mode: "onChange",
  });

  const isLoading = form.formState.isSubmitting;
  const password = form.watch("password");

  // Password validation checks
  const hasMinLength = password?.length >= 8;
  const hasUppercase = /[A-Z]/.test(password || "");
  const hasNumber = /[0-9]/.test(password || "");
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password || "");

  async function onSubmit(values: SignupFormValues) {
    try {
      await register(values);
      // router.push("/dashboard");
    } catch (error) {
      // Error is handled by the store
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-8 bg-[#f8f8f8]">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <Image
            src="/placeholder.svg?height=40&width=150"
            alt="Opano Logo"
            width={150}
            height={40}
            className="mx-auto"
          />
        </div>

        <Card className="w-full border-[#dadbd8] shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#1d1c1d]">
              Sign up for Opano
            </CardTitle>
            <CardDescription className="text-center text-[#616061]">
              Create your account to get started with Opano
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle
                  className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                  size={16}
                />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )} */}

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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#1d1c1d]">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          {...field}
                          disabled={isLoading}
                          className="border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0"
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
                      <FormLabel className="text-sm font-medium text-[#1d1c1d]">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...field}
                            disabled={isLoading}
                            className="border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10"
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

                {/* Password requirements */}
                <div className="bg-[#f8f8f8] p-3 rounded border border-[#dadbd8]">
                  <p className="text-sm font-medium text-[#1d1c1d] mb-2">
                    Password requirements:
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm">
                      {hasMinLength ? (
                        <Check size={16} className="text-green-500 mr-2" />
                      ) : (
                        <X size={16} className="text-[#696969] mr-2" />
                      )}
                      At least 8 characters
                    </li>
                    <li className="flex items-center text-sm">
                      {hasUppercase ? (
                        <Check size={16} className="text-green-500 mr-2" />
                      ) : (
                        <X size={16} className="text-[#696969] mr-2" />
                      )}
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center text-sm">
                      {hasNumber ? (
                        <Check size={16} className="text-green-500 mr-2" />
                      ) : (
                        <X size={16} className="text-[#696969] mr-2" />
                      )}
                      At least one number
                    </li>
                    <li className="flex items-center text-sm">
                      {hasSpecialChar ? (
                        <Check size={16} className="text-green-500 mr-2" />
                      ) : (
                        <X size={16} className="text-[#696969] mr-2" />
                      )}
                      At least one special character
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign up"}
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
                  disabled={isLoading}
                  onClick={() => {
                    // This would be implemented with Supabase OAuth
                  }}
                >
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
                  Sign up with Google
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-[#696969]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#ff6a00] hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-sm text-[#696969]">
          <p>
            By signing up, you agree to our{" "}
            <Link href="#" className="text-[#ff6a00] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[#ff6a00] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
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
