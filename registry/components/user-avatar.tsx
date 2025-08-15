"use client"

import { UserRound } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Skeleton } from "@/ui/skeleton"

export interface UserAvatarClassNames {
  base?: string
  image?: string
  fallback?: string
  fallbackIcon?: string
  skeleton?: string
}

export interface UserAvatarProps {
  classNames?: UserAvatarClassNames
  isPending?: boolean
  size?: "sm" | "default" | "lg" | "xl" | null
  user?: {
    name?: string | null
    displayName?: string | null
    fullName?: string | null
    firstName?: string | null
    username?: string | null
    email?: string | null
    image?: string | null
    avatar?: string | null
    avatarUrl?: string | null
  } | null
  src?: string | null
}

const firstTwoCharacters = (name?: string | null) => name?.slice(0, 2)

/**
 * Displays a user avatar with image and fallback support
 *
 * Renders a user's avatar image when available, with appropriate fallbacks:
 * - Shows a skeleton when isPending is true
 * - Displays first two characters of user's name when no image is available
 * - Falls back to a generic user icon when neither image nor name is available
 */
const UserAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  UserAvatarProps & React.ComponentPropsWithoutRef<typeof Avatar>
>(({ className, classNames, isPending, size, user, src: propSrc, ...props }, ref) => {
  const name =
    user?.displayName ||
    user?.name ||
    user?.fullName ||
    user?.firstName ||
    user?.username ||
    user?.email

  const userImage = user?.image || user?.avatar || user?.avatarUrl
  const src = propSrc || userImage

  if (isPending) {
    return (
      <Skeleton
        className={cn(
          "shrink-0 rounded-full",
          size === "sm"
            ? "size-6"
            : size === "lg"
              ? "size-10"
              : size === "xl"
                ? "size-12"
                : "size-8",
          className,
          classNames?.base,
          classNames?.skeleton
        )}
      />
    )
  }

  return (
    <Avatar
      ref={ref}
      className={cn(
        "bg-muted",
        size === "sm"
          ? "size-6"
          : size === "lg"
            ? "size-10"
            : size === "xl"
              ? "size-12"
              : "size-8",
        className,
        classNames?.base
      )}
      {...props}
    >
      <AvatarImage
        alt={name || "User"}
        className={classNames?.image}
        src={src || undefined}
      />

      <AvatarFallback
        className={cn(
          "text-foreground uppercase",
          classNames?.fallback
        )}
        delayMs={src ? 600 : undefined}
      >
        {firstTwoCharacters(name) || (
          <UserRound
            className={cn("size-[50%]", classNames?.fallbackIcon)}
          />
        )}
      </AvatarFallback>
    </Avatar>
  )
})
UserAvatar.displayName = "UserAvatar"

export { UserAvatar }