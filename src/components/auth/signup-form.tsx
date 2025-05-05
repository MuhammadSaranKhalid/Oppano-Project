// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import Image from "next/image";
// // import Link from "next/link";
// // import {
// //   ChevronDown,
// //   Eye,
// //   EyeOff,
// //   AlertCircle,
// //   CheckCircle,
// //   Loader2,
// //   Info,
// //   Shield,
// //   X,
// //   Mail,
// //   Clock,
// // } from "lucide-react";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";

// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import { Separator } from "@/components/ui/separator";
// // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // import { Progress } from "@/components/ui/progress";
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipProvider,
// //   TooltipTrigger,
// // } from "@/components/ui/tooltip";

// // import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";
// // // import { signUp, type AccountStatus } from "@/lib/auth"
// // import { supabaseBrowserClient } from "@/utils/supabase/client";
// // import { AccountStatus } from "@lib/auth";
// // import { useRegister } from "@refinedev/core";

// // export default function SignUpForm() {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
// //   const [isSuccess, setIsSuccess] = useState(false);
// //   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
// //   const [passwordStrength, setPasswordStrength] = useState(0);
// //   const [passwordCriteria, setPasswordCriteria] = useState({
// //     length: false,
// //     uppercase: false,
// //     lowercase: false,
// //     number: false,
// //     special: false,
// //   });
// //   const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
// //     null
// //   );
// //   const [isRateLimited, setIsRateLimited] = useState(false);
// //   const router = useRouter();
// //   const { mutate: register } = useRegister();

// //   const form = useForm<SignupFormValues>({
// //     resolver: zodResolver(signupSchema),
// //     defaultValues: {
// //       name: "",
// //       email: "",
// //       password: "",
// //       confirmPassword: "",
// //     },
// //     mode: "onChange", // Validate on change for better user feedback
// //   });

// //   const isLoading = form.formState.isSubmitting;

// //   // Watch password to calculate strength and validate criteria
// //   const password = form.watch("password");
// //   const email = form.watch("email");

// //   // Reset account status when email changes
// //   useEffect(() => {
// //     if (accountStatus && email) {
// //       setAccountStatus(null);
// //     }
// //   }, [email, accountStatus]);

// //   // Reset rate limit error when form values change
// //   useEffect(() => {
// //     if (isRateLimited) {
// //       setIsRateLimited(false);
// //     }
// //   }, [form.watch(), isRateLimited]);

// //   // Calculate password strength and check criteria
// //   useEffect(() => {
// //     if (!password) {
// //       setPasswordStrength(0);
// //       setPasswordCriteria({
// //         length: false,
// //         uppercase: false,
// //         lowercase: false,
// //         number: false,
// //         special: false,
// //       });
// //       return;
// //     }

// //     const criteria = {
// //       length: password.length >= 8,
// //       uppercase: /[A-Z]/.test(password),
// //       lowercase: /[a-z]/.test(password),
// //       number: /[0-9]/.test(password),
// //       special: /[^A-Za-z0-9]/.test(password),
// //     };

// //     setPasswordCriteria(criteria);

// //     // Calculate strength based on criteria
// //     const metCriteria = Object.values(criteria).filter(Boolean).length;
// //     setPasswordStrength(metCriteria * 20);
// //   }, [password]);

// //   async function onSubmit(values: SignupFormValues) {
// //     try {
// //       setError(null);
// //       setFieldErrors({});
// //       setAccountStatus(null);
// //       setIsSuccess(false);
// //       setIsRateLimited(false);

// //       // const response = await signUp({
// //       //   email: values.email,
// //       //   password: values.password,
// //       //   name: values.name,
// //       // })
// //       await register(values);

// //       console.log("RESPONSE : ", response);

// //       // Check if the email already exists and its verification status
// //       if (response.emailStatus) {
// //         setAccountStatus(response.emailStatus);

// //         // If the account exists, focus on the email field
// //         if (response.emailStatus.exists) {
// //           form.setFocus("email");
// //           return;
// //         }
// //       }

// //       // If we get here, the account was created successfully
// //       setIsSuccess(true);

// //       // Check if we need to wait for email confirmation
// //       // Supabase returns user as null when email confirmation is required
// //       if (!response.user) {
// //         // Email confirmation required
// //         return;
// //       }

// //       // If no email confirmation required, redirect to dashboard
// //       // setTimeout(() => {
// //         router.push("/dashboard");
// //         router.refresh();
// //       // }, 2000);
// //     } catch (error: any) {
// //       console.error("Signup error:", error);

// //       // Handle rate limiting errors
// //       if (error.code === "rate_limit_exceeded") {
// //         setIsRateLimited(true);
// //         setError(
// //           error.message || "Too many requests. Please try again in a minute."
// //         );
// //         return;
// //       }

// //       // Handle field-specific errors
// //       if (error.field) {
// //         setFieldErrors({
// //           [error.field]: error.message,
// //         });
// //         form.setFocus(
// //           error.field as "email" | "password" | "name" | "confirmPassword"
// //         );
// //       } else {
// //         // General error
// //         setError(error.message || "Failed to sign up. Please try again.");
// //       }
// //     }
// //   }

// //   async function handleGoogleSignUp() {
// //     try {
// //       setError(null);
// //       setFieldErrors({});
// //       setIsGoogleLoading(true);

// //       // const { error } = await supabase.auth.signInWithOAuth({
// //       //   provider: "google",
// //       //   options: {
// //       //     redirectTo: `${window.location.origin}/auth/callback`,
// //       //   },
// //       // })

// //       if (error) throw error;
// //     } catch (error: any) {
// //       console.error("Google sign up error:", error);
// //       setError(
// //         error.message || "Failed to sign up with Google. Please try again."
// //       );
// //     } finally {
// //       setIsGoogleLoading(false);
// //     }
// //   }

// //   // Get strength color
// //   const getStrengthColor = (strength: number) => {
// //     if (strength < 40) return "bg-red-500";
// //     if (strength < 80) return "bg-yellow-500";
// //     return "bg-green-500";
// //   };

// //   // Get strength label
// //   const getStrengthLabel = (strength: number) => {
// //     if (strength < 40) return "Weak";
// //     if (strength < 80) return "Good";
// //     return "Strong";
// //   };

// //   // Render account status alert based on verification status
// //   const renderAccountStatusAlert = () => {
// //     if (!accountStatus?.exists) return null;

