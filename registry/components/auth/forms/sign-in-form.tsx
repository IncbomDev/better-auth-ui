"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/password-input"

export interface SignInFormProps {
  className?: string
  isSubmitting?: boolean
  onSubmit?: (data: SignInFormData) => void | Promise<void>
  usernameEnabled?: boolean
  rememberMeEnabled?: boolean
}

export interface SignInFormData {
  email: string
  password: string
  rememberMe?: boolean
}

const SignInForm = React.forwardRef<HTMLFormElement, SignInFormProps>(
  ({ 
    className, 
    isSubmitting = false, 
    onSubmit,
    usernameEnabled = false,
    rememberMeEnabled = true,
    ...props 
  }, ref) => {
    const formSchema = z.object({
      email: usernameEnabled
        ? z.string().min(1, { message: "Username is required" })
        : z
            .string()
            .min(1, { message: "Email is required" })
            .email({ message: "Invalid email address" }),
      password: z.string().min(1, { message: "Password is required" }),
      rememberMe: z.boolean().optional(),
    })

    const form = useForm<SignInFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
        rememberMe: false,
      },
    })

    const handleSubmit = async (data: SignInFormData) => {
      try {
        await onSubmit?.(data)
      } catch (error) {
        console.error("Sign in error:", error)
      }
    }

    return (
      <Form {...form}>
        <form
          ref={ref}
          className={cn("space-y-4", className)}
          onSubmit={form.handleSubmit(handleSubmit)}
          {...props}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {usernameEnabled ? "Username" : "Email"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={usernameEnabled ? "Enter your username" : "Enter your email"}
                    type={usernameEnabled ? "text" : "email"}
                    autoComplete={usernameEnabled ? "username" : "email"}
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
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {rememberMeEnabled && (
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || form.formState.isSubmitting}
          >
            {isSubmitting || form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>
    )
  }
)
SignInForm.displayName = "SignInForm"

export { SignInForm }