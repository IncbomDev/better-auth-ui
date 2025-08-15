import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidEmail(email: string) {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Converts error codes from SNAKE_CASE to camelCase
 * Example: INVALID_TWO_FACTOR_COOKIE -> invalidTwoFactorCookie
 */
export function errorCodeToCamelCase(errorCode: string): string {
  return errorCode
    .toLowerCase()
    .replace(/_([a-z])/g, (_, char) => char.toUpperCase())
}

export function getSearchParam(paramName: string) {
  return typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get(paramName)
    : null
}

export function getViewByPath<T extends object>(viewPaths: T, path?: string) {
  for (const key in viewPaths) {
    if (viewPaths[key] === path) {
      return key
    }
  }
}

export function getKeyByValue<T extends Record<string, unknown>>(
  object: T,
  value?: T[keyof T]
): keyof T | undefined {
  return (Object.keys(object) as Array<keyof T>).find(
    (key) => object[key] === value
  )
}