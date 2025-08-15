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
import { Input } from "../../../ui/input"
import { FormError } from "../../form-error"

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export interface ForgotPasswordFormProps {
    className?: string
    onSubmit?: (data: ForgotPasswordFormData) => Promise<void>
}

export function ForgotPasswordForm({
    className,
    onSubmit,
}: ForgotPasswordFormProps) {
    const { localization } = useContext(AuthUIContext)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const handleSubmit = async (data: ForgotPasswordFormData) => {
        if (!onSubmit) return
        
        setIsSubmitting(true)
        try {
            await onSubmit(data)
            setIsSuccess(true)
        } catch (error) {
            form.setError("root", {
                message: error instanceof Error ? error.message : "An error occurred while sending reset email"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className={cn("w-full max-w-md text-center space-y-4", className)}>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Check your email</h3>
                    <p className="text-sm text-muted-foreground">
                        We've sent a password reset link to {form.getValues("email")}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsSuccess(false)
                        form.reset()
                    }}
                    className="w-full"
                >
                    Send another email
                </Button>
            </div>
        )
    }

    return (
        <div className={cn("w-full max-w-md", className)}>
            <div className="space-y-2 text-center mb-6">
                <h3 className="text-lg font-medium">Forgot your password?</h3>
                <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormError />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
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
                        Send Reset Link
                    </Button>
                </form>
            </Form>
        </div>
    )
}