// //     if (accountStatus.verified) {
// //       return (
// //         <Alert className="border-blue-500 bg-blue-50 text-blue-700 animate-in fade-in-50">
// //           <Info className="h-4 w-4 text-blue-500" />
// //           <AlertTitle>Account Already Exists</AlertTitle>
// //           <AlertDescription className="flex flex-col gap-2">
// //             <p>
// //               An account with this email address already exists and has been
// //               verified.
// //             </p>
// //             <div className="flex flex-wrap gap-2">
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 className="border-blue-300 text-blue-700 hover:bg-blue-100"
// //                 onClick={() => router.push("/login")}
// //               >
// //                 Log in instead
// //               </Button>
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 className="border-blue-300 text-blue-700 hover:bg-blue-100"
// //                 onClick={() => router.push("/forgot-password")}
// //               >
// //                 Forgot password?
// //               </Button>
// //             </div>
// //           </AlertDescription>
// //         </Alert>
// //       );
// //     } else {
// //       return (
// //         <Alert className="border-amber-500 bg-amber-50 text-amber-700 animate-in fade-in-50">
// //           <Mail className="h-4 w-4 text-amber-500" />
// //           <AlertTitle>Email Verification Required</AlertTitle>
// //           <AlertDescription className="flex flex-col gap-2">
// //             <p>
// //               An account with this email address already exists but hasn't been
// //               verified yet. Please check your inbox for a verification email.
// //             </p>
// //             <div className="flex flex-wrap gap-2">
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 className="border-amber-300 text-amber-700 hover:bg-amber-100"
// //                 onClick={() => {
// //                   // Here you would implement a resend verification email function
// //                   alert("Verification email resent. Please check your inbox.");
// //                 }}
// //               >
// //                 Resend verification email
// //               </Button>
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 className="border-amber-300 text-amber-700 hover:bg-amber-100"
// //                 onClick={() => router.push("/login")}
// //               >
// //                 Try logging in
// //               </Button>
// //             </div>
// //           </AlertDescription>
// //         </Alert>
// //       );
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-between min-h-screen py-8 bg-[#f8f8f8]">
// //       <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-4">
// //         <div className="mb-8">
// //           <Link href="/">
// //             <Image
// //               src="/opano-logo.png"
// //               alt="Opano Logo"
// //               width={180}
// //               height={48}
// //               className="h-10 w-auto mx-auto"
// //               priority
// //             />
// //           </Link>
// //         </div>

// //         <Card className="w-full border-[#dadbd8] shadow-sm">
// //           <CardHeader className="space-y-1">
// //             <CardTitle className="text-2xl font-bold text-center text-[#1d1c1d]">
// //               Create your account
// //             </CardTitle>
// //             <CardDescription className="text-center text-[#616061]">
// //               Enter your information to get started with Opano
// //             </CardDescription>
// //           </CardHeader>

// //           <CardContent className="space-y-4">
// //             {error && !isRateLimited && (
// //               <Alert variant="destructive" className="animate-in fade-in-50">
// //                 <AlertCircle className="h-4 w-4" />
// //                 <AlertTitle>Sign Up Failed</AlertTitle>
// //                 <AlertDescription>{error}</AlertDescription>
// //               </Alert>
// //             )}

// //             {isRateLimited && (
// //               <Alert className="border-amber-500 bg-amber-50 text-amber-700 animate-in fade-in-50">
// //                 <Clock className="h-4 w-4 text-amber-500" />
// //                 <AlertTitle>Please Wait</AlertTitle>
// //                 <AlertDescription>
// //                   We're processing too many requests right now. Please wait a
// //                   moment and try again.
// //                 </AlertDescription>
// //               </Alert>
// //             )}

// //             {isSuccess && !accountStatus?.exists && (
// //               <Alert className="border-green-500 bg-green-50 text-green-700 animate-in fade-in-50">
// //                 <CheckCircle className="h-4 w-4 text-green-500" />
// //                 <AlertTitle>Account Created Successfully</AlertTitle>
// //                 <AlertDescription>
// //                   Please check your email for confirmation instructions. You'll
// //                   need to verify your email before logging in.
// //                 </AlertDescription>
// //               </Alert>
// //             )}

// //             {renderAccountStatusAlert()}

// //             <Form {...form}>
// //               <form
// //                 onSubmit={form.handleSubmit(onSubmit)}
// //                 className="space-y-4"
// //               >
// //                 <FormField
// //                   control={form.control}
// //                   name="name"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel className="text-sm font-medium text-[#1d1c1d]">
// //                         Full Name
// //                       </FormLabel>
// //                       <FormControl>
// //                         <Input
// //                           placeholder="John Doe"
// //                           {...field}
// //                           disabled={
// //                             isLoading ||
// //                             isSuccess ||
// //                             !!accountStatus?.exists ||
// //                             isRateLimited
// //                           }
// //                           className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 ${
// //                             fieldErrors.name
// //                               ? "border-red-500 focus-visible:ring-red-500"
// //                               : ""
// //                           }`}
// //                           autoComplete="name"
// //                         />
// //                       </FormControl>
// //                       {fieldErrors.name ? (
// //                         <p className="text-sm font-medium text-red-500 mt-1">
// //                           {fieldErrors.name}
// //                         </p>
// //                       ) : (
// //                         <FormMessage />
// //                       )}
// //                     </FormItem>
// //                   )}
// //                 />

// //                 <FormField
// //                   control={form.control}
// //                   name="email"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel className="text-sm font-medium text-[#1d1c1d]">
// //                         Email
// //                       </FormLabel>
// //                       <FormControl>
// //                         <Input
// //                           placeholder="name@work-email.com"
// //                           type="email"
// //                           {...field}
// //                           disabled={isLoading || isSuccess || isRateLimited}
// //                           className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 ${
// //                             fieldErrors.email || accountStatus?.exists
// //                               ? "border-red-500 focus-visible:ring-red-500"
// //                               : ""
// //                           }`}
// //                           autoComplete="email"
// //                         />
// //                       </FormControl>
// //                       {fieldErrors.email ? (
// //                         <p className="text-sm font-medium text-red-500 mt-1">
// //                           {fieldErrors.email}
// //                         </p>
// //                       ) : (
// //                         <FormMessage />
// //                       )}
// //                     </FormItem>
// //                   )}
// //                 />

// //                 <FormField
// //                   control={form.control}
// //                   name="password"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <div className="flex items-center justify-between">
// //                         <FormLabel className="text-sm font-medium text-[#1d1c1d]">
// //                           Password
// //                         </FormLabel>
// //                         <TooltipProvider>
// //                           <Tooltip>
// //                             <TooltipTrigger asChild>
// //                               <div className="flex items-center text-xs text-muted-foreground">
// //                                 <Shield className="h-3 w-3 mr-1" />
// //                                 <span>Password Requirements</span>
// //                               </div>
// //                             </TooltipTrigger>
// //                             <TooltipContent className="w-80 p-3">
// //                               <div className="space-y-2">
// //                                 <h4 className="font-medium">
// //                                   Your password must include:
// //                                 </h4>
// //                                 <ul className="space-y-1 text-sm">
// //                                   <li className="flex items-center">
// //                                     <span
// //                                       className={`mr-2 ${
// //                                         passwordCriteria.length
// //                                           ? "text-green-500"
// //                                           : "text-red-500"
// //                                       }`}
// //                                     >
// //                                       {passwordCriteria.length ? "✓" : "✗"}
// //                                     </span>
// //                                     At least 8 characters
// //                                   </li>
// //                                   <li className="flex items-center">
// //                                     <span
// //                                       className={`mr-2 ${
// //                                         passwordCriteria.uppercase
// //                                           ? "text-green-500"
// //                                           : "text-red-500"
// //                                       }`}
// //                                     >
// //                                       {passwordCriteria.uppercase ? "✓" : "✗"}
// //                                     </span>
// //                                     At least one uppercase letter (A-Z)
// //                                   </li>
// //                                   <li className="flex items-center">
// //                                     <span
// //                                       className={`mr-2 ${
// //                                         passwordCriteria.lowercase
// //                                           ? "text-green-500"
// //                                           : "text-red-500"
// //                                       }`}
// //                                     >
// //                                       {passwordCriteria.lowercase ? "✓" : "✗"}
// //                                     </span>
// //                                     At least one lowercase letter (a-z)
// //                                   </li>
// //                                   <li className="flex items-center">
// //                                     <span
// //                                       className={`mr-2 ${
// //                                         passwordCriteria.number
// //                                           ? "text-green-500"
// //                                           : "text-red-500"
// //                                       }`}
// //                                     >
// //                                       {passwordCriteria.number ? "✓" : "✗"}
// //                                     </span>
// //                                     At least one number (0-9)
// //                                   </li>
// //                                   <li className="flex items-center">
// //                                     <span
// //                                       className={`mr-2 ${
// //                                         passwordCriteria.special
// //                                           ? "text-green-500"
// //                                           : "text-red-500"
// //                                       }`}
// //                                     >
// //                                       {passwordCriteria.special ? "✓" : "✗"}
// //                                     </span>
// //                                     At least one special character (@$!%*?&)
// //                                   </li>
// //                                 </ul>
// //                               </div>
// //                             </TooltipContent>
// //                           </Tooltip>
// //                         </TooltipProvider>
// //                       </div>
// //                       <FormControl>
// //                         <div className="relative">
// //                           <Input
// //                             type={showPassword ? "text" : "password"}
// //                             placeholder="Create a password"
// //                             {...field}
// //                             disabled={
// //                               isLoading ||
// //                               isSuccess ||
// //                               !!accountStatus?.exists ||
// //                               isRateLimited
// //                             }
// //                             className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10 ${
// //                               fieldErrors.password
// //                                 ? "border-red-500 focus-visible:ring-red-500"
// //                                 : ""
// //                             }`}
// //                             autoComplete="new-password"
// //                           />
// //                           <Button
// //                             type="button"
// //                             variant="ghost"
// //                             size="sm"
// //                             onClick={() => setShowPassword(!showPassword)}
// //                             className="absolute right-0 top-0 h-full px-3 py-2 text-[#696969] hover:text-[#1d1c1d] hover:bg-transparent"
// //                             disabled={
// //                               isLoading ||
// //                               isSuccess ||
// //                               !!accountStatus?.exists ||
// //                               isRateLimited
// //                             }
// //                           >
// //                             {showPassword ? (
// //                               <EyeOff size={18} />
// //                             ) : (
// //                               <Eye size={18} />
// //                             )}
// //                             <span className="sr-only">
// //                               {showPassword ? "Hide password" : "Show password"}
// //                             </span>
// //                           </Button>
// //                         </div>
// //                       </FormControl>
// //                       {fieldErrors.password ? (
// //                         <p className="text-sm font-medium text-red-500 mt-1">
// //                           {fieldErrors.password}
// //                         </p>
// //                       ) : (
// //                         <FormMessage />
// //                       )}
// //                       {password && !accountStatus?.exists && !isRateLimited && (
// //                         <div className="mt-2 space-y-2">
// //                           <div className="flex items-center justify-between">
// //                             <span className="text-xs text-muted-foreground">
// //                               Password strength:
// //                             </span>
// //                             <span
// //                               className={`text-xs font-medium ${
// //                                 passwordStrength < 40
// //                                   ? "text-red-500"
// //                                   : passwordStrength < 80
// //                                   ? "text-yellow-500"
// //                                   : "text-green-500"
// //                               }`}
// //                             >
// //                               {getStrengthLabel(passwordStrength)}
// //                             </span>
// //                           </div>
// //                           <Progress
// //                             value={passwordStrength}
// //                             className="h-1"
// //                             indicatorClassName={getStrengthColor(
// //                               passwordStrength
// //                             )}
// //                           />
// //                           <div className="flex flex-wrap gap-1 mt-2">
// //                             {Object.entries(passwordCriteria).map(
// //                               ([key, met]) => (
// //                                 <div
// //                                   key={key}
// //                                   className={`text-xs px-2 py-1 rounded-full flex items-center ${
// //                                     met
// //                                       ? "bg-green-100 text-green-700"
// //                                       : "bg-gray-100 text-gray-500"
// //                                   }`}
// //                                 >
// //                                   {met ? (
// //                                     <CheckCircle className="h-3 w-3 mr-1" />
// //                                   ) : (
// //                                     <X className="h-3 w-3 mr-1" />
// //                                   )}
// //                                   <span>
// //                                     {key === "length"
// //                                       ? "8+ chars"
// //                                       : key === "uppercase"
// //                                       ? "A-Z"
// //                                       : key === "lowercase"
// //                                       ? "a-z"
// //                                       : key === "number"
// //                                       ? "0-9"
// //                                       : "Special"}
// //                                   </span>
// //                                 </div>
// //                               )
// //                             )}
// //                           </div>
// //                         </div>
// //                       )}
// //                     </FormItem>
// //                   )}
// //                 />

// //                 <FormField
// //                   control={form.control}
// //                   name="confirmPassword"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel className="text-sm font-medium text-[#1d1c1d]">
// //                         Confirm Password
// //                       </FormLabel>
// //                       <FormControl>
// //                         <div className="relative">
// //                           <Input
// //                             type={showConfirmPassword ? "text" : "password"}
// //                             placeholder="Confirm your password"
// //                             {...field}
// //                             disabled={
// //                               isLoading ||
// //                               isSuccess ||
// //                               !!accountStatus?.exists ||
// //                               isRateLimited
// //                             }
// //                             className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10 ${
// //                               fieldErrors.confirmPassword
// //                                 ? "border-red-500 focus-visible:ring-red-500"
// //                                 : ""
// //                             }`}
// //                             autoComplete="new-password"
// //                           />
// //                           <Button
// //                             type="button"
// //                             variant="ghost"
// //                             size="sm"
// //                             onClick={() =>
// //                               setShowConfirmPassword(!showConfirmPassword)
// //                             }
// //                             className="absolute right-0 top-0 h-full px-3 py-2 text-[#696969] hover:text-[#1d1c1d] hover:bg-transparent"
// //                             disabled={
// //                               isLoading ||
// //                               isSuccess ||
// //                               !!accountStatus?.exists ||
// //                               isRateLimited
// //                             }
// //                           >
// //                             {showConfirmPassword ? (
// //                               <EyeOff size={18} />
// //                             ) : (
// //                               <Eye size={18} />
// //                             )}
// //                             <span className="sr-only">
// //                               {showConfirmPassword
// //                                 ? "Hide password"
// //                                 : "Show password"}
// //                             </span>
// //                           </Button>
// //                         </div>
// //                       </FormControl>
// //                       {fieldErrors.confirmPassword ? (
// //                         <p className="text-sm font-medium text-red-500 mt-1">
// //                           {fieldErrors.confirmPassword}
// //                         </p>
// //                       ) : (
// //                         <FormMessage />
// //                       )}
// //                     </FormItem>
// //                   )}
// //                 />

// //                 <Button
// //                   type="submit"
// //                   className="w-full bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white"
// //                   disabled={
// //                     isLoading ||
// //                     isSuccess ||
// //                     !!accountStatus?.exists ||
// //                     isRateLimited
// //                   }
// //                 >
// //                   {isLoading ? (
// //                     <>
// //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                       Creating account...
// //                     </>
// //                   ) : (
// //                     "Sign up"
// //                   )}
// //                 </Button>

// //                 <div className="flex items-center gap-2 py-2">
// //                   <Separator className="flex-1 bg-[#dadbd8]" />
// //                   <span className="text-xs text-[#616061]">OR</span>
// //                   <Separator className="flex-1 bg-[#dadbd8]" />
// //                 </div>

// //                 <Button
// //                   type="button"
// //                   variant="outline"
// //                   className="w-full border-[#bbbbbb] hover:bg-[#f8f8f8] hover:text-[#1d1c1d]"
// //                   disabled={
// //                     isLoading ||
// //                     isSuccess ||
// //                     isGoogleLoading ||
// //                     !!accountStatus?.exists ||
// //                     isRateLimited
// //                   }
// //                   onClick={handleGoogleSignUp}
// //                 >
// //                   {isGoogleLoading ? (
// //                     <>
// //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                       Connecting to Google...
// //                     </>
// //                   ) : (
// //                     <>
// //                       <svg
// //                         viewBox="0 0 24 24"
// //                         width="18"
// //                         height="18"
// //                         className="mr-2"
// //                       >
// //                         <path
// //                           fill="#4285f4"
// //                           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
// //                         />
// //                         <path
// //                           fill="#34a853"
// //                           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
// //                         />
// //                         <path
// //                           fill="#fbbc05"
// //                           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
// //                         />
// //                         <path
// //                           fill="#ea4335"
// //                           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
// //                         />
// //                       </svg>
// //                       Sign up with Google
// //                     </>
// //                   )}
// //                 </Button>
// //               </form>
// //             </Form>
// //           </CardContent>

// //           <CardFooter className="flex justify-center">
// //             <p className="text-sm text-[#696969]">
// //               Already have an account?{" "}
// //               <Link href="/login" className="text-[#ff6a00] hover:underline">
// //                 Log in
// //               </Link>
// //             </p>
// //           </CardFooter>
// //         </Card>
// //       </div>

// //       <div className="w-full max-w-md mx-auto px-4 mt-8 flex items-center justify-between text-sm text-[#616061]">
// //         <div className="flex space-x-4">
// //           <Link href="#" className="hover:underline">
// //             Privacy & Terms
// //           </Link>
// //           <Link href="#" className="hover:underline">
// //             Contact Us
// //           </Link>
// //         </div>
// //         <Button
// //           variant="ghost"
// //           size="sm"
// //           className="flex items-center hover:bg-transparent hover:underline p-0"
// //         >
// //           <span className="mr-1">Change region</span>
// //           <ChevronDown size={16} />
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   ChevronDown,
//   Eye,
//   EyeOff,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   Info,
//   Shield,
//   X,
//   Mail,
//   Clock,
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRegister } from "@refinedev/core";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Progress } from "@/components/ui/progress";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";
// import { supabaseBrowserClient } from "@/utils/supabase/client";
// import type { AccountStatus } from "@lib/auth";

