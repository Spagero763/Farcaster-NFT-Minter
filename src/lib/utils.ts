import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseError(error: any): string {
    if (typeof error === 'string') {
        return error;
    }
    if (error?.shortMessage) {
        return error.shortMessage;
    }
    if (error?.message) {
        return error.message.split('Details:')[0].trim();
    }
    if (error?.data?.message) {
        return error.data.message;
    }
    return 'An unexpected error occurred.';
}
