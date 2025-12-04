"use client"

import { toast as sonner } from "sonner"

type ToastType = "success" | "error" | "warning" | "info"

export function useToast() {
    function showToast(
        type: ToastType,
        title: string,
        description?: string
    ) {
        const fn = mapType(type)
        fn(title, {
            description,
            duration: 3500,
        })
    }

    function mapType(type: ToastType) {
        switch (type) {
            case "success":
                return sonner.success
            case "error":
                return sonner.error
            case "warning":
                return sonner.warning
            case "info":
            default:
                return sonner
        }
    }

    return { showToast }
}
