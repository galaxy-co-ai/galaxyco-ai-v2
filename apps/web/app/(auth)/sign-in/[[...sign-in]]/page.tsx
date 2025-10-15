/**
 * GalaxyCo.ai Sign In Page
 * Clerk authentication sign in
 * October 15, 2025
 */

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Welcome back to GalaxyCo.ai
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Sign in to access your AI agents
          </p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
}