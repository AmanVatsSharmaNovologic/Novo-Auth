import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge class names while respecting Tailwind precedence.
 */
export const cn = (...classes: Parameters<typeof clsx>) => twMerge(clsx(classes));


