"use client"

import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  enableToggle?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, enableToggle = true, onChange, ...props }, ref) => {
    const [disabled, setDisabled] = React.useState(true)
    const [isVisible, setIsVisible] = React.useState(false)

    return (
      <div className="relative">
        <Input
          className={cn(enableToggle && "pr-10", className)}
          {...props}
          ref={ref}
          type={isVisible && enableToggle ? "text" : "password"}
          onChange={(event) => {
            setDisabled(!event.target.value)
            onChange?.(event)
          }}
        />

        {enableToggle && (
          <>
            <Button
              className="!bg-transparent absolute top-0 right-0"
              disabled={disabled}
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <Eye /> : <EyeOff />}
            </Button>

            <style>{`
              .hide-password-toggle::-ms-reveal,
              .hide-password-toggle::-ms-clear {
                visibility: hidden;
                pointer-events: none;
                display: none;
              }
            `}</style>
          </>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }