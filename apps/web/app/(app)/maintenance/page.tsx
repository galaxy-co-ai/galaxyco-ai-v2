import { Metadata } from 'next';
import { Wrench, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: 'Scheduled Maintenance | GalaxyCo.ai',
  description: "We're performing scheduled maintenance",
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="h-32 w-32 rounded-full bg-warning/10 flex items-center justify-center">
            <Wrench className="h-16 w-16 text-warning" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">We&apos;ll Be Right Back</h1>
        <p className="text-lg text-foreground-muted mb-8">
          We&apos;re performing scheduled maintenance to improve your experience.
        </p>

        {/* Estimated Time */}
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-lg mb-12">
          <Clock className="h-5 w-5 text-foreground-muted" />
          <div className="text-left">
            <p className="text-sm text-foreground-muted">Estimated completion</p>
            <p className="text-base font-semibold">October 18, 2025 at 6:00 PM UTC</p>
          </div>
        </div>

        {/* Email Notification */}
        <div className="max-w-md mx-auto mb-12">
          <div className="p-6 bg-background-subtle rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Get notified when we&apos;re back</h3>
            </div>
            <p className="text-sm text-foreground-muted mb-4">
              Enter your email to receive a notification once maintenance is complete.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                className="flex-1"
                aria-label="Email address"
              />
              <Button>Notify Me</Button>
            </div>
          </div>
        </div>

        {/* What We're Improving */}
        <div className="text-left max-w-lg mx-auto">
          <h3 className="font-semibold mb-4 text-center">What we&apos;re improving</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs text-primary">✓</span>
              </div>
              <div>
                <p className="font-medium">Performance Enhancements</p>
                <p className="text-sm text-foreground-muted">
                  Faster load times and improved responsiveness
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs text-primary">✓</span>
              </div>
              <div>
                <p className="font-medium">What we&apos;re improving</p>
                <p className="text-sm text-foreground-muted">
                  Latest security patches and improvements
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs text-primary">✓</span>
              </div>
              <div>
                <p className="font-medium">Infrastructure Upgrades</p>
                <p className="text-sm text-foreground-muted">
                  Enhanced reliability and scalability
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-foreground-muted">
            Questions? Check our{' '}
            <a href="/status" className="text-primary hover:underline">
              status page
            </a>{' '}
            or{' '}
            <a href="/help/contact" className="text-primary hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
