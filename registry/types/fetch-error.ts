export interface FetchError extends Error {
    status?: number
    statusText?: string
    url?: string
}