"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DocumentType {
    label: string;
    url: string;
    type: string;
    uploadedAt: Date;
}

interface NinRecordType {
    nin: string;
    surname: string;
    name: string;
    middlename?: string;
    dob: string;
    dateOfExpiry: string;
    personalIdNumber: string;
}

interface UserType {
    _id: string;
    email: string;
    telephone: string;
    vaultId: string;
    nin?: string;
    ninRecord?: NinRecordType | null;
    documents: DocumentType[];
}

interface UserContextType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    loading: boolean;
    refreshUser: () => Promise<void>;
    updateUser: (fields: Partial<Pick<UserType, "email" | "telephone" | "nin" | "ninRecord">>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser({
                    ...data.user,
                    ninRecord: data.user.ninRecord || null,
                });
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const refreshUser = async () => fetchUser();

    // ← Move updateUser inside provider
    const updateUser = async (fields: Partial<Pick<UserType, "email" | "telephone" | "nin" | "ninRecord">>) => {
        if (!user?._id) throw new Error("No user loaded");

        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, ...fields }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update user");
            }

            const data = await res.json();
            setUser(data.user);
        } catch (err) {
            console.error("Failed to update user:", err);
            throw err;
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
