"use client"

import { AlertCircle } from "lucide-react"
import { useFormState } from "react-hook-form"

import { cn } from "../lib/utils"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

export interface FormErrorProps {
    title?: string
    className?: string
}

export function FormError({ title, className }: FormErrorProps) {
    const { errors } = useFormState()

    if (!errors.root?.message) return null

    return (
        <Alert variant="destructive" className={cn(className)}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title || "Error"}</AlertTitle>
            <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
    )
}