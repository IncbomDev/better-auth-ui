"use client"

import { createContext, type ReactNode } from "react"
import { toast } from "sonner"

// Basic types for auth-ui-provider
export interface AuthUIContextType {
  authClient?: any
  basePath: string
  hooks: {
    useSession: () => {
      data: any
      isPending: boolean
      error: any
      refetch: () => void
    }
    useActiveOrganization?: () => any
    useListOrganizations?: () => any
  }
  localization: any
  navigate: (href: string) => void
  replace: (href: string) => void
  toast: (options: { variant?: string; message: string }) => void
  viewPaths: Record<string, string>
  redirectTo?: string
  onSessionChange?: () => void
  organization?: {
    pathMode?: "slug" | "id"
    slug?: string
  }
}

export const AuthUIContext = createContext<AuthUIContextType>({
  basePath: "/auth",
  hooks: {
    useSession: () => ({
      data: null,
      isPending: false,
      error: null,
      refetch: () => {},
    }),
  },
  localization: {},
  navigate: (href: string) => {
    window.location.href = href
  },
  replace: (href: string) => {
    window.location.replace(href)
  },
  toast: ({ variant = "default", message }) => {
    if (variant === "default") {
      toast(message)
    } else {
      toast[variant as keyof typeof toast]?.(message)
    }
  },
  viewPaths: {
    SIGN_IN: "sign-in",
    SIGN_UP: "sign-up",
    FORGOT_PASSWORD: "forgot-password",
    RESET_PASSWORD: "reset-password",
  },
})

export interface AuthUIProviderProps {
  children: ReactNode
  authClient?: any
  basePath?: string
  redirectTo?: string
  onSessionChange?: () => void
  hooks: AuthUIContextType["hooks"]
  localization?: any
  organization?: AuthUIContextType["organization"]
  navigate?: (href: string) => void
  replace?: (href: string) => void
  toast?: (options: { variant?: string; message: string }) => void
  viewPaths?: Record<string, string>
}

export function AuthUIProvider({
  children,
  authClient,
  basePath = "/auth",
  redirectTo,
  onSessionChange,
  hooks,
  localization = {},
  organization,
  navigate = (href: string) => {
    window.location.href = href
  },
  replace = (href: string) => {
    window.location.replace(href)
  },
  toast: customToast = ({ variant = "default", message }) => {
    if (variant === "default") {
      toast(message)
    } else {
      toast[variant as keyof typeof toast]?.(message)
    }
  },
  viewPaths = {
    SIGN_IN: "sign-in",
    SIGN_UP: "sign-up",
    FORGOT_PASSWORD: "forgot-password",
    RESET_PASSWORD: "reset-password",
  },
}: AuthUIProviderProps) {
  const contextValue: AuthUIContextType = {
    authClient,
    basePath,
    hooks,
    localization,
    navigate,
    replace,
    toast: customToast,
    viewPaths,
    redirectTo,
    onSessionChange,
    organization,
  }

  return (
    <AuthUIContext.Provider value={contextValue}>
      {children}
    </AuthUIContext.Provider>
  )
}