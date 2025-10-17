"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Search, FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Large Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <div className="relative -mt-16">
            <FileQuestion className="h-24 w-24 mx-auto text-muted-foreground" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The
          page may have been moved or deleted.
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for pages..."
                className="pl-9"
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-4">
            Try these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/agents">
              <Button variant="outline" size="sm">
                Agents
              </Button>
            </Link>
            <Link href="/workflows">
              <Button variant="outline" size="sm">
                Workflows
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="sm">
                Documentation
              </Button>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
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

        {/* Help Text */}
        <p className="mt-8 text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="/support" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