// export default function SignUpForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [passwordCriteria, setPasswordCriteria] = useState({
//     length: false,
//     uppercase: false,
//     lowercase: false,
//     number: false,
//     special: false,
//   });
//   const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
//     null
//   );
//   const [isRateLimited, setIsRateLimited] = useState(false);
//   const router = useRouter();

//   // Use the Refine useRegister hook
//   const { mutate: register, isLoading: isRegisterLoading } = useRegister();

//   const form = useForm<SignupFormValues>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//     mode: "onChange", // Validate on change for better user feedback
//   });

//   // Combine form submission loading and register loading
//   const isLoading = form.formState.isSubmitting || isRegisterLoading;

//   // Watch password to calculate strength and validate criteria
//   const password = form.watch("password");
//   const email = form.watch("email");

//   // Reset account status when email changes
//   useEffect(() => {
//     if (accountStatus && email) {
//       setAccountStatus(null);
//     }
//   }, [email, accountStatus]);

//   // Reset rate limit error when form values change
//   useEffect(() => {
//     if (isRateLimited) {
//       setIsRateLimited(false);
//     }
//   }, [form.watch(), isRateLimited]);

//   // Calculate password strength and check criteria
//   useEffect(() => {
//     if (!password) {
//       setPasswordStrength(0);
//       setPasswordCriteria({
//         length: false,
//         uppercase: false,
//         lowercase: false,
//         number: false,
//         special: false,
//       });
//       return;
//     }

