"use client"

import type React from "react"

import { ChatWidget } from "./chat-widget"

export function ChatProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  )
}
