"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Organization } from "better-auth/plugins/organization"
import { useContext, useMemo } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useCurrentOrganization } from "../../hooks/use-current-organization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../lib/utils"
import {
    SettingsCard,
    type SettingsCardProps
} from "../settings/shared/settings-card"
import { CardContent } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Skeleton } from "../ui/skeleton"

export interface OrganizationSlugCardProps extends SettingsCardProps {
    slug?: string
}

export function OrganizationSlugCard({
    className,
    classNames,
    localization: localizationProp,
    slug,
    ...props
}: OrganizationSlugCardProps) {
    const { localization: contextLocalization } = useContext(AuthUIContext)

    const localization = useMemo(
        () => ({ ...contextLocalization, ...localizationProp }),
        [contextLocalization, localizationProp]
    )

    const { data: organization } = useCurrentOrganization({ slug })

    if (!organization) {
        return (
            <SettingsCard
                className={className}
                classNames={classNames}
                description={localization.ORGANIZATION_SLUG_DESCRIPTION}
                instructions={localization.ORGANIZATION_SLUG_INSTRUCTIONS}
                isPending
                title={localization.ORGANIZATION_SLUG}
                actionLabel={localization.SAVE}
                optimistic={props.optimistic}
                {...props}
            >
                <CardContent className={classNames?.content}>
                    <Skeleton
                        className={cn("h-9 w-full", classNames?.skeleton)}
                    />
                </CardContent>
            </SettingsCard>
        )
    }

    return (
        <OrganizationSlugForm
            className={className}
            classNames={classNames}
            localization={localization}
            slug={slug}
            organization={organization}
            {...props}
        />
    )
}

function OrganizationSlugForm({
    className,
    classNames,
    localization: localizationProp,
    organization,
    ...props
}: OrganizationSlugCardProps & { organization: Organization }) {
    const {
        authClient,
        localization: contextLocalization,
        hooks: { useListOrganizations, useHasPermission },
        optimistic,
        toast
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp }

    const { refetch: refetchOrganizations } = useListOrganizations()

    const { data: hasPermission, isPending } = useHasPermission({
        organizationId: organization.id,
        permissions: {
            organization: ["update"]
        }
    })

    const formSchema = z.object({
        slug: z
            .string()
            .min(1, {
                message: `${localization.ORGANIZATION_SLUG} ${localization.IS_REQUIRED}`
            })
            .regex(/^[a-z0-9-]+$/, {
                message: `${localization.ORGANIZATION_SLUG} ${localization.IS_INVALID}`
            })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        values: { slug: organization.slug || "" }
    })

    const { isSubmitting } = form.formState

    const updateOrganizationSlug = async ({
        slug
    }: z.infer<typeof formSchema>) => {
        if (organization.slug === slug) {
            toast({
                variant: "error",
                message: `${localization.ORGANIZATION_SLUG} ${localization.IS_THE_SAME}`
            })

            return
        }

        try {
            await authClient.organization.update({
                organizationId: organization.id,
                data: { slug },
                fetchOptions: {
                    throw: true
                }
            })

            await refetchOrganizations?.()

            toast({
                variant: "success",
                message: `${localization.ORGANIZATION_SLUG} ${localization.UPDATED_SUCCESSFULLY}`
            })
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(updateOrganizationSlug)}>
                <SettingsCard
                    className={className}
                    classNames={classNames}
                    description={localization.ORGANIZATION_SLUG_DESCRIPTION}
                    instructions={localization.ORGANIZATION_SLUG_INSTRUCTIONS}
                    isPending={isPending}
                    title={localization.ORGANIZATION_SLUG}
                    actionLabel={localization.SAVE}
                    optimistic={optimistic}
                    disabled={!hasPermission?.success}
                    {...props}
                >
                    <CardContent className={classNames?.content}>
                        {isPending ? (
                            <Skeleton
                                className={cn(
                                    "h-9 w-full",
                                    classNames?.skeleton
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className={classNames?.input}
                                                placeholder={
                                                    localization.ORGANIZATION_SLUG_PLACEHOLDER
                                                }
                                                disabled={
                                                    isSubmitting ||
                                                    !hasPermission?.success
                                                }
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage
                                            className={classNames?.error}
                                        />
                                    </FormItem>
                                )}
                            />
                        )}
                    </CardContent>
                </SettingsCard>
            </form>
        </Form>
    )
}
