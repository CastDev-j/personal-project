import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @description Utility function to merge class names using clsx and tailwind-merge.
 *
 * @example
 * cn('px-4 py-2', 'bg-blue-500', condition && 'text-white')
 * cn('text-sm', isLarge ? 'text-lg' : 'text-base')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
