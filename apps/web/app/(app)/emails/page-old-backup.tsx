"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockEmails } from "@/lib/fixtures";
import { formatShortDate } from "@/lib/utils";
import { Mail, Check, X, Edit3 } from "lucide-react";

export default function EmailsPage() {
  const emails = mockEmails;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Review Queue"
        description="Review and approve AI-generated emails before sending"
      />

      {emails.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No emails to review"
          description="AI-generated emails will appear here for your review"
        />
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <div key={email.id} className="card p-6">
              {/* Email Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {email.subject}
                    </h3>
                    <ConfidenceBadge score={email.confidenceScore} />
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    To: {email.prospect?.email || "Unknown"}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Generated {formatShortDate(email.createdAt)}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {email.status}
                </span>
              </div>

              {/* Email Body */}
              <div className="mt-4 rounded-md border bg-neutral-50 p-4 dark:bg-neutral-900/50">
                <p className="whitespace-pre-line text-sm text-neutral-900 dark:text-neutral-100">
                  {email.body}
                </p>
              </div>

              {/* Research Insights */}
              {email.researchInsights.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Research Insights
                  </h4>
                  <div className="mt-2 space-y-2">
                    {email.researchInsights.map((insight, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 rounded-md border bg-neutral-50 p-3 dark:bg-neutral-900"
                      >
                        <ConfidenceBadge
                          score={insight.confidenceScore}
                          showLabel={false}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {insight.title}
                          </p>
                          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            {insight.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-2">
                <button className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                  <Check className="h-4 w-4" />
                  Approve & Send
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/10">
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
