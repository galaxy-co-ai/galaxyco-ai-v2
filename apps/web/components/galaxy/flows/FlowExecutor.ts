/**
 * Flow Executor - Execute visual workflows
 *
 * Orchestrates workflow execution by running nodes in sequence,
 * handling conditions, and managing integrations.
 */

import { FlowNode, FlowEdge } from './FlowParser';

export interface ExecutionContext {
  workspaceId: string;
  userId: string;
  variables: Record<string, any>;
  results: Record<string, any>;
}

export interface ExecutionResult {
  success: boolean;
  executedNodes: string[];
  results: Record<string, any>;
  errors?: Array<{
    nodeId: string;
    error: string;
  }>;
  duration: number;
}

/**
 * Execute a workflow
 */
export async function executeWorkflow(
  nodes: FlowNode[],
  edges: FlowEdge[],
  context: ExecutionContext,
): Promise<ExecutionResult> {
  const startTime = Date.now();
  const executedNodes: string[] = [];
  const results: Record<string, any> = {};
  const errors: Array<{ nodeId: string; error: string }> = [];

  try {
    // Find the start node
    const startNode = nodes.find((n) => n.type === 'start');
    if (!startNode) {
      throw new Error('No start node found');
    }

    // Execute nodes in order
    await executeNode(startNode, nodes, edges, context, executedNodes, results, errors);

    const duration = Date.now() - startTime;

    return {
      success: errors.length === 0,
      executedNodes,
      results: { ...context.results, ...results },
      errors: errors.length > 0 ? errors : undefined,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      success: false,
      executedNodes,
      results,
      errors: [
        {
          nodeId: 'workflow',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
      duration,
    };
  }
}

/**
 * Execute a single node and its downstream nodes
 */
async function executeNode(
  node: FlowNode,
  allNodes: FlowNode[],
  allEdges: FlowEdge[],
  context: ExecutionContext,
  executedNodes: string[],
  results: Record<string, any>,
  errors: Array<{ nodeId: string; error: string }>,
): Promise<void> {
  // Skip if already executed (avoid infinite loops)
  if (executedNodes.includes(node.id)) {
    return;
  }

  // Mark as executed
  executedNodes.push(node.id);

  try {
    // Execute the node based on type
    const result = await executeNodeAction(node, context, results);
    results[node.id] = result;

    // If this is the end node, we're done
    if (node.type === 'end') {
      return;
    }

    // Find outgoing edges
    const outgoingEdges = allEdges.filter((e) => e.source === node.id);

    // Execute downstream nodes
    for (const edge of outgoingEdges) {
      const nextNode = allNodes.find((n) => n.id === edge.target);
      if (nextNode) {
        // For condition nodes, evaluate the condition
        if (node.type === 'condition' && edge.condition) {
          const conditionMet = evaluateCondition(edge.condition, results);
          if (!conditionMet) {
            continue; // Skip this branch
          }
        }

        await executeNode(nextNode, allNodes, allEdges, context, executedNodes, results, errors);
      }
    }
  } catch (error) {
    errors.push({
      nodeId: node.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Execute a single node's action
 */
async function executeNodeAction(
  node: FlowNode,
  context: ExecutionContext,
  results: Record<string, any>,
): Promise<any> {
  switch (node.type) {
    case 'start':
      return { started: true, timestamp: new Date().toISOString() };

    case 'action':
      return await executeAction(node, context, results);

    case 'condition':
      return await evaluateConditionNode(node, context, results);

    case 'integration':
      return await executeIntegration(node, context, results);

    case 'end':
      return { completed: true, timestamp: new Date().toISOString() };

    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

/**
 * Execute an action node
 */
async function executeAction(
  node: FlowNode,
  context: ExecutionContext,
  results: Record<string, any>,
): Promise<any> {
  // Call the backend API to execute the action
  const response = await fetch('/api/workflows/execute-action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nodeId: node.id,
      action: node.label,
      config: node.config,
      workspaceId: context.workspaceId,
      variables: context.variables,
      previousResults: results,
    }),
  });

  if (!response.ok) {
    throw new Error(`Action failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Evaluate a condition node
 */
async function evaluateConditionNode(
  node: FlowNode,
  context: ExecutionContext,
  results: Record<string, any>,
): Promise<any> {
  // For now, return the condition evaluation result
  return {
    condition: node.label,
    evaluated: true,
  };
}

/**
 * Execute an integration node
 */
async function executeIntegration(
  node: FlowNode,
  context: ExecutionContext,
  results: Record<string, any>,
): Promise<any> {
  // Call the backend API to execute the integration
  const response = await fetch('/api/workflows/execute-integration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nodeId: node.id,
      integration: node.integration,
      config: node.config,
      workspaceId: context.workspaceId,
      variables: context.variables,
      previousResults: results,
    }),
  });

  if (!response.ok) {
    throw new Error(`Integration failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Evaluate a condition
 */
function evaluateCondition(condition: string, results: Record<string, any>): boolean {
  // Simple condition evaluation
  // In a real implementation, this would parse and evaluate the condition string
  // For now, return true to continue execution
  return true;
}

/**
 * Stream workflow execution with real-time updates
 */
export async function* streamWorkflowExecution(
  nodes: FlowNode[],
  edges: FlowEdge[],
  context: ExecutionContext,
): AsyncGenerator<{
  type: 'node_start' | 'node_complete' | 'node_error' | 'complete' | 'error';
  nodeId?: string;
  result?: any;
  error?: string;
}> {
  const startNode = nodes.find((n) => n.type === 'start');
  if (!startNode) {
    yield { type: 'error', error: 'No start node found' };
    return;
  }

  const executedNodes: string[] = [];
  const results: Record<string, any> = {};

  try {
    // Execute nodes with streaming updates
    yield* streamNodeExecution(startNode, nodes, edges, context, executedNodes, results);
    yield { type: 'complete' };
  } catch (error) {
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Stream execution of a single node
 */
async function* streamNodeExecution(
  node: FlowNode,
  allNodes: FlowNode[],
  allEdges: FlowEdge[],
  context: ExecutionContext,
  executedNodes: string[],
  results: Record<string, any>,
): AsyncGenerator<{
  type: 'node_start' | 'node_complete' | 'node_error';
  nodeId: string;
  result?: any;
  error?: string;
}> {
  if (executedNodes.includes(node.id)) {
    return;
  }

  executedNodes.push(node.id);

  yield { type: 'node_start', nodeId: node.id };

  try {
    const result = await executeNodeAction(node, context, results);
    results[node.id] = result;

    yield { type: 'node_complete', nodeId: node.id, result };

    if (node.type === 'end') {
      return;
    }

    const outgoingEdges = allEdges.filter((e) => e.source === node.id);

    for (const edge of outgoingEdges) {
      const nextNode = allNodes.find((n) => n.id === edge.target);
      if (nextNode) {
        yield* streamNodeExecution(nextNode, allNodes, allEdges, context, executedNodes, results);
      }
    }
  } catch (error) {
    yield {
      type: 'node_error',
      nodeId: node.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
