"use client"

import { useState } from "react"
import { User, Mail, Phone, Shield, Bell, Key, Wallet, Save, Eye, EyeOff, CreditCard, Info, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { currentUser } from "@/lib/mock-data"

export default function SettingsPage() {
  const [showWallet, setShowWallet] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [nin, setNin] = useState(currentUser.nin || "")
  const [isEditingNin, setIsEditingNin] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditingNin(false)
  }

  return (
    <div className="p-6 lg:p-10 lg:pl-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and security preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Section */}
        <Card className="border-border bg-card p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-teal" />
            Profile Information
          </h2>
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue={currentUser.name} className="bg-secondary border-border h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue={currentUser.email}
                    className="pl-10 bg-secondary border-border h-11"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="+232 76 123 4567"
                  className="pl-10 bg-secondary border-border h-11"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-teal" />
            Government Identity
          </h2>

          {/* Info note */}
          <div className="mb-6 p-4 rounded-lg bg-teal/10 border border-teal/20 flex items-start gap-3">
            <Info className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80">
              Adding your NIN connects your profile with government-verified records. This enables automatic syncing of
              government-issued documents to your vault.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nin">National Identification Number (NIN)</Label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="nin"
                    type="text"
                    placeholder="SL-19900101-001"
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                    disabled={!isEditingNin && !!currentUser.nin}
                    className="pl-10 bg-secondary border-border h-11"
                  />
                </div>
                {currentUser.nin ? (
                  <Button
                    variant="outline"
                    className="border-border text-foreground bg-transparent h-11"
                    onClick={() => setIsEditingNin(!isEditingNin)}
                  >
                    {isEditingNin ? "Cancel" : "Edit"}
                  </Button>
                ) : (
                  <Button
                    className="bg-teal text-navy-dark hover:bg-teal-light h-11"
                    onClick={handleSave}
                    disabled={!nin}
                  >
                    Add NIN
                  </Button>
                )}
              </div>
              {!currentUser.nin && (
                <p className="text-xs text-muted-foreground">
                  Optional: Add your NIN to receive government documents automatically.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Security Section */}
        <Card className="border-border bg-card p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal" />
            Security
          </h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
              />
            </div>
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="border-border text-foreground gap-2 bg-transparent">
                <Key className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="border-border bg-card p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal" />
            Notifications
          </h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your documents via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Get text alerts for important updates</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Wallet Section */}
        <Card className="border-border bg-card p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-solana" />
            Blockchain Wallet
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Public Key</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-secondary px-4 py-3 text-sm font-mono text-foreground truncate">
                  {showWallet ? currentUser.walletPubKey : "••••••••••••••••••••••••"}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-11 w-11"
                  onClick={() => setShowWallet(!showWallet)}
                >
                  {showWallet ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Toggle wallet visibility</span>
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This wallet is used for blockchain verification. Keep your private key safe.
            </p>
          </div>
        </Card>

        <Card className="border-border bg-card p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Mic className="h-5 w-5 text-teal" />
            AI Voice Assistant
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Use voice commands in Krio or English to navigate and manage your vault.
          </p>
          <Button
            variant="outline"
            className="border-teal/50 text-teal hover:bg-teal/10 bg-transparent gap-2"
            onClick={() => alert("AI Voice Assistant coming soon! Support for Krio & English.")}
          >
            <Mic className="h-4 w-4" />
            AI Voice (Krio/English)
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Coming soon - Voice-powered document management</p>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-teal text-navy-dark hover:bg-teal-light gap-2 h-12"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
