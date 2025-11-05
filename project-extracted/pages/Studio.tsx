import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { WorkflowVisualizer } from "../components/WorkflowVisualizer";
import { VisualGridBuilder } from "../components/VisualGridBuilder";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { ScrollArea } from "../components/ui/scroll-area";
import { MessageSquare, Workflow, Send } from "lucide-react";

export function Studio() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="assistant" className="w-full">
        <div className="text-center space-y-4">
          <div>
            <h1>Studio</h1>
            <p className="text-muted-foreground">
              Create and manage your AI agents using workflows or conversational AI
            </p>
          </div>
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="assistant">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="workflow">
                <Workflow className="h-4 w-4 mr-2" />
                Workflow Builder
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="workflow" className="space-y-4 mt-6">
          <div>
            <h2>Workflow Builder</h2>
            <p className="text-sm text-muted-foreground">
              Visually design your agent workflows and connections
            </p>
          </div>
          <WorkflowVisualizer />
        </TabsContent>

        <TabsContent value="assistant" className="mt-6">
          <div className="grid grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
            {/* Chat Panel - Left 1/3 */}
            <Card className="col-span-1 flex flex-col">
              <div className="border-b border-border p-4">
                <h3>Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Describe what you want
                </p>
              </div>
              
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                      AI
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        Hi! I'm your AI assistant. Tell me what kind of agent you'd like to create, and I'll help you build it step by step. I can help with:
                      </p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                        <li>Email automation and triage</li>
                        <li>CRM data management</li>
                        <li>Document processing</li>
                        <li>Meeting transcription and notes</li>
                        <li>Custom workflows</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-border p-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="I want an agent that monitors my inbox for invoice emails, extracts the important details, and adds them to my accounting software..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setMessage("")}>
                      Clear
                    </Button>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Visual Grid Builder - Right 2/3 */}
            <div className="col-span-2">
              <VisualGridBuilder />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
