"use client";

import { PageHeader } from "@/components/layout/page-header";
import { mockUser } from "@/lib/fixtures";
import { Save } from "lucide-react";

export default function ProfileSettingsPage() {
  const user = mockUser;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information"
      />

      <div className="card p-6">
        <form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                First Name
              </label>
              <input
                type="text"
                defaultValue={user.firstName}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Last Name
              </label>
              <input
                type="text"
                defaultValue={user.lastName}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Email
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Timezone
            </label>
            <select
              defaultValue={user.preferences.timezone}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
              <option>America/Chicago</option>
              <option>Europe/London</option>
              <option>Europe/Paris</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
