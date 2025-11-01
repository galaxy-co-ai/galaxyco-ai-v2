import { Metadata } from 'next';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

export const metadata: Metadata = {
  title: 'Settings | GalaxyCo.ai',
  description: 'Mobile settings',
};

// Mock user data
const user = {
  name: 'Alex Chen',
  email: 'alex.chen@company.com',
  avatar: 'AC',
  workspace: 'Acme Corporation',
};

export default function MobileSettingsPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* User Profile Section */}
        <div className="px-4 py-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar fallback={user.avatar} size="xl" />
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg truncate">{user.name}</h2>
              <p className="text-sm text-foreground-muted truncate">{user.email}</p>
              <p className="text-xs text-foreground-muted mt-1">{user.workspace}</p>
            </div>
            <button
              className="text-sm text-primary font-medium touch-manipulation"
              aria-label="Edit profile"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="py-2">
          <h3 className="px-4 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            Account
          </h3>
          <button className="flex items-center justify-between w-full px-4 py-4 active:bg-background-subtle transition-colors touch-manipulation">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-foreground-muted" />
              <span className="text-base">Profile</span>
            </div>
            <ChevronRight className="h-5 w-5 text-foreground-muted" />
          </button>
          <button className="flex items-center justify-between w-full px-4 py-4 active:bg-background-subtle transition-colors touch-manipulation">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-foreground-muted" />
              <span className="text-base">Security</span>
            </div>
            <ChevronRight className="h-5 w-5 text-foreground-muted" />
          </button>
        </div>

        {/* Preferences */}
        <div className="py-2 border-t border-border">
          <h3 className="px-4 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            Preferences
          </h3>
          <button className="flex items-center justify-between w-full px-4 py-4 active:bg-background-subtle transition-colors touch-manipulation">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-foreground-muted" />
              <span className="text-base">Notifications</span>
            </div>
            <ChevronRight className="h-5 w-5 text-foreground-muted" />
          </button>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-foreground-muted" />
              <span className="text-base">Dark Mode</span>
            </div>
            <Switch aria-label="Toggle dark mode" />
          </div>

          <button className="flex items-center justify-between w-full px-4 py-4 active:bg-background-subtle transition-colors touch-manipulation">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-foreground-muted" />
              <span className="text-base">Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground-muted">English</span>
              <ChevronRight className="h-5 w-5 text-foreground-muted" />
            </div>
          </button>
        </div>

        {/* Support */}
        <div className="py-2 border-t border-border">
          <h3 className="px-4 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            Support
          </h3>
          <button className="flex items-center justify-between w-full px-4 py-4 active:bg-background-subtle transition-colors touch-manipulation">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-foreground-muted" />
              <span className="text-base">Help & Support</span>
            </div>
            <ChevronRight className="h-5 w-5 text-foreground-muted" />
          </button>
        </div>

        {/* App Info */}
        <div className="px-4 py-6 text-center text-sm text-foreground-muted">
          <p>GalaxyCo.ai v2.0.0</p>
          <p className="mt-1">© 2025 GalaxyCo.ai. All rights reserved.</p>
        </div>

        {/* Sign Out */}
        <div className="px-4 pb-6">
          <button className="flex items-center justify-center gap-2 w-full py-4 border border-destructive text-destructive rounded-lg active:bg-destructive/10 transition-colors touch-manipulation font-medium">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
