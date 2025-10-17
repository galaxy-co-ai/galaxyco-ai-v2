"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Home, Mail, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 403 Large Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">403</h1>
          <div className="relative -mt-16">
            <div className="mx-auto h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <Shield className="h-12 w-12 text-destructive" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Sorry, you don&apos;t have permission to access this resource. This
          could be because:
        </p>

        {/* Reasons List */}
        <div className="mb-8 p-6 bg-muted rounded-lg text-left max-w-md mx-auto">
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span>
                Your account doesn&apos;t have the required permissions
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span>The resource is restricted to certain user roles</span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Your session may have expired</span>
            </li>
            <li className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span>This feature requires a higher subscription plan</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Request Access Card */}
        <div className="p-6 bg-muted rounded-lg max-w-md mx-auto">
          <h3 className="font-semibold mb-2">Need Access?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you believe you should have access to this resource, contact your
            workspace admin or request access.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/settings/team">
              <Button variant="outline" size="sm">
                View Team
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="h-4 w-4" />
                Request Access
              </Button>
            </Link>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-8 flex justify-center gap-4 text-sm">
          <Link href="/billing" className="text-primary hover:underline">
            Upgrade Plan
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/docs" className="text-primary hover:underline">
            Documentation
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/support" className="text-primary hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