//     const criteria = {
//       length: password.length >= 8,
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       number: /[0-9]/.test(password),
//       special: /[^A-Za-z0-9]/.test(password),
//     };

//     setPasswordCriteria(criteria);

//     // Calculate strength based on criteria
//     const metCriteria = Object.values(criteria).filter(Boolean).length;
//     setPasswordStrength(metCriteria * 20);
//   }, [password]);

//   function onSubmit(values: SignupFormValues) {
//     setError(null);
//     setFieldErrors({});
//     setAccountStatus(null);
//     setIsSuccess(false);
//     setIsRateLimited(false);

//     // Use the register function from useRegister hook
//     register(
//       {
//         email: values.email,
//         password: values.password,
//         name: values.name,
//         // Pass confirmPassword if your auth provider needs it
//         confirmPassword: values.confirmPassword,
//       },
//       {
//         onSuccess: (data) => {
//           // Check if the registration was successful
//           if (data?.success) {
//             setIsSuccess(true);

//             // Check if we need to wait for email confirmation
//             // If the auth provider returns a user, we can redirect
//             if (data.user) {
//               // If no email confirmation required, redirect to dashboard
//               setTimeout(() => {
//                 if (data.redirectTo) {
//                   router.push(data.redirectTo);
//                 } else {
//                   router.push("/dashboard");
//                 }
//                 router.refresh();
//               }, 2000);
//             }
//             // Otherwise, we stay on the page with the success message
//             // indicating they need to check their email
//           } else if (data?.emailStatus) {
//             // Handle email status information
//             setAccountStatus(data.emailStatus);

