# GalaxyCo Component Implementations

**Ready-to-use component code from research**

---

## 🎯 AI-Native CRM Components

### 1. LeadScoring.tsx

**Location:** `apps/web/components/galaxy/crm/LeadScoring.tsx`

**Purpose:** AI-powered lead scoring with visual indicators

```typescript
import { Card } from '@/components/ui/card'
import { Status } from '@/components/kibo/status'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { openai } from '@/lib/ai/openai'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface LeadScore {
  value: number
  reasoning: string
  signals: {
    engagement: number
    companySize: number
    behavior: number
    timing: number
  }
  trend: 'up' | 'down' | 'stable'
  nextActions: string[]
}

export function LeadScoring({ leadId }: { leadId: string }) {
  const { data: score, isLoading } = useQuery({
    queryKey: ['lead-score', leadId],
    queryFn: async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Analyze lead quality comprehensively. Return JSON with:
              - value: 0-100 score
              - reasoning: one sentence explanation
              - signals: breakdown of engagement, companySize, behavior, timing (each 0-100)
              - trend: up/down/stable based on recent activity
              - nextActions: array of 2-3 recommended actions`
          },
          {
            role: 'user',
            content: `Analyze lead ${leadId} with all available data`
          }
        ],
        response_format: { type: "json_object" }
      })
      return JSON.parse(response.choices[0].message.content) as LeadScore
    },
    refetchInterval: 60000 // Refresh every minute
  })

  if (isLoading) return <Card className="animate-pulse h-32" />

  const TrendIcon = score?.trend === 'up' ? TrendingUp :
                    score?.trend === 'down' ? TrendingDown : Minus

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold flex items-center gap-2">
            AI Lead Score
            <TrendIcon className="h-4 w-4" />
          </h3>
          <p className="text-sm text-muted-foreground">{score?.reasoning}</p>
        </div>
        <Status
          value={score?.value || 0}
          max={100}
          color={score?.value > 70 ? 'green' : score?.value > 40 ? 'yellow' : 'red'}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Object.entries(score?.signals || {}).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-xs text-muted-foreground capitalize">{key}</div>
            <div className="font-semibold">{value}%</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {score?.nextActions.map((action, i) => (
          <Badge key={i} variant="outline">{action}</Badge>
        ))}
      </div>
    </Card>
  )
}
```

---

### 2. AgentCard.tsx

**Location:** `apps/web/components/galaxy/agents/AgentCard.tsx`

**Purpose:** Beautiful agent display using Kibo UI CreditCard

```typescript
import { CreditCard } from '@/components/kibo/credit-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, Zap, Clock } from 'lucide-react'

interface AgentCardProps {
  agent: {
    id: string
    name: string
    type: string
    description: string
    executionsToday: number
    successRate: number
    lastActive: Date
    capabilities: string[]
  }
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <CreditCard
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="absolute top-0 right-0 p-4">
        <Brain className="h-8 w-8 text-white/20" />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{agent.name}</h3>
          <p className="text-white/80 text-sm mt-1">{agent.description}</p>
        </div>

        <div className="flex gap-4 text-white">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span className="text-sm">{agent.executionsToday} runs</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{agent.successRate}% success</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((cap, i) => (
            <Badge key={i} variant="secondary" className="bg-white/20 text-white border-0">
              {cap}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
            Configure
          </Button>
          <Button size="sm" className="bg-white text-violet-700 hover:bg-white/90">
            Execute Now
          </Button>
        </div>
      </div>
    </CreditCard>
  )
}
```

---

### 3. FlowBuilder.tsx

**Location:** `apps/web/components/galaxy/flows/FlowBuilder.tsx`

**Purpose:** Natural language to visual workflow converter

```typescript
'use client'

import { useState, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Editor } from '@/components/kibo/editor'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Play } from 'lucide-react'
import { openai } from '@/lib/ai/openai'

interface FlowData {
  nodes: Node[]
  edges: Edge[]
}

