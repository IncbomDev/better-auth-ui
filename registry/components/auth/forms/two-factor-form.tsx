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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../ui/input-otp"
import { FormError } from "../../form-error"

const twoFactorSchema = z.object({
    code: z.string().min(6, "Code must be 6 digits").max(6, "Code must be 6 digits"),
})

export type TwoFactorFormData = z.infer<typeof twoFactorSchema>

export interface TwoFactorFormProps {
    className?: string
    onSubmit?: (data: TwoFactorFormData) => Promise<void>
    onResend?: () => Promise<void>
}

export function TwoFactorForm({
    className,
    onSubmit,
    onResend,
}: TwoFactorFormProps) {
    const { localization } = useContext(AuthUIContext)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)

    const form = useForm<TwoFactorFormData>({
        resolver: zodResolver(twoFactorSchema),
        defaultValues: {
            code: "",
        },
    })

    const handleSubmit = async (data: TwoFactorFormData) => {
        if (!onSubmit) return
        
        setIsSubmitting(true)
        try {
            await onSubmit(data)
        } catch (error) {
            form.setError("root", {
                message: error instanceof Error ? error.message : "Invalid verification code"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResend = async () => {
        if (!onResend) return
        
        setIsResending(true)
        try {
            await onResend()
        } catch (error) {
            form.setError("root", {
                message: error instanceof Error ? error.message : "Failed to resend code"
            })
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className={cn("w-full max-w-md", className)}>
            <div className="space-y-2 text-center mb-6">
                <h3 className="text-lg font-medium">Two-factor authentication</h3>
                <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code from your authenticator app.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormError />

                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <div className="flex justify-center">
                                        <InputOTP 
                                            maxLength={6}
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-3">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting || form.watch("code").length !== 6}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify Code
                        </Button>

                        {onResend && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={isResending}
                                onClick={handleResend}
                            >
                                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Resend Code
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    )
}