//             // If the account exists, focus on the email field
//             if (data.emailStatus.exists) {
//               form.setFocus("email");
//             }
//           } else {
//             // Handle case where success is false but no error was thrown
//             setError("Registration failed. Please try again.");
//           }
//         },
//         onError: (error: any) => {
//           console.error("Signup error:", error);

//           // Handle rate limiting errors
//           if (error.code === "rate_limit_exceeded") {
//             setIsRateLimited(true);
//             setError(
//               error.message ||
//                 "Too many requests. Please try again in a minute."
//             );
//             return;
//           }

//           // Handle field-specific errors
//           if (error.field) {
//             setFieldErrors({
//               [error.field]: error.message,
//             });
//             form.setFocus(
//               error.field as "email" | "password" | "name" | "confirmPassword"
//             );
//           } else {
//             // General error
//             setError(error.message || "Failed to sign up. Please try again.");
//           }
//         },
//       }
//     );
//   }

//   async function handleGoogleSignUp() {
//     try {
//       setError(null);
//       setFieldErrors({});
//       setIsGoogleLoading(true);

//       const { error } = await supabaseBrowserClient.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${window.location.origin}/auth/callback`,
//         },
//       });

//       if (error) throw error;
//     } catch (error: any) {
//       console.error("Google sign up error:", error);
//       setError(
//         error.message || "Failed to sign up with Google. Please try again."
//       );
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   }

//   // Get strength color
//   const getStrengthColor = (strength: number) => {
//     if (strength < 40) return "bg-red-500";
//     if (strength < 80) return "bg-yellow-500";
//     return "bg-green-500";
//   };

//   // Get strength label
//   const getStrengthLabel = (strength: number) => {
//     if (strength < 40) return "Weak";
//     if (strength < 80) return "Good";
//     return "Strong";
//   };

//   // Render account status alert based on verification status
//   const renderAccountStatusAlert = () => {
//     if (!accountStatus?.exists) return null;

