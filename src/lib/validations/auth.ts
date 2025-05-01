import * as z from "zod"

export const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
})

export const signupSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .refine((password) => /[A-Z]/.test(password), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((password) => /[0-9]/.test(password), {
            message: "Password must contain at least one number",
        })
        .refine((password) => /[^A-Za-z0-9]/.test(password), {
            message: "Password must contain at least one special character",
        }),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

