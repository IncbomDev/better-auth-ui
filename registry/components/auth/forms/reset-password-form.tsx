"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import { Button } from "../../../ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../ui/form"
import { PasswordInput } from "../../password-input"
import { FormError } from "../../form-error"

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export interface ResetPasswordFormProps {
    className?: string
    onSubmit?: (data: ResetPasswordFormData) => Promise<void>
    token?: string
}

export function ResetPasswordForm({
    className,
    onSubmit,
    token,
}: ResetPasswordFormProps) {
    const { localization } = useContext(AuthUIContext)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const handleSubmit = async (data: ResetPasswordFormData) => {
        if (!onSubmit) return
        
        setIsSubmitting(true)
        try {
            await onSubmit(data)
            setIsSuccess(true)
        } catch (error) {
            form.setError("root", {
                message: error instanceof Error ? error.message : "An error occurred while resetting password"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className={cn("w-full max-w-md text-center space-y-4", className)}>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Password reset successful</h3>
                    <p className="text-sm text-muted-foreground">
                        Your password has been successfully reset. You can now sign in with your new password.
                    </p>
                </div>
                <Button
                    onClick={() => window.location.href = "/auth/sign-in"}
                    className="w-full"
                >
                    Sign In
                </Button>
            </div>
        )
    }

    return (
        <div className={cn("w-full max-w-md", className)}>
            <div className="space-y-2 text-center mb-6">
                <h3 className="text-lg font-medium">Reset your password</h3>
                <p className="text-sm text-muted-foreground">
                    Enter your new password below.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormError />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Enter your new password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Confirm your new password"
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </form>
            </Form>
        </div>
    )
}