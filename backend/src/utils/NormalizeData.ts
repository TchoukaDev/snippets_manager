export const normalizeToDb = (data: string): string => {
    return data.toLowerCase().trim()
}

export const normalizeToFrontend = (data: string): string => {
    return data.charAt(0).toUpperCase() + data.slice(1)
}