
> web@0.1.0 typecheck
> tsc --noEmit

components/agents/TestPanel.tsx(52,58): error TS2554: Expected 2 arguments, but got 3.
components/agents/TestPanel.tsx(54,69): error TS2345: Argument of type 'string' is not assignable to parameter of type 'HeadersInit'.
components/dashboard/ProgressTracker.tsx(79,59): error TS2339: Property 'light' does not exist on type 'string'.
components/dashboard/ProgressTracker.tsx(83,68): error TS2339: Property 'DEFAULT' does not exist on type 'string'.
components/dashboard/ProgressTracker.tsx(93,61): error TS2339: Property 'DEFAULT' does not exist on type 'string'.
components/dashboard/ProgressTracker.tsx(106,56): error TS2339: Property 'dark' does not exist on type 'string'.
components/settings/ApiKeyManager.tsx(59,55): error TS18047: 'workspace' is possibly 'null'.
components/settings/ApiKeyManager.tsx(92,55): error TS18047: 'workspace' is possibly 'null'.
components/settings/ApiKeyManager.tsx(124,28): error TS18047: 'workspace' is possibly 'null'.
components/settings/ApiKeyManager.tsx(167,32): error TS2339: Property 'light' does not exist on type 'string'.
components/settings/ApiKeyManager.tsx(169,78): error TS2339: Property 'DEFAULT' does not exist on type 'string'.
components/settings/ApiKeyManager.tsx(210,32): error TS2339: Property 'light' does not exist on type 'string'.
components/settings/ApiKeyManager.tsx(212,81): error TS2339: Property 'DEFAULT' does not exist on type 'string'.
components/settings/ApiKeyManager.tsx(299,59): error TS2339: Property 'light' does not exist on type 'string'.
components/settings/ApiKeyManager.tsx(300,78): error TS2339: Property 'DEFAULT' does not exist on type 'string'.
components/settings/ApiKeyManager.tsx(303,64): error TS2339: Property 'dark' does not exist on type 'string'.
components/ui/EmptyState.tsx(60,11): error TS1117: An object literal cannot have multiple properties with the same name.
components/ui/Input.tsx(42,11): error TS2322: Type '{ sans: string; mono: string; }' is not assignable to type 'FontFamily | undefined'.
components/ui/Input.tsx(48,83): error TS2339: Property 'standard' does not exist on type '{ default: string; in: string; out: string; inOut: string; }'.
components/ui/Input.tsx(75,71): error TS2339: Property 'standard' does not exist on type '{ default: string; in: string; out: string; inOut: string; }'.
components/ui/Input.tsx(135,11): error TS2322: Type '{ sans: string; mono: string; }' is not assignable to type 'FontFamily | undefined'.
components/ui/Input.tsx(141,83): error TS2339: Property 'standard' does not exist on type '{ default: string; in: string; out: string; inOut: string; }'.
components/ui/Input.tsx(231,11): error TS2322: Type '{ sans: string; mono: string; }' is not assignable to type 'FontFamily | undefined'.
components/ui/Input.tsx(237,83): error TS2339: Property 'standard' does not exist on type '{ default: string; in: string; out: string; inOut: string; }'.
components/workspace-selector.tsx(7,11): error TS2339: Property 'workspaces' does not exist on type 'WorkspaceContextValue'.
components/workspace-selector.tsx(7,23): error TS2339: Property 'currentWorkspace' does not exist on type 'WorkspaceContextValue'.
components/workspace-selector.tsx(7,41): error TS2339: Property 'switchWorkspace' does not exist on type 'WorkspaceContextValue'.
components/workspace-selector.tsx(111,30): error TS7006: Parameter 'workspace' implicitly has an 'any' type.
hooks/use-agent-builder.ts(115,27): error TS2339: Property 'trigger' does not exist on type 'AgentTemplate'.
hooks/use-agent-builder.ts(116,30): error TS2339: Property 'aiProvider' does not exist on type 'AgentTemplate'.
hooks/use-agent-builder.ts(117,25): error TS2339: Property 'model' does not exist on type 'AgentTemplate'.
hooks/use-agent-builder.ts(118,31): error TS2339: Property 'temperature' does not exist on type 'AgentTemplate'.
hooks/use-agent-builder.ts(119,32): error TS2339: Property 'systemPrompt' does not exist on type 'AgentTemplate'.
hooks/use-agent-builder.ts(120,29): error TS2339: Property 'maxTokens' does not exist on type 'AgentTemplate'.
hooks/use-agent-builder.ts(183,24): error TS2554: Expected 3 arguments, but got 2.
hooks/use-agent-builder.ts(186,24): error TS2554: Expected 2 arguments, but got 1.
hooks/use-agent-builder.ts(254,24): error TS2554: Expected 3 arguments, but got 2.
hooks/use-agent-builder.ts(256,24): error TS2554: Expected 2 arguments, but got 1.
hooks/use-agent-list.ts(68,39): error TS2345: Argument of type 'string' is not assignable to parameter of type 'HeadersInit'.
lib/constants/design-system.ts(85,3): error TS1117: An object literal cannot have multiple properties with the same name.
lib/constants/design-system.ts(88,3): error TS1117: An object literal cannot have multiple properties with the same name.
lib/constants/design-system.ts(90,3): error TS1117: An object literal cannot have multiple properties with the same name.
../../packages/database/src/client.ts(17,27): error TS2345: Argument of type '[NeonQueryFunction<false, false>, { schema: typeof import("C:/Users/Owner/workspace/galaxyco-ai-2.0/packages/database/src/schema"); }]' is not assignable to parameter of type '[string | NeonClient] | [string | NeonClient, DrizzleConfig<typeof import("C:/Users/Owner/workspace/galaxyco-ai-2.0/packages/database/src/schema")>] | [...]'.
  Type '[NeonQueryFunction<false, false>, { schema: typeof import("C:/Users/Owner/workspace/galaxyco-ai-2.0/packages/database/src/schema"); }]' is not assignable to type '[string | NeonClient, DrizzleConfig<typeof import("C:/Users/Owner/workspace/galaxyco-ai-2.0/packages/database/src/schema")>]'.
    Type at position 0 in source is not compatible with type at position 0 in target.
      Type 'NeonQueryFunction<false, false>' is not assignable to type 'string | NeonClient'.
        Type 'NeonQueryFunction<false, false>' is missing the following properties from type 'Client': connection, _handleReadyForQuery, _handleAuthCleartextPassword, startup, and 32 more.
