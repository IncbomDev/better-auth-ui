"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import { Button } from "../../../ui/button"
import { Checkbox } from "../../../ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../ui/form"
import { Input } from "../../../ui/input"
import { PasswordInput } from "../../password-input"
import { FormError } from "../../form-error"
import { UserAvatar } from "../../user-avatar"

const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    username: z.string().optional(),
    acceptTerms: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
    image: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type SignUpFormData = z.infer<typeof signUpSchema>

export interface SignUpFormProps {
    className?: string
    onSubmit?: (data: SignUpFormData) => Promise<void>
    usernameEnabled?: boolean
    imageEnabled?: boolean
    termsURL?: string
    privacyURL?: string
}

export function SignUpForm({
    className,
    onSubmit,
    usernameEnabled = false,
    imageEnabled = false,
    termsURL,
    privacyURL,
}: SignUpFormProps) {
    const { localization } = useContext(AuthUIContext)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
            acceptTerms: false,
            image: "",
        },
    })

    const handleSubmit = async (data: SignUpFormData) => {
        if (!onSubmit) return
        
        setIsSubmitting(true)
        try {
            await onSubmit(data)
        } catch (error) {
            form.setError("root", {
                message: error instanceof Error ? error.message : "An error occurred during sign up"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={cn("w-full max-w-md", className)}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormError />

                    {imageEnabled && (
                        <div className="flex justify-center">
                            <UserAvatar 
                                user={{ image: form.watch("image") }}
                                className="h-20 w-20"
                            />
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your full name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {usernameEnabled && (
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

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

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Enter your password"
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
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Confirm your password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="acceptTerms"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm">
                                        I accept the{" "}
                                        {termsURL ? (
                                            <a
                                                href={termsURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:no-underline"
                                            >
                                                terms and conditions
                                            </a>
                                        ) : (
                                            "terms and conditions"
                                        )}
                                        {privacyURL && (
                                            <>
                                                {" "}and{" "}
                                                <a
                                                    href={privacyURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline hover:no-underline"
                                                >
                                                    privacy policy
                                                </a>
                                            </>
                                        )}
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </form>
            </Form>
        </div>
    )
}