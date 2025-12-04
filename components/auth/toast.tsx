"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastMessage {
  id: string
  type: ToastType
  message: string
}

let toastQueue: ToastMessage[] = []
let listeners: Array<(toasts: ToastMessage[]) => void> = []

function notify(type: ToastType, message: string) {
  const id = Math.random().toString(36).substring(7)
  const toast: ToastMessage = { id, type, message }
  toastQueue = [...toastQueue, toast]
  listeners.forEach((listener) => listener(toastQueue))

  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id)
    listeners.forEach((listener) => listener(toastQueue))
  }, 5000)
}

export const toast = {
  success: (message: string) => notify("success", message),
  error: (message: string) => notify("error", message),
  warning: (message: string) => notify("warning", message),
  info: (message: string) => notify("info", message),
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setToasts)
    }
  }, [])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 flex items-start gap-3 min-w-[320px] animate-in slide-in-from-right"
          >
            <div className={`${colors[toast.type]} text-white p-1 rounded`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="flex-1 text-sm text-gray-900">{toast.message}</p>
            <button
              onClick={() => {
                toastQueue = toastQueue.filter((t) => t.id !== toast.id)
                listeners.forEach((listener) => listener(toastQueue))
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
