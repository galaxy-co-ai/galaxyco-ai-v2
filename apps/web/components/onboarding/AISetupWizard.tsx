'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sparkles,
  Check,
  Loader2,
  MessageSquare,
  Building2,
  Users,
  Zap,
  Database,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Building2;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface AISetupWizardProps {
  open: boolean;
  onClose: () => void;
}

export function AISetupWizard({ open, onClose }: AISetupWizardProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [setupData, setSetupData] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Getting to know you',
      icon: MessageSquare,
      status: 'in-progress',
    },
    {
      id: 'workspace',
      title: 'Workspace',
      description: 'Setting up your workspace',
      icon: Building2,
      status: 'pending',
    },
    {
      id: 'agents',
      title: 'AI Agents',
      description: 'Configuring intelligent agents',
      icon: Sparkles,
      status: 'pending',
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connecting your tools',
      icon: Zap,
      status: 'pending',
    },
    {
      id: 'data',
      title: 'Sample Data',
      description: 'Preparing demo content',
      icon: Database,
      status: 'pending',
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Finalizing settings',
      icon: Settings,
      status: 'pending',
    },
  ]);

  useEffect(() => {
    if (open && messages.length === 0) {
      initializeWizard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeWizard = () => {
    addAssistantMessage(
      `Welcome to GalaxyCo.ai! 🚀

I'm your AI setup assistant, and I'll help you create a fully-configured workspace tailored to your needs.

Let's start with a few questions to understand how you'll use the platform.

**What's your role?** (e.g., Founder, Sales Manager, Support Lead, Operations Manager)`,
    );
  };

  const addAssistantMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const updateStepStatus = (stepId: string, status: SetupStep['status']) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status } : step)));
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;

    const message = userInput.trim();
    setUserInput('');
    addUserMessage(message);
    setIsProcessing(true);

    try {
      // Call AI to process the message and determine next step
      const response = await fetch('/api/onboarding/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          currentStep: steps[currentStepIndex].id,
          setupData,
        }),
      });

      const data = await response.json();

      // Update setup data
      if (data.updates) {
        setSetupData((prev) => ({ ...prev, ...data.updates }));
      }

      // Add AI response
      if (data.response) {
        addAssistantMessage(data.response);
      }

      // Progress to next step if needed
      if (data.shouldProgress) {
        await progressToNextStep();
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addAssistantMessage("I apologize, but I encountered an error. Let's try that again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const progressToNextStep = async () => {
    const currentStep = steps[currentStepIndex];
    updateStepStatus(currentStep.id, 'completed');

    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      updateStepStatus(steps[nextIndex].id, 'in-progress');

      // Execute step-specific setup
      await executeStep(steps[nextIndex].id);
    } else {
      // All steps complete
      await finalizeSetup();
    }
  };

  const executeStep = async (stepId: string) => {
    switch (stepId) {
      case 'workspace':
        addAssistantMessage(
          `Great! Now let's create your workspace.

**What would you like to name your workspace?** (e.g., "Acme Corp", "My Agency", "Smith Consulting")`,
        );
        break;

      case 'agents':
        addAssistantMessage("Perfect! I'm now configuring AI agents based on your role...");
        // Create agents based on setupData.role
        await provisionAgents();
        break;

      case 'integrations':
        addAssistantMessage(
          `Excellent! Let's connect your tools.

**Which tools do you currently use?** (Select all that apply, or type "skip")

• Gmail / Email
• Slack
• HubSpot / Salesforce
• Google Drive / Notion
• Calendar apps
• Other tools`,
        );
        break;

      case 'data':
        addAssistantMessage('Setting up sample data so you can start testing immediately...');
        await provisionSampleData();
        break;

      case 'preferences':
        addAssistantMessage(
          `Almost done! A few quick preferences:

**Do you handle sensitive or regulated data?**
• Yes - Enable enhanced security
• No - Standard security is fine`,
        );
        break;
    }
  };

  const provisionAgents = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/onboarding/provision-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData),
      });

      const data = await response.json();

      if (data.success) {
        addAssistantMessage(
          `✓ Created ${data.agents.length} AI agents:
${data.agents.map((a: any) => `  • **${a.name}** - ${a.description}`).join('\n')}

These agents are now active and ready to work for you!`,
        );
        await progressToNextStep();
      }
    } catch (error) {
      updateStepStatus('agents', 'error');
      addAssistantMessage("There was an issue creating agents. Let's continue anyway.");
    } finally {
      setIsProcessing(false);
    }
  };

  const provisionSampleData = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/onboarding/provision-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData),
      });

      const data = await response.json();

      if (data.success) {
        addAssistantMessage(
          `✓ Added sample data:
  • ${data.stats.tasks || 0} tasks
  • ${data.stats.events || 0} calendar events
  • ${data.stats.contacts || 0} sample contacts

You can explore these to see how the platform works!`,
        );
        await progressToNextStep();
      }
    } catch (error) {
      updateStepStatus('data', 'error');
      addAssistantMessage('Skipping sample data for now.');
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeSetup = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/onboarding/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData),
      });

      const data = await response.json();

      if (data.success) {
        addAssistantMessage(
          `🎉 **Your workspace is ready!**

Everything is configured and working. Here's what I've set up:

✓ Workspace created with ${data.summary.agentCount} AI agents
✓ Sample data loaded for immediate testing
✓ Integrations configured
✓ Security settings applied

**You're all set to start using GalaxyCo.ai!**

Click "Launch Platform" below to begin.`,
        );

        // Mark last step complete
        updateStepStatus(steps[steps.length - 1].id, 'completed');
      }
    } catch (error) {
      addAssistantMessage('Setup encountered an error, but your workspace is accessible.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    router.refresh();
    onClose();
  };

  const allStepsComplete = steps.every((s) => s.status === 'completed');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="w-6 h-6 text-primary" />
                AI Setup Wizard
              </DialogTitle>
              <DialogDescription className="mt-1">
                Let&apos;s get your platform ready in minutes
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Progress Sidebar */}
          <div className="w-72 border-r bg-muted/30 p-6 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">SETUP PROGRESS</h3>
            <div className="space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card
                    key={step.id}
                    className={cn(
                      'p-3 transition-all',
                      step.status === 'in-progress' && 'border-primary bg-primary/5',
                      step.status === 'completed' && 'bg-success/10 border-success/30',
                      step.status === 'pending' && 'opacity-60',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          step.status === 'completed' && 'bg-success text-white',
                          step.status === 'in-progress' && 'bg-primary text-white',
                          step.status === 'pending' && 'bg-muted text-muted-foreground',
                          step.status === 'error' && 'bg-destructive text-white',
                        )}
                      >
                        {step.status === 'completed' ? (
                          <Check className="w-4 h-4" />
                        ) : step.status === 'in-progress' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn('flex gap-3', message.role === 'user' && 'flex-row-reverse')}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      message.role === 'assistant'
                        ? 'bg-primary text-white'
                        : 'bg-muted text-foreground',
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={cn('flex-1 max-w-[80%]', message.role === 'user' && 'text-right')}
                  >
                    <div
                      className={cn(
                        'inline-block px-4 py-3 rounded-lg',
                        message.role === 'assistant'
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-white',
                      )}
                    >
                      <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc ml-4 mb-2" {...props} />
                            ),
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
              {allStepsComplete ? (
                <Button onClick={handleComplete} className="w-full" size="lg">
                  <Check className="w-4 h-4 mr-2" />
                  Launch Platform
                </Button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your response..."
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!userInput.trim() || isProcessing}
                    size="lg"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
