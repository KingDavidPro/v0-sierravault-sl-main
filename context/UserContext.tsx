"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface DocumentType {
    label: string
    url: string
    type: string
    uploadedAt: Date
}

interface UserType {
    _id: string
    email: string
    telephone: string
    nin?: string
    vaultId: string
    documents: DocumentType[]
}

interface UserContextType {
    user: UserType | null
    setUser: (user: UserType | null) => void
    loading: boolean
    refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null)
    const [loading, setLoading] = useState(true) // <-- loading state

    const fetchUser = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/auth/me")
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
            } else {
                setUser(null)
            }
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const refreshUser = async () => fetchUser()

    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUser must be used within a UserProvider")
    return context
}