//     if (accountStatus.verified) {
//       return (
//         <Alert className="border-blue-500 bg-blue-50 text-blue-700 animate-in fade-in-50">
//           <Info className="h-4 w-4 text-blue-500" />
//           <AlertTitle>Account Already Exists</AlertTitle>
//           <AlertDescription className="flex flex-col gap-2">
//             <p>
//               An account with this email address already exists and has been
//               verified.
//             </p>
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-blue-300 text-blue-700 hover:bg-blue-100"
//                 onClick={() => router.push("/login")}
//               >
//                 Log in instead
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-blue-300 text-blue-700 hover:bg-blue-100"
//                 onClick={() => router.push("/forgot-password")}
//               >
//                 Forgot password?
//               </Button>
//             </div>
//           </AlertDescription>
//         </Alert>
//       );
//     } else {
//       return (
//         <Alert className="border-amber-500 bg-amber-50 text-amber-700 animate-in fade-in-50">
//           <Mail className="h-4 w-4 text-amber-500" />
//           <AlertTitle>Email Verification Required</AlertTitle>
//           <AlertDescription className="flex flex-col gap-2">
//             <p>
//               An account with this email address already exists but hasn't been
//               verified yet. Please check your inbox for a verification email.
//             </p>
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-amber-300 text-amber-700 hover:bg-amber-100"
//                 onClick={() => {
//                   // Here you would implement a resend verification email function
//                   alert("Verification email resent. Please check your inbox.");
//                 }}
//               >
//                 Resend verification email
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-amber-300 text-amber-700 hover:bg-amber-100"
//                 onClick={() => router.push("/login")}
//               >
//                 Try logging in
//               </Button>
//             </div>
//           </AlertDescription>
//         </Alert>
//       );
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-between min-h-screen py-8 bg-[#f8f8f8]">
//       <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-4">
//         <div className="mb-8">
//           <Link href="/">
//             <Image
//               src="/opano-logo.png"
//               alt="Opano Logo"
//               width={180}
//               height={48}
//               className="h-10 w-auto mx-auto"
//               priority
//             />
//           </Link>
//         </div>

//         <Card className="w-full border-[#dadbd8] shadow-sm">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center text-[#1d1c1d]">
//               Create your account
//             </CardTitle>
//             <CardDescription className="text-center text-[#616061]">
//               Enter your information to get started with Opano
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             {error && !isRateLimited && (
//               <Alert variant="destructive" className="animate-in fade-in-50">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>Sign Up Failed</AlertTitle>
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {isRateLimited && (
//               <Alert className="border-amber-500 bg-amber-50 text-amber-700 animate-in fade-in-50">
//                 <Clock className="h-4 w-4 text-amber-500" />
//                 <AlertTitle>Please Wait</AlertTitle>
//                 <AlertDescription>
//                   We're processing too many requests right now. Please wait a
//                   moment and try again.
//                 </AlertDescription>
//               </Alert>
//             )}

//             {isSuccess && !accountStatus?.exists && (
//               <Alert className="border-green-500 bg-green-50 text-green-700 animate-in fade-in-50">
//                 <CheckCircle className="h-4 w-4 text-green-500" />
//                 <AlertTitle>Account Created Successfully</AlertTitle>
//                 <AlertDescription>
//                   Please check your email for confirmation instructions. You'll
//                   need to verify your email before logging in.
//                 </AlertDescription>
//               </Alert>
//             )}

//             {renderAccountStatusAlert()}

//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-sm font-medium text-[#1d1c1d]">
//                         Full Name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="John Doe"
//                           {...field}
//                           disabled={
//                             isLoading ||
//                             isSuccess ||
//                             !!accountStatus?.exists ||
//                             isRateLimited
//                           }
//                           className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 ${
//                             fieldErrors.name
//                               ? "border-red-500 focus-visible:ring-red-500"
//                               : ""
//                           }`}
//                           autoComplete="name"
//                         />
//                       </FormControl>
//                       {fieldErrors.name ? (
//                         <p className="text-sm font-medium text-red-500 mt-1">
//                           {fieldErrors.name}
//                         </p>
//                       ) : (
//                         <FormMessage />
//                       )}
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-sm font-medium text-[#1d1c1d]">
//                         Email
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="name@work-email.com"
//                           type="email"
//                           {...field}
//                           disabled={isLoading || isSuccess || isRateLimited}
//                           className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 ${
//                             fieldErrors.email || accountStatus?.exists
//                               ? "border-red-500 focus-visible:ring-red-500"
//                               : ""
//                           }`}
//                           autoComplete="email"
//                         />
//                       </FormControl>
//                       {fieldErrors.email ? (
//                         <p className="text-sm font-medium text-red-500 mt-1">
//                           {fieldErrors.email}
//                         </p>
//                       ) : (
//                         <FormMessage />
//                       )}
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <div className="flex items-center justify-between">
//                         <FormLabel className="text-sm font-medium text-[#1d1c1d]">
//                           Password
//                         </FormLabel>
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <div className="flex items-center text-xs text-muted-foreground">
//                                 <Shield className="h-3 w-3 mr-1" />
//                                 <span>Password Requirements</span>
//                               </div>
//                             </TooltipTrigger>
//                             <TooltipContent className="w-80 p-3">
//                               <div className="space-y-2">
//                                 <h4 className="font-medium">
//                                   Your password must include:
//                                 </h4>
//                                 <ul className="space-y-1 text-sm">
//                                   <li className="flex items-center">
//                                     <span
//                                       className={`mr-2 ${
//                                         passwordCriteria.length
//                                           ? "text-green-500"
//                                           : "text-red-500"
//                                       }`}
//                                     >
//                                       {passwordCriteria.length ? "✓" : "✗"}
//                                     </span>
//                                     At least 8 characters
//                                   </li>
//                                   <li className="flex items-center">
//                                     <span
//                                       className={`mr-2 ${
//                                         passwordCriteria.uppercase
//                                           ? "text-green-500"
//                                           : "text-red-500"
//                                       }`}
//                                     >
//                                       {passwordCriteria.uppercase ? "✓" : "✗"}
//                                     </span>
//                                     At least one uppercase letter (A-Z)
//                                   </li>
//                                   <li className="flex items-center">
//                                     <span
//                                       className={`mr-2 ${
//                                         passwordCriteria.lowercase
//                                           ? "text-green-500"
//                                           : "text-red-500"
//                                       }`}
//                                     >
//                                       {passwordCriteria.lowercase ? "✓" : "✗"}
//                                     </span>
//                                     At least one lowercase letter (a-z)
//                                   </li>
//                                   <li className="flex items-center">
//                                     <span
//                                       className={`mr-2 ${
//                                         passwordCriteria.number
//                                           ? "text-green-500"
//                                           : "text-red-500"
//                                       }`}
//                                     >
//                                       {passwordCriteria.number ? "✓" : "✗"}
//                                     </span>
//                                     At least one number (0-9)
//                                   </li>
//                                   <li className="flex items-center">
//                                     <span
//                                       className={`mr-2 ${
//                                         passwordCriteria.special
//                                           ? "text-green-500"
//                                           : "text-red-500"
//                                       }`}
//                                     >
//                                       {passwordCriteria.special ? "✓" : "✗"}
//                                     </span>
//                                     At least one special character (@$!%*?&)
//                                   </li>
//                                 </ul>
//                               </div>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       </div>
//                       <FormControl>
//                         <div className="relative">
//                           <Input
//                             type={showPassword ? "text" : "password"}
//                             placeholder="Create a password"
//                             {...field}
//                             disabled={
//                               isLoading ||
//                               isSuccess ||
//                               !!accountStatus?.exists ||
//                               isRateLimited
//                             }
//                             className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10 ${
//                               fieldErrors.password
//                                 ? "border-red-500 focus-visible:ring-red-500"
//                                 : ""
//                             }`}
//                             autoComplete="new-password"
//                           />
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-0 top-0 h-full px-3 py-2 text-[#696969] hover:text-[#1d1c1d] hover:bg-transparent"
//                             disabled={
//                               isLoading ||
//                               isSuccess ||
//                               !!accountStatus?.exists ||
//                               isRateLimited
//                             }
//                           >
//                             {showPassword ? (
//                               <EyeOff size={18} />
//                             ) : (
//                               <Eye size={18} />
//                             )}
//                             <span className="sr-only">
//                               {showPassword ? "Hide password" : "Show password"}
//                             </span>
//                           </Button>
//                         </div>
//                       </FormControl>
//                       {fieldErrors.password ? (
//                         <p className="text-sm font-medium text-red-500 mt-1">
//                           {fieldErrors.password}
//                         </p>
//                       ) : (
//                         <FormMessage />
//                       )}
//                       {password && !accountStatus?.exists && !isRateLimited && (
//                         <div className="mt-2 space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-xs text-muted-foreground">
//                               Password strength:
//                             </span>
//                             <span
//                               className={`text-xs font-medium ${
//                                 passwordStrength < 40
//                                   ? "text-red-500"
//                                   : passwordStrength < 80
//                                   ? "text-yellow-500"
//                                   : "text-green-500"
//                               }`}
//                             >
//                               {getStrengthLabel(passwordStrength)}
//                             </span>
//                           </div>
//                           <Progress
//                             value={passwordStrength}
//                             className="h-1"
//                             indicatorClassName={getStrengthColor(
//                               passwordStrength
//                             )}
//                           />
//                           <div className="flex flex-wrap gap-1 mt-2">
//                             {Object.entries(passwordCriteria).map(
//                               ([key, met]) => (
//                                 <div
//                                   key={key}
//                                   className={`text-xs px-2 py-1 rounded-full flex items-center ${
//                                     met
//                                       ? "bg-green-100 text-green-700"
//                                       : "bg-gray-100 text-gray-500"
//                                   }`}
//                                 >
//                                   {met ? (
//                                     <CheckCircle className="h-3 w-3 mr-1" />
//                                   ) : (
//                                     <X className="h-3 w-3 mr-1" />
//                                   )}
//                                   <span>
//                                     {key === "length"
//                                       ? "8+ chars"
//                                       : key === "uppercase"
//                                       ? "A-Z"
//                                       : key === "lowercase"
//                                       ? "a-z"
//                                       : key === "number"
//                                       ? "0-9"
//                                       : "Special"}
//                                   </span>
//                                 </div>
//                               )
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-sm font-medium text-[#1d1c1d]">
//                         Confirm Password
//                       </FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Input
//                             type={showConfirmPassword ? "text" : "password"}
//                             placeholder="Confirm your password"
//                             {...field}
//                             disabled={
//                               isLoading ||
//                               isSuccess ||
//                               !!accountStatus?.exists ||
//                               isRateLimited
//                             }
//                             className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10 ${
//                               fieldErrors.confirmPassword
//                                 ? "border-red-500 focus-visible:ring-red-500"
//                                 : ""
//                             }`}
//                             autoComplete="new-password"
//                           />
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() =>
//                               setShowConfirmPassword(!showConfirmPassword)
//                             }
//                             className="absolute right-0 top-0 h-full px-3 py-2 text-[#696969] hover:text-[#1d1c1d] hover:bg-transparent"
//                             disabled={
//                               isLoading ||
//                               isSuccess ||
//                               !!accountStatus?.exists ||
//                               isRateLimited
//                             }
//                           >
//                             {showConfirmPassword ? (
//                               <EyeOff size={18} />
//                             ) : (
//                               <Eye size={18} />
//                             )}
//                             <span className="sr-only">
//                               {showConfirmPassword
//                                 ? "Hide password"
//                                 : "Show password"}
//                             </span>
//                           </Button>
//                         </div>
//                       </FormControl>
//                       {fieldErrors.confirmPassword ? (
//                         <p className="text-sm font-medium text-red-500 mt-1">
//                           {fieldErrors.confirmPassword}
//                         </p>
//                       ) : (
//                         <FormMessage />
//                       )}
//                     </FormItem>
//                   )}
//                 />

//                 <Button
//                   type="submit"
//                   className="w-full bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white"
//                   disabled={
//                     isLoading ||
//                     isSuccess ||
//                     !!accountStatus?.exists ||
//                     isRateLimited
//                   }
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Creating account...
//                     </>
//                   ) : (
//                     "Sign up"
//                   )}
//                 </Button>

//                 <div className="flex items-center gap-2 py-2">
//                   <Separator className="flex-1 bg-[#dadbd8]" />
//                   <span className="text-xs text-[#616061]">OR</span>
//                   <Separator className="flex-1 bg-[#dadbd8]" />
//                 </div>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full border-[#bbbbbb] hover:bg-[#f8f8f8] hover:text-[#1d1c1d]"
//                   disabled={
//                     isLoading ||
//                     isSuccess ||
//                     isGoogleLoading ||
//                     !!accountStatus?.exists ||
//                     isRateLimited
//                   }
//                   onClick={handleGoogleSignUp}
//                 >
//                   {isGoogleLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Connecting to Google...
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         viewBox="0 0 24 24"
//                         width="18"
//                         height="18"
//                         className="mr-2"
//                       >
//                         <path
//                           fill="#4285f4"
//                           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                         />
//                         <path
//                           fill="#34a853"
//                           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                         />
//                         <path
//                           fill="#fbbc05"
//                           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                         />
//                         <path
//                           fill="#ea4335"
//                           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                         />
//                       </svg>
//                       Sign up with Google
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>

//           <CardFooter className="flex justify-center">
//             <p className="text-sm text-[#696969]">
//               Already have an account?{" "}
//               <Link href="/login" className="text-[#ff6a00] hover:underline">
//                 Log in
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>

//       <div className="w-full max-w-md mx-auto px-4 mt-8 flex items-center justify-between text-sm text-[#616061]">
//         <div className="flex space-x-4">
//           <Link href="#" className="hover:underline">
//             Privacy & Terms
//           </Link>
//           <Link href="#" className="hover:underline">
//             Contact Us
//           </Link>
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="flex items-center hover:bg-transparent hover:underline p-0"
//         >
//           <span className="mr-1">Change region</span>
//           <ChevronDown size={16} />
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
  Shield,
  X,
  Mail,
  Clock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@refinedev/core";

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
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";
import { supabaseBrowserClient } from "@/utils/supabase/client";
// import type { AccountStatus } from "@lib/auth";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  // const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
  //   null
  // );
  const [isRateLimited, setIsRateLimited] = useState(false);
  const router = useRouter();

  // Use the Refine useRegister hook
  const { mutate: register, isLoading: isRegisterLoading } = useRegister();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate on change for better user feedback
  });

  // Combine form submission loading and register loading
  const isLoading = form.formState.isSubmitting || isRegisterLoading;

  // Watch password to calculate strength and validate criteria
  const password = form.watch("password");
  const email = form.watch("email");

  // Reset account status when email changes
  // useEffect(() => {
  //   // if (accountStatus && email) {
  //   //   setAccountStatus(null);
  //   // }
  // }, [email, accountStatus]);

  // Reset rate limit error when form values change
  useEffect(() => {
    if (isRateLimited) {
      setIsRateLimited(false);
    }
  }, [form.watch(), isRateLimited]);

  // Calculate password strength and check criteria
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
      return;
    }

    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    setPasswordCriteria(criteria);

    // Calculate strength based on criteria
    const metCriteria = Object.values(criteria).filter(Boolean).length;
    setPasswordStrength(metCriteria * 20);
  }, [password]);

  function onSubmit(values: SignupFormValues) {
    setError(null);
    setFieldErrors({});
    // setAccountStatus(null);
    setIsSuccess(false);
    setIsRateLimited(false);

    // Use the register function from useRegister hook
    register(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        // Pass confirmPassword if your auth provider needs it
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: (data) => {
          // Check if the registration was successful
          if (data?.success) {
            setIsSuccess(true);

            // Check if we need to wait for email confirmation
            // If the auth provider returns a user, we can redirect
            if (data.user) {
              // If no email confirmation required, redirect to dashboard
              setTimeout(() => {
                if (data.redirectTo) {
                  router.push(data.redirectTo);
                } else {
                  router.push("/dashboard");
                }
                router.refresh();
              }, 2000);
            }
            // Otherwise, we stay on the page with the success message
            // indicating they need to check their email
          } else {
            // Handle case where success is false but no error was thrown
            setError("Registration failed. Please try again.");
          }
        },
        onError: (error: any) => {
          console.error("Signup error:", error);

          // Handle rate limiting errors
          if (error.code === "rate_limit_exceeded") {
            setIsRateLimited(true);
            setError(
              error.message ||
                "Too many requests. Please try again in a minute."
            );
            return;
          }

          // Handle field-specific errors
          if (error.field) {
            setFieldErrors({
              [error.field]: error.message,
            });
            form.setFocus(
              error.field as "email" | "password" | "name" | "confirmPassword"
            );
          } else {
            // General error
            setError(error.message || "Failed to sign up. Please try again.");
          }
        },
      }
    );
  }

  async function handleGoogleSignUp() {
    try {
      setError(null);
      setFieldErrors({});
      setIsGoogleLoading(true);

      const { error } = await supabaseBrowserClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Google sign up error:", error);
      setError(
        error.message || "Failed to sign up with Google. Please try again."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }

  // Get strength color
  const getStrengthColor = (strength: number) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Get strength label
  const getStrengthLabel = (strength: number) => {
    if (strength < 40) return "Weak";
    if (strength < 80) return "Good";
    return "Strong";
  };

  // Render account status alert based on verification status
  const renderAccountStatusAlert = () => {
    // if (!accountStatus?.exists) return null;

    // if (accountStatus.verified) {
    //   return (
    //     <Alert className="border-blue-500 bg-blue-50 text-blue-700 animate-in fade-in-50">
    //       <Info className="h-4 w-4 text-blue-500" />
    //       <AlertTitle>Account Already Exists</AlertTitle>
    //       <AlertDescription className="flex flex-col gap-2">
    //         <p>
    //           An account with this email address already exists and has been
    //           verified.
    //         </p>
    //         <div className="flex flex-wrap gap-2">
    //           <Button
    //             variant="outline"
    //             size="sm"
    //             className="border-blue-300 text-blue-700 hover:bg-blue-100"
    //             onClick={() => router.push("/login")}
    //           >
    //             Log in instead
    //           </Button>
    //           <Button
    //             variant="outline"
    //             size="sm"
    //             className="border-blue-300 text-blue-700 hover:bg-blue-100"
    //             onClick={() => router.push("/forgot-password")}
    //           >
    //             Forgot password?
    //           </Button>
    //         </div>
    //       </AlertDescription>
    //     </Alert>
    //   );
    // } else {
      return (
        <Alert className="border-amber-500 bg-amber-50 text-amber-700 animate-in fade-in-50">
          <Mail className="h-4 w-4 text-amber-500" />
          <AlertTitle>Email Verification Required</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>
              An account with this email address already exists but hasn't been
              verified yet. Please check your inbox for a verification email.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => {
                  // Here you would implement a resend verification email function
                  alert("Verification email resent. Please check your inbox.");
                }}
              >
                Resend verification email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => router.push("/login")}
              >
                Try logging in
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    // }
  };

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
              Create your account
            </CardTitle>
            <CardDescription className="text-center text-[#616061]">
              Enter your information to get started with Opano
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && !isRateLimited && (
              <Alert variant="destructive" className="animate-in fade-in-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sign Up Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isRateLimited && (
              <Alert className="border-amber-500 bg-amber-50 text-amber-700 animate-in fade-in-50">
                <Clock className="h-4 w-4 text-amber-500" />
                <AlertTitle>Please Wait</AlertTitle>
                <AlertDescription>
                  We're processing too many requests right now. Please wait a
                  moment and try again.
                </AlertDescription>
              </Alert>
            )}

            {/* {isSuccess && !accountStatus?.exists && (
              <Alert className="border-green-500 bg-green-50 text-green-700 animate-in fade-in-50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Account Created Successfully</AlertTitle>
                <AlertDescription>
                  Please check your email for confirmation instructions. You'll
                  need to verify your email before logging in.
                </AlertDescription>
              </Alert>
            )} */}

            {renderAccountStatusAlert()}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#1d1c1d]">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={
                            isLoading ||
                            isSuccess ||
                            // !!accountStatus?.exists ||
                            isRateLimited
                          }
                          className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 ${
                            fieldErrors.name
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          autoComplete="name"
                        />
                      </FormControl>
                      {fieldErrors.name ? (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          {fieldErrors.name}
                        </p>
                      ) : (
                        <FormMessage />
                      )}
                    </FormItem>
                  )}
                />

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
                          type="email"
                          {...field}
                          disabled={isLoading || isSuccess || isRateLimited}
                          className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 ${
                            fieldErrors.email
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                          autoComplete="email"
                        />
                      </FormControl>
                      {fieldErrors.email ? (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          {fieldErrors.email}
                        </p>
                      ) : (
                        <FormMessage />
                      )}
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
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Shield className="h-3 w-3 mr-1" />
                                <span>Password Requirements</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-3">
                              <div className="space-y-2">
                                <h4 className="font-medium">
                                  Your password must include:
                                </h4>
                                <ul className="space-y-1 text-sm">
                                  <li className="flex items-center">
                                    <span
                                      className={`mr-2 ${
                                        passwordCriteria.length
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {passwordCriteria.length ? "✓" : "✗"}
                                    </span>
                                    At least 8 characters
                                  </li>
                                  <li className="flex items-center">
                                    <span
                                      className={`mr-2 ${
                                        passwordCriteria.uppercase
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {passwordCriteria.uppercase ? "✓" : "✗"}
                                    </span>
                                    At least one uppercase letter (A-Z)
                                  </li>
                                  <li className="flex items-center">
                                    <span
                                      className={`mr-2 ${
                                        passwordCriteria.lowercase
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {passwordCriteria.lowercase ? "✓" : "✗"}
                                    </span>
                                    At least one lowercase letter (a-z)
                                  </li>
                                  <li className="flex items-center">
                                    <span
                                      className={`mr-2 ${
                                        passwordCriteria.number
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {passwordCriteria.number ? "✓" : "✗"}
                                    </span>
                                    At least one number (0-9)
                                  </li>
                                  <li className="flex items-center">
                                    <span
                                      className={`mr-2 ${
                                        passwordCriteria.special
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {passwordCriteria.special ? "✓" : "✗"}
                                    </span>
                                    At least one special character (@$!%*?&)
                                  </li>
                                </ul>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...field}
                            disabled={
                              isLoading ||
                              isSuccess ||
                              // !!accountStatus?.exists ||
                              isRateLimited
                            }
                            className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10 ${
                              fieldErrors.password
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full px-3 py-2 text-[#696969] hover:text-[#1d1c1d] hover:bg-transparent"
                            disabled={
                              isLoading ||
                              isSuccess ||
                              // !!accountStatus?.exists ||
                              isRateLimited
                            }
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
                      {fieldErrors.password ? (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          {fieldErrors.password}
                        </p>
                      ) : (
                        <FormMessage />
                      )}
                      {password  && !isRateLimited && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Password strength:
                            </span>
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
                            // indicatorClassName={getStrengthColor(
                            //   passwordStrength
                            // )}
                          />
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(passwordCriteria).map(
                              ([key, met]) => (
                                <div
                                  key={key}
                                  className={`text-xs px-2 py-1 rounded-full flex items-center ${
                                    met
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {met ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <X className="h-3 w-3 mr-1" />
                                  )}
                                  <span>
                                    {key === "length"
                                      ? "8+ chars"
                                      : key === "uppercase"
                                      ? "A-Z"
                                      : key === "lowercase"
                                      ? "a-z"
                                      : key === "number"
                                      ? "0-9"
                                      : "Special"}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-[#1d1c1d]">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                            disabled={
                              isLoading ||
                              isSuccess ||
                              // !!accountStatus?.exists ||
                              isRateLimited
                            }
                            className={`border-[#bbbbbb] focus-visible:ring-[#ff6a00] focus-visible:ring-offset-0 pr-10 ${
                              fieldErrors.confirmPassword
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-0 top-0 h-full px-3 py-2 text-[#696969] hover:text-[#1d1c1d] hover:bg-transparent"
                            disabled={
                              isLoading ||
                              isSuccess ||
                              // !!accountStatus?.exists ||
                              isRateLimited
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                            <span className="sr-only">
                              {showConfirmPassword
                                ? "Hide password"
                                : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      {fieldErrors.confirmPassword ? (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          {fieldErrors.confirmPassword}
                        </p>
                      ) : (
                        <FormMessage />
                      )}
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white"
                  disabled={
                    isLoading ||
                    isSuccess ||
                    // !!accountStatus?.exists ||
                    isRateLimited
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign up"
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
                  disabled={
                    isLoading ||
                    isSuccess ||
                    isGoogleLoading ||
                    // !!accountStatus?.exists ||
                    isRateLimited
                  }
                  onClick={handleGoogleSignUp}
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
                      Sign up with Google
                    </>
                  )}
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
