"use client";

import React, { useState, useEffect } from "react";
import { User, CreditCard, Info, Wallet, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import ChangePasswordModal from "@/components/change-password-modal";

export default function SettingsPage() {
  const { user, loading, updateUser } = useUser();

  const [showWallet, setShowWallet] = useState(false);
  const [ninData, setNinData] = useState({
    nin: "",
    surname: "",
    name: "",
    middlename: "",
    dob: "",
    dateOfExpiry: "",
    personalIdNumber: "",
  });
  const [addingNin, setAddingNin] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  // Email & phone local state synced with context
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [updatingField, setUpdatingField] = useState<null | "email" | "telephone">(null);

  // Sync local state when user is loaded
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setTelephone(user.telephone);
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  // -------------------- Email / Phone Update --------------------
  const handleFieldUpdate = async (field: "email" | "telephone") => {
    const value = field === "email" ? email : telephone;

    if (field === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      return alert("Invalid email address");
    }

    if (field === "telephone" && !/^\+?\d{7,15}$/.test(value)) {
      return alert("Invalid phone number");
    }

    setUpdatingField(field);
    try {
      await updateUser({ [field]: value });
      alert(`${field === "email" ? "Email" : "Phone number"} updated successfully`);
    } catch (err: any) {
      alert(err.message || "Failed to update. Try again.");
    } finally {
      setUpdatingField(null);
    }
  };

  // -------------------- Add NIN --------------------
  const handleAddNin = async () => {
    const { nin, surname, name, dob, dateOfExpiry, personalIdNumber } = ninData;
    if (!nin || !surname || !name || !dob || !dateOfExpiry || !personalIdNumber) {
      return alert("All fields are required for NIN verification.");
    }

    setAddingNin(true);
    try {
      const res = await fetch("/api/user/add-nin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, ...ninData }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Update user context with new NIN info
      await updateUser({ nin: ninData.nin, ninRecord: data.ninRecord });
      alert("NIN added successfully");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddingNin(false);
    }
  };

  const fullName = user.ninRecord
      ? [user.ninRecord.name, user.ninRecord.middlename, user.ninRecord.surname].filter(Boolean).join(" ")
      : "";

  return (
      <div className="p-6 lg:p-10 lg:pl-12 space-y-6">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl mb-8">Settings</h1>

        <div className="space-y-6 max-w-3xl">
          {/* NIN Section */}
          <Card className="border-border bg-card p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-teal" /> Government Identity
            </h2>

            <div className="mb-6 p-4 rounded-lg bg-teal/10 border border-teal/20 flex items-start gap-3">
              <Info className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80">
                Adding your NIN connects your profile with government-verified records.
              </p>
            </div>

            {!user.nin ? (
                <div className="space-y-2">
                  <Input placeholder="NIN" value={ninData.nin} onChange={(e) => setNinData({ ...ninData, nin: e.target.value })} className="bg-secondary border-border h-11" />
                  <Input placeholder="Surname" value={ninData.surname} onChange={(e) => setNinData({ ...ninData, surname: e.target.value })} className="bg-secondary border-border h-11" />
                  <Input placeholder="Name" value={ninData.name} onChange={(e) => setNinData({ ...ninData, name: e.target.value })} className="bg-secondary border-border h-11" />
                  <Input placeholder="Middle Name (optional)" value={ninData.middlename} onChange={(e) => setNinData({ ...ninData, middlename: e.target.value })} className="bg-secondary border-border h-11" />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Date of Birth</Label>
                      <Input type="date" value={ninData.dob} onChange={(e) => setNinData({ ...ninData, dob: e.target.value })} className="bg-secondary border-border h-11" />
                    </div>
                    <div>
                      <Label>Date of Expiry</Label>
                      <Input type="date" value={ninData.dateOfExpiry} onChange={(e) => setNinData({ ...ninData, dateOfExpiry: e.target.value })} className="bg-secondary border-border h-11" />
                    </div>
                  </div>

                  <Input placeholder="Personal ID Number" value={ninData.personalIdNumber} onChange={(e) => setNinData({ ...ninData, personalIdNumber: e.target.value })} className="bg-secondary border-border h-11" />

                  <Button className="bg-teal text-navy-dark hover:bg-teal-light h-11" onClick={handleAddNin} disabled={addingNin}>
                    {addingNin ? "Adding..." : "Add NIN"}
                  </Button>
                </div>
            ) : (
                <Input value={user.nin} disabled className="bg-secondary border-border h-11" />
            )}
          </Card>

          {/* Name Section */}
          {fullName && (
              <Card className="border-border bg-card p-6 lg:p-8">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-teal" /> Profile Information
                </h2>

                <Label>Full Name</Label>
                <Input value={fullName} disabled className="bg-secondary border-border h-11" />
              </Card>
          )}

          {/* Email + Phone Section */}
          <Card className="border-border bg-card p-6 lg:p-8 space-y-4">
            <div>
              <Label>Email Address</Label>
              <div className="flex gap-2">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={updatingField === "email"} className="bg-secondary border-border h-11" />
                <Button onClick={() => handleFieldUpdate("email")} disabled={updatingField === "email"} className="h-11">
                  {updatingField === "email" ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>

            <div>
              <Label>Phone Number</Label>
              <div className="flex gap-2">
                <Input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} disabled={updatingField === "telephone"} className="bg-secondary border-border h-11" />
                <Button onClick={() => handleFieldUpdate("telephone")} disabled={updatingField === "telephone"} className="h-11">
                  {updatingField === "telephone" ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="border-border bg-card p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Key className="h-5 w-5 text-teal" /> Security
            </h2>
            <Button variant="outline" onClick={() => setPasswordModal(true)}>
              Change Password
            </Button>
          </Card>

          {/* Blockchain Wallet */}
          <Card className="border-border bg-card p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-solana" /> Blockchain Wallet
            </h2>

            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-secondary px-4 py-3 text-sm font-mono text-foreground truncate">
                {showWallet ? (user as any).walletPubKey : "•••••••••••••••••••••••••••••"}
              </code>

              <Button variant="ghost" size="icon" onClick={() => setShowWallet(!showWallet)} className="h-11 w-11 text-muted-foreground">
                {showWallet ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </Card>
        </div>

        <ChangePasswordModal open={passwordModal} onClose={() => setPasswordModal(false)} />
      </div>
  );
}
