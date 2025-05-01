"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { AlertCircle, Eye, EyeOff, CheckCircle, Loader2, Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { updatePassword } from "@/lib/auth"
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth"

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate on change for better user feedback
  })

  const isLoading = form.formState.isSubmitting

  // Watch password to calculate strength
  const password = form.watch("password")

  // Check if we have a valid token in the URL
  useEffect(() => {
    const hasToken = searchParams.has("token") || searchParams.has("access_token")
    if (!hasToken) {
      setError("Invalid or missing reset token. Please request a new password reset link.")
    }
  }, [searchParams])

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 20

    // Character type checks
    if (/[A-Z]/.test(password)) strength += 20 // Uppercase
    if (/[a-z]/.test(password)) strength += 20 // Lowercase
    if (/[0-9]/.test(password)) strength += 20 // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 20 // Special characters

    return strength
  }

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password))
  }, [password])

  async function onSubmit(values: ResetPasswordFormValues) {
    try {
      setError(null)
      await updatePassword(values.password)
      setSuccess(true)

      // Redirect to login after successful password reset
      setTimeout(() => {
        router.push("/login?reset=success")
      }, 3000)
    } catch (error: any) {
      console.error("Reset password error:", error)
      setError(error.message || "Failed to reset password. Please try again or request a new reset link.")
    }
  }

  // Get strength color
  const getStrengthColor = (strength: number) => {
    if (strength < 40) return "bg-red-500"
    if (strength < 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Get strength label
  const getStrengthLabel = (strength: number) => {
    if (strength < 40) return "Weak"
    if (strength < 80) return "Good"
    return "Strong"
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
            <CardTitle className="text-2xl font-bold text-center text-[#1d1c1d]">Reset your password</CardTitle>
            <CardDescription className="text-center text-[#616061]">Enter your new password below</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <Alert className="border-green-500 bg-green-50 text-green-700 animate-in fade-in-50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Password reset successful</AlertTitle>
                <AlertDescription>
                  Your password has been reset successfully. You will be redirected to the login page.
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#1d1c1d]">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your new password"
                              {...field}
                              disabled={isLoading}
                              className="border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10"
                              autoComplete="new-password"
                              onChange={(e) => {
                                field.onChange(e)
                                setPasswordStrength(calculatePasswordStrength(e.target.value))
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-0 top-0 h-full px-3 py-2 text-[#696969] hover:text-[#1d1c1d] hover:bg-transparent"
                              disabled={isLoading}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                          </div>
                        </FormControl>
                        {password && (
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Password strength:</span>
                              <span
                                className={`text-xs font-medium ${
                                  passwordStrength < 40
                                    ? "text-red-500"
                                    : passwordStrength < 80
                                      ? "text-yellow-500"
                                      : "text-green-500"
                                }`}
                              >
                                {getStrengthLabel(passwordStrength)}
                              </span>
                            </div>
                            <Progress
                              value={passwordStrength}
                              className="h-1"
                              indicatorClassName={getStrengthColor(passwordStrength)}
                            />
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Info size={12} />
                              <span>Password must include uppercase, lowercase, numbers, and special characters</span>
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#1d1c1d]">Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your new password"
                              {...field}
                              disabled={isLoading}
                              className="border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10"
                              autoComplete="new-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-0 top-0 h-full px-3 py-2 text-[#696969] hover:text-[#1d1c1d] hover:bg-transparent"
                              disabled={isLoading}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
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
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-[#696969]">
              Remember your password?{" "}
              <Link href="/login" className="text-[#ff6a00] hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
