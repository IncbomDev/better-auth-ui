"use client"

import { ChevronDown, LogOut, Settings } from "lucide-react"
import { useContext } from "react"

import { cn } from "../lib/utils"
import { AuthUIContext } from "../lib/auth-ui-provider"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { UserAvatar } from "./user-avatar"

export interface UserButtonProps {
    className?: string
}

export function UserButton({ className }: UserButtonProps) {
    const { hooks: { useSession }, navigate, basePath } = useContext(AuthUIContext)
    const { data: session } = useSession()

    if (!session) {
        return (
            <Button 
                variant="outline" 
                className={cn("gap-2", className)}
                onClick={() => navigate(`${basePath}/sign-in`)}
            >
                Sign In
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("flex items-center gap-2 p-2", className)}>
                    <UserAvatar 
                        user={session.user} 
                        className="h-8 w-8"
                    />
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                    <UserAvatar 
                        user={session.user} 
                        className="h-8 w-8"
                    />
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`${basePath}/settings`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={async () => {
                        // Sign out logic would go here
                        window.location.href = `${basePath}/sign-out`
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}