export function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [nlInput, setNlInput] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  const convertNLToFlow = async (description: string): Promise<FlowData> => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Convert natural language to React Flow nodes and edges.
            Return JSON with:
            - nodes: array of {id, type, position: {x, y}, data: {label, description}}
            - edges: array of {id, source, target, animated: true/false}

            Node types: 'input', 'default', 'output'
            Position nodes in a logical flow from left to right.
            Space nodes 200px apart horizontally, 100px vertically.`
        },
        {
          role: 'user',
          content: description
        }
      ],
      response_format: { type: "json_object" }
    })

    return JSON.parse(response.choices[0].message.content) as FlowData
  }

  const handleConvert = async () => {
    if (!nlInput.trim()) return

    setIsConverting(true)
    try {
      const flowData = await convertNLToFlow(nlInput)
      setNodes(flowData.nodes)
      setEdges(flowData.edges)
    } catch (error) {
      console.error('Flow conversion failed:', error)
      toast.error('Could not convert to visual flow')
    } finally {
      setIsConverting(false)
    }
  }

  const handleExecute = async () => {
    setIsExecuting(true)
    // Execute workflow logic here
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsExecuting(false)
  }

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="h-full flex flex-col">
      <Card className="m-4 p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Describe your workflow</label>
          <Editor
            content={nlInput}
            onChange={setNlInput}
            placeholder="Example: When a new lead comes in, score them with AI, then if score is above 70, send a personalized email and create a task for sales team..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleConvert}
            disabled={isConverting || !nlInput.trim()}
            className="flex items-center gap-2"
          >
            {isConverting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate Visual Flow
          </Button>

          {nodes.length > 0 && (
            <Button
              onClick={handleExecute}
              disabled={isExecuting}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Execute Flow
            </Button>
          )}
        </div>
      </Card>

      <div className="flex-1 bg-gray-50 dark:bg-gray-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
```

---

### 4. CompanionChat.tsx

**Location:** `apps/web/components/galaxy/companion/CompanionChat.tsx`

**Purpose:** AI companion interface with personality

**Implementation:** See full code in research docs

**Key Features:**

- Visual typing indicators
- Thumbs up/down feedback
- Personality-aware responses
- Smooth animations with Framer Motion

---

## 🧰 Store Implementations

### companionStore.ts

**Location:** `apps/web/stores/companionStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompanionState {
  personality: 'professional' | 'friendly' | 'mentor';
  mood: 'productive' | 'helpful' | 'learning';
  trustScore: number;
  interactions: number;
  setPersonality: (personality: CompanionState['personality']) => void;
  setMood: (mood: CompanionState['mood']) => void;
  incrementTrust: () => void;
  recordInteraction: () => void;
}

export const useCompanionStore = create<CompanionState>()(
  persist(
    (set) => ({
      personality: 'professional',
      mood: 'helpful',
      trustScore: 0,
      interactions: 0,
      setPersonality: (personality) => set({ personality }),
      setMood: (mood) => set({ mood }),
      incrementTrust: () =>
        set((state) => ({
          trustScore: Math.min(100, state.trustScore + 1),
        })),
      recordInteraction: () =>
        set((state) => ({
          interactions: state.interactions + 1,
          trustScore: Math.min(100, state.trustScore + 0.5),
        })),
    }),
    {
      name: 'galaxy-companion',
    },
  ),
);
```

---

## 📚 Library Implementations

### lib/ai/openai.ts

```typescript
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  dangerouslyAllowBrowser: false, // Use API routes only
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}
```

---

### lib/ai/claude.ts

```typescript
import Anthropic from '@anthropic-ai/sdk';

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function analyzeComplex(prompt: string): Promise<string> {
  const response = await claude.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}
```

---

## 🎯 Implementation Roadmap

**Next Session (Visual Flow Builder):**

1. **Install Dependencies**

   ```bash
   cd apps/web
   pnpm add reactflow @xyflow/react elkjs
   pnpm add framer-motion
   ```

2. **Create Components**
   - `apps/web/components/galaxy/flows/FlowBuilder.tsx`
   - `apps/web/components/galaxy/flows/FlowNodes.tsx`
   - `apps/web/lib/ai/flow-parser.ts`

3. **Wire to Page**
   - Create or update `apps/web/app/(app)/workflows/page.tsx`
   - Import FlowBuilder
   - Test natural language input

4. **Test End-to-End**
   - Input: "When new lead comes in, score with AI, send email if >70"
   - Verify: Visual grid appears
   - Execute: Test workflow runs

---

**These components are ready to implement in the monorepo structure!**

---

**Last Updated:** November 2, 2025
**Source:** Research docs synthesized for monorepo
**Version:** 1.0
