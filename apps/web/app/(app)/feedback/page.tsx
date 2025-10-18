"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Lightbulb, Bug, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const feedbackTypes = [
  { value: "feature", label: "Feature Request", icon: Lightbulb },
  { value: "bug", label: "Bug Report", icon: Bug },
  { value: "improvement", label: "Improvement", icon: Zap },
  { value: "other", label: "Other", icon: MessageSquare },
];

const existingFeedback = [
  {
    id: 1,
    title: "Bulk agent operations",
    description: "Ability to activate/deactivate multiple agents at once",
    type: "feature",
    status: "planned",
    votes: 47,
    comments: 12,
    userVoted: false,
  },
  {
    id: 2,
    title: "Agent performance metrics dashboard",
    description: "Dedicated dashboard showing agent execution analytics",
    type: "feature",
    status: "in-progress",
    votes: 38,
    comments: 8,
    userVoted: true,
  },
  {
    id: 3,
    title: "Export workflow as JSON",
    description: "Allow exporting agent workflows for backup and sharing",
    type: "feature",
    status: "under-review",
    votes: 29,
    comments: 5,
    userVoted: false,
  },
  {
    id: 4,
    title: "Slack integration improvements",
    description: "Better notification customization for Slack integration",
    type: "improvement",
    status: "shipped",
    votes: 52,
    comments: 15,
    userVoted: true,
  },
];

const statusConfig = {
  "under-review": {
    label: "Under Review",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  planned: {
    label: "Planned",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  "in-progress": {
    label: "In Progress",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  shipped: {
    label: "Shipped",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
};

export default function FeedbackPage() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "feature",
    title: "",
    description: "",
  });
  const [userVotes, setUserVotes] = useState<Record<number, boolean>>({
    2: true,
    4: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Feedback submitted successfully!", {
      description: "Thank you for helping us improve GalaxyCo.ai",
    });

    setFormData({ type: "feature", title: "", description: "" });
    setShowForm(false);
    setIsSubmitting(false);
  };

  const handleVote = (id: number) => {
    setUserVotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    toast.success(userVotes[id] ? "Vote removed" : "Vote added");
  };

  return (
    <PageShell
      title="Feedback Portal"
      subtitle="Share your ideas and vote on features"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Feedback" }]}
    >
      <div className="space-y-6">
        {/* Submit Feedback Button */}
        {!showForm && (
          <div className="flex justify-end">
            <Button onClick={() => setShowForm(true)}>
              <Lightbulb className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </div>
        )}

        {/* Feedback Submission Form */}
        {showForm && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Submit Your Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Feedback Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief, descriptive title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about your feedback..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Feedback List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Requests</h2>
          <div className="space-y-3">
            {existingFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Vote Button */}
                  <button
                    onClick={() => handleVote(feedback.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-colors min-w-[60px]",
                      userVotes[feedback.id]
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50",
                    )}
                    aria-label={
                      userVotes[feedback.id]
                        ? "Remove vote"
                        : "Vote for this feature"
                    }
                  >
                    <ThumbsUp
                      className={cn(
                        "h-5 w-5",
                        userVotes[feedback.id] && "fill-current",
                      )}
                    />
                    <span className="text-sm font-semibold">
                      {feedback.votes +
                        (userVotes[feedback.id] && !feedback.userVoted
                          ? 1
                          : 0) +
                        (feedback.userVoted && !userVotes[feedback.id]
                          ? -1
                          : 0)}
                    </span>
                  </button>

                  {/* Feedback Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold">{feedback.title}</h3>
                      <Badge
                        variant="secondary"
                        className={
                          statusConfig[
                            feedback.status as keyof typeof statusConfig
                          ].className
                        }
                      >
                        {
                          statusConfig[
                            feedback.status as keyof typeof statusConfig
                          ].label
                        }
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {feedback.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{feedback.comments} comments</span>
                      </div>
                      <span>•</span>
                      <span className="capitalize">{feedback.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
