"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { resetPassword } from "@/lib/auth"
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth"

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      setError(null)
      await resetPassword(values.email)
      setSuccess(true)
      form.reset()
    } catch (error: any) {
      console.error("Reset password error:", error)
      setError(error.message || "Failed to send reset password email. Please try again.")
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
            <CardTitle className="text-2xl font-bold text-center text-[#1d1c1d]">Reset your password</CardTitle>
            <CardDescription className="text-center text-[#616061]">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
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
                <AlertTitle>Check your email</AlertTitle>
                <AlertDescription>
                  We've sent you a password reset link. Please check your email and follow the instructions. If you
                  don't see the email, please check your spam folder.
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#1d1c1d]">Email</FormLabel>
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

                  <Button
                    type="submit"
                    className="w-full bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <Link href="/login" className="text-[#ff6a00]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
