// Format time in HH:MM:SS format
export function formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

// Format duration in a human-readable format
export function formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    let result = ""
    if (hours > 0) {
        result += `${hours}h `
    }
    if (minutes > 0 || hours > 0) {
        result += `${minutes}m `
    }
    result += `${seconds}s`

    return result
}

// Format date in a readable format
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    })
}

// Get current time in HH:MM AM/PM format
export function getCurrentTime(): string {
    const now = new Date()
    return now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })
}

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
    const now = new Date()
    return now.toISOString().split("T")[0]
}

// Calculate progress percentage (for 8-hour workday)
export function calculateProgress(milliseconds: number): number {
    const maxTime = 8 * 60 * 60 * 1000 // 8 hours in milliseconds
    return Math.min((milliseconds / maxTime) * 100, 100)
}

// Convert ISO date to local time string
export function isoToLocalTime(isoString: string): string {
    const date = new Date(isoString)
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })
}

// Calculate elapsed time between two ISO dates
export function calculateElapsedTime(startTime: string, endTime?: string | null): number {
    const start = new Date(startTime).getTime()
    const end = endTime ? new Date(endTime).getTime() : Date.now()
    return end - start
}
