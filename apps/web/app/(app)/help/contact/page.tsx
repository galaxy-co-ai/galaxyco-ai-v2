'use client';

import React, { useState } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Clock, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';

const priorityLevels = [
  { value: 'low', label: 'Low - General inquiry', responseTime: '48 hours' },
  {
    value: 'normal',
    label: 'Normal - Need assistance',
    responseTime: '24 hours',
  },
  {
    value: 'high',
    label: 'High - Issue affecting work',
    responseTime: '4 hours',
  },
  { value: 'urgent', label: 'Urgent - System down', responseTime: '1 hour' },
];

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team',
    availability: 'Mon-Fri, 9am-5pm EST',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'support@galaxyco.ai',
    availability: '24/7, response within 24h',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Enterprise customers only',
    availability: 'Mon-Fri, 9am-5pm EST',
    color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'normal',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Support ticket created successfully!', {
      description: 'We&apos;ll get back to you within 24 hours.',
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      priority: 'normal',
      message: '',
    });
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <PageShell
      title="Contact Support"
      subtitle="Get help from our support team"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Help', href: '/help' },
        { label: 'Contact' },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Submit a Support Request</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Subject and Priority */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleChange('priority', value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Response Time Info */}
              {formData.priority && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Expected Response Time:</span>
                    <span className="text-muted-foreground">
                      {priorityLevels.find((l) => l.value === formData.priority)?.responseTime ||
                        '24 hours'}
                    </span>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please describe your issue in detail..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Provide as much detail as possible to help us assist you quickly
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      name: '',
                      email: '',
                      subject: '',
                      priority: 'normal',
                      message: '',
                    })
                  }
                  disabled={isSubmitting}
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Other Ways to Reach Us</h3>
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${method.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{method.title}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                    <p className="text-xs text-muted-foreground">{method.availability}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* FAQ Link */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold mb-2">Before You Contact Us</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Check our FAQ for quick answers to common questions
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="/help/faq">View FAQ</a>
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
