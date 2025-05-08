import { useContext, useEffect, useMemo, useRef } from "react"

import { useOnSuccessTransition } from "../../hooks/use-success-transition"
import type { AuthLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { getLocalizedError } from "../../lib/utils"
import type { AuthClient } from "../../types/auth-client"

interface OneTapProps {
    localization: Partial<AuthLocalization>
    redirectTo?: string
}

export function OneTap({ localization, redirectTo }: OneTapProps) {
    const { authClient, localization: contextLocalization, toast } = useContext(AuthUIContext)
    const oneTapFetched = useRef(false)

    localization = useMemo(
        () => ({ ...contextLocalization, ...localization }),
        [contextLocalization, localization]
    )

    const { onSuccess } = useOnSuccessTransition({ redirectTo })

    useEffect(() => {
        if (oneTapFetched.current) return
        oneTapFetched.current = true

        try {
            ;(authClient as AuthClient).oneTap({
                fetchOptions: {
                    throw: true,
                    onSuccess
                }
            })
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }, [authClient, localization, onSuccess, toast])

    return null
}
