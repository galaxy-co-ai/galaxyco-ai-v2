/**
 * GalaxyCo.ai Sign Up Page
 * Clerk authentication sign up
 * October 15, 2025
 */

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Start using GalaxyCo.ai
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Create your account and get started in minutes
          </p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
