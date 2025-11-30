"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Upload, Shield, Search, HelpCircle, Minimize2, Settings, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { sampleChatMessages, searchDocuments, currentUser, type ChatMessage } from "@/lib/mock-data"

const quickActions = [
  { icon: Upload, label: "Upload a document", action: "upload" },
  { icon: Shield, label: "Verify this document", action: "verify" },
  { icon: Search, label: "Search my docs", action: "search" },
  { icon: HelpCircle, label: "Explain verification", action: "explain" },
]

const mockResponses: Record<string, string> = {
  upload:
    "I'd be happy to help you upload a document! Just drag and drop your file into the upload area, or click to browse. I'll guide you through the process step by step. Would you like me to take you to the upload page?",
  verify:
    "To verify a document, you can either:\n\n1. Use the verification link shared with you\n2. Enter the document's blockchain transaction ID\n3. Search for the document by its hash\n\nWhich method would you like to use?",
  search:
    "I can search your vault! What would you like to find? You can search by:\n\n• Document type (e.g., 'birth certificate')\n• Keywords in the document\n• Date uploaded\n\nJust tell me what you're looking for!",
  explain:
    "Great question! Here's how blockchain verification works in simple terms:\n\n1. **Upload**: When you upload a document, we create a unique digital fingerprint (hash)\n\n2. **Store**: This hash is recorded on the Solana blockchain - think of it as a permanent, tamper-proof receipt\n\n3. **Verify**: Anyone can verify your document by checking if its fingerprint matches what's stored on the blockchain\n\n**The key point**: Your actual document stays private and encrypted. Only the fingerprint is public. This proves authenticity without exposing your data!",
  default:
    "I'm here to help! I can assist you with:\n\n• Uploading and securing documents\n• Verifying document authenticity\n• Searching your vault\n• Explaining how SierraVault works\n\nWhat would you like to do?",
}

interface ChatWidgetProps {
  defaultOpen?: boolean
}

export function ChatWidget({ defaultOpen = false }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChatMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [llmModel, setLlmModel] = useState<"chatgpt" | "deepseek" | "mixed">("chatgpt")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Check for document search
    const searchMatch = input.toLowerCase().match(/search|find|look for|where is/i)
    let responseContent = mockResponses.default

    if (searchMatch) {
      const results = searchDocuments(currentUser.id, input)
      if (results.length > 0) {
        responseContent = `I found ${results.length} document(s) matching your search:\n\n${results
          .map((doc) => `• **${doc.docType}** - Uploaded ${doc.uploadDate}`)
          .join("\n")}\n\nWould you like me to show you more details about any of these?`
      } else {
        responseContent =
          "I couldn't find any documents matching your search. Try different keywords or check the spelling."
      }
    } else if (input.toLowerCase().includes("upload")) {
      responseContent = mockResponses.upload
    } else if (input.toLowerCase().includes("verify")) {
      responseContent = mockResponses.verify
    } else if (input.toLowerCase().includes("blockchain") || input.toLowerCase().includes("explain")) {
      responseContent = mockResponses.explain
    }

    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}_assistant`,
      role: "assistant",
      content: responseContent,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleQuickAction = (action: string) => {
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: mockResponses[action] || mockResponses.default,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 800)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal text-navy-dark shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-flag-green text-[10px] font-bold text-white">
          1
        </span>
      </button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed z-50 border-border bg-card shadow-2xl transition-all duration-300",
        isMinimized
          ? "bottom-6 right-6 h-14 w-72 rounded-full"
          : "bottom-6 right-6 h-[32rem] w-96 max-w-[calc(100vw-2rem)] rounded-2xl sm:w-96",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between border-b border-border bg-navy-light px-4",
          isMinimized ? "h-14 rounded-full" : "h-14 rounded-t-2xl",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal">
            <Sparkles className="h-4 w-4 text-navy-dark" />
          </div>
          {!isMinimized && (
            <div>
              <p className="text-sm font-semibold text-foreground">SierraVault AI</p>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Settings Panel */}
          {showSettings && (
            <div className="border-b border-border bg-navy-light p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">AI Model</p>
              <div className="flex gap-2">
                {(["chatgpt", "deepseek", "mixed"] as const).map((model) => (
                  <button
                    key={model}
                    onClick={() => setLlmModel(model)}
                    className={cn(
                      "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      llmModel === model
                        ? "bg-teal text-navy-dark"
                        : "bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {model === "chatgpt" ? "ChatGPT" : model === "deepseek" ? "DeepSeek" : "Mixed"}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">TODO: Connect to LLM API ({llmModel})</p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 h-72">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                      message.role === "user"
                        ? "bg-teal text-navy-dark rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md",
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-border px-4 py-2">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-teal/50 hover:text-foreground"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-secondary border-border rounded-full"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className="h-10 w-10 rounded-full bg-teal text-navy-dark hover:bg-teal-light disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}
