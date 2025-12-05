"use client";

import React, { useState } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ModalProps> = ({ open, onClose }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setSaving(true);
        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to change password");
            }

            alert("Password changed successfully");
            onClose();
            setPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-card p-6 rounded-lg w-full max-w-md">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Key className="h-5 w-5 text-teal" /> Change Password
                </h2>

                <div className="space-y-3">
                    <Input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleChange} disabled={saving}>
                        {saving ? "Saving..." : "Change"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
