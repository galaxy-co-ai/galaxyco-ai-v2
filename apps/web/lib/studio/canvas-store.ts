import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Node, Edge, Viewport } from '@xyflow/react';
import type { GridNode, GridEdge, GridNodeType } from './types';

// ============================================================================
// Types
// ============================================================================

interface CanvasState {
  // Grid metadata
  gridId: string | null;
  gridName: string;
  gridStatus: 'draft' | 'published' | 'archived';

  // Canvas elements
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;

  // Selection state
  selectedNodes: string[];
  selectedEdges: string[];

  // History for undo/redo
  past: CanvasSnapshot[];
  future: CanvasSnapshot[];

  // UI state
  isAutoSaving: boolean;
  lastSavedAt: Date | null;
  isDirty: boolean;

  // Clipboard
  clipboard: {
    nodes: Node[];
    edges: Edge[];
  } | null;
}

interface CanvasSnapshot {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  timestamp: number;
}

interface CanvasActions {
  // Grid management
  loadGrid: (gridId: string, name: string, status: string, nodes: Node[], edges: Edge[]) => void;
  setGridName: (name: string) => void;
  setGridStatus: (status: 'draft' | 'published' | 'archived') => void;

  // Node operations
  addNode: (type: GridNodeType, position: { x: number; y: number }) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  deleteNode: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;

  // Edge operations
  addEdge: (edge: Edge) => void;
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  deleteEdge: (edgeId: string) => void;
  deleteEdges: (edgeIds: string[]) => void;

  // Selection
  selectNode: (nodeId: string, multi?: boolean) => void;
  selectNodes: (nodeIds: string[]) => void;
  selectEdge: (edgeId: string, multi?: boolean) => void;
  selectEdges: (edgeIds: string[]) => void;
  clearSelection: () => void;

  // Viewport
  setViewport: (viewport: Viewport) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Clipboard
  copy: () => void;
  paste: (position?: { x: number; y: number }) => void;

  // Save state
  markSaved: () => void;
  markDirty: () => void;

  // Reset
  reset: () => void;
}

type CanvasStore = CanvasState & CanvasActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: CanvasState = {
  gridId: null,
  gridName: 'Untitled Grid',
  gridStatus: 'draft',
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  selectedNodes: [],
  selectedEdges: [],
  past: [],
  future: [],
  isAutoSaving: false,
  lastSavedAt: null,
  isDirty: false,
  clipboard: null,
};

// ============================================================================
// Store
// ============================================================================

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Grid management
      loadGrid: (gridId, name, status, nodes, edges) => {
        set({
          gridId,
          gridName: name,
          gridStatus: status as 'draft' | 'published' | 'archived',
          nodes,
          edges,
          selectedNodes: [],
          selectedEdges: [],
          past: [],
          future: [],
          isDirty: false,
          lastSavedAt: new Date(),
        });
      },

      setGridName: (name) => {
        set({ gridName: name, isDirty: true });
      },

      setGridStatus: (status) => {
        set({ gridStatus: status, isDirty: true });
      },

      // Node operations
      addNode: (type, position) => {
        const state = get();
        const snapshot = createSnapshot(state);

        const newNode: Node = {
          id: nanoid(),
          type: 'custom', // We'll use a custom component
          position,
          data: {
            type,
            label: getDefaultLabel(type),
            config: {},
            status: 'idle',
          },
        };

        set({
          nodes: [...state.nodes, newNode],
          past: [...state.past, snapshot],
          future: [],
          isDirty: true,
        });
      },

      updateNode: (nodeId, updates) => {
        const state = get();
        const snapshot = createSnapshot(state);

        set({
          nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
          past: [...state.past, snapshot],
          future: [],
          isDirty: true,
        });
      },

      deleteNode: (nodeId) => {
        const state = get();
        const snapshot = createSnapshot(state);

        set({
          nodes: state.nodes.filter((node) => node.id !== nodeId),
          edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
          selectedNodes: state.selectedNodes.filter((id) => id !== nodeId),
          past: [...state.past, snapshot],
          future: [],
          isDirty: true,
        });
      },

      deleteNodes: (nodeIds) => {
        const state = get();
        const snapshot = createSnapshot(state);
        const nodeIdSet = new Set(nodeIds);

        set({
          nodes: state.nodes.filter((node) => !nodeIdSet.has(node.id)),
          edges: state.edges.filter(
            (edge) => !nodeIdSet.has(edge.source) && !nodeIdSet.has(edge.target),
          ),
          selectedNodes: state.selectedNodes.filter((id) => !nodeIdSet.has(id)),
          past: [...state.past, snapshot],
          future: [],
          isDirty: true,
        });
      },

      // Edge operations
      addEdge: (edge) => {
        const state = get();
        const snapshot = createSnapshot(state);

        set({
          edges: [...state.edges, { ...edge, id: edge.id || nanoid() }],
          past: [...state.past, snapshot],
          future: [],
          isDirty: true,
        });
      },

      updateEdge: (edgeId, updates) => {
        const state = get();
        const snapshot = createSnapshot(state);

        set({
          edges: state.edges.map((edge) => (edge.id === edgeId ? { ...edge, ...updates } : edge)),
          past: [...state.past, snapshot],
          future: [],
          isDirty: true,
        });
      },

      deleteEdge: (edgeId) => {
        const state = get();
        const snapshot = createSnapshot(state);

        set({
          edges: state.edges.filter((edge) => edge.id !== edgeId),
          selectedEdges: state.selectedEdges.filter((id) => id !== edgeId),
          past: [...state.past, snapshot],
          future: [],
          isDirty: true,
        });
      },

      deleteEdges: (edgeIds) => {
        const state = get();
        const snapshot = createSnapshot(state);
        const edgeIdSet = new Set(edgeIds);

        set({
          edges: state.edges.filter((edge) => !edgeIdSet.has(edge.id)),
          selectedEdges: state.selectedEdges.filter((id) => !edgeIdSet.has(id)),
          past: [...state.past, snapshot],
          future: [],
          isDirty: true,
        });
      },

      // Selection
      selectNode: (nodeId, multi = false) => {
        const state = get();
        set({
          selectedNodes: multi ? [...state.selectedNodes, nodeId] : [nodeId],
          selectedEdges: [],
        });
      },

      selectNodes: (nodeIds) => {
        set({ selectedNodes: nodeIds, selectedEdges: [] });
      },

      selectEdge: (edgeId, multi = false) => {
        const state = get();
        set({
          selectedEdges: multi ? [...state.selectedEdges, edgeId] : [edgeId],
          selectedNodes: [],
        });
      },

      selectEdges: (edgeIds) => {
        set({ selectedEdges: edgeIds, selectedNodes: [] });
      },

      clearSelection: () => {
        set({ selectedNodes: [], selectedEdges: [] });
      },

      // Viewport
      setViewport: (viewport) => {
        set({ viewport });
      },

      // History
      undo: () => {
        const state = get();
        if (state.past.length === 0) return;

        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);
        const currentSnapshot = createSnapshot(state);

        set({
          nodes: previous.nodes,
          edges: previous.edges,
          viewport: previous.viewport,
          past: newPast,
          future: [currentSnapshot, ...state.future],
          isDirty: true,
        });
      },

      redo: () => {
        const state = get();
        if (state.future.length === 0) return;

        const next = state.future[0];
        const newFuture = state.future.slice(1);
        const currentSnapshot = createSnapshot(state);

        set({
          nodes: next.nodes,
          edges: next.edges,
          viewport: next.viewport,
          past: [...state.past, currentSnapshot],
          future: newFuture,
          isDirty: true,
        });
      },

      canUndo: () => {
        return get().past.length > 0;
      },

      canRedo: () => {
        return get().future.length > 0;
      },

      // Clipboard
      copy: () => {
        const state = get();
        const selectedNodeIds = new Set(state.selectedNodes);

        const nodesToCopy = state.nodes.filter((node) => selectedNodeIds.has(node.id));

        const edgesToCopy = state.edges.filter(
          (edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target),
        );

        set({
          clipboard: {
            nodes: nodesToCopy,
            edges: edgesToCopy,
          },
        });
      },

      paste: (position) => {
        const state = get();
        if (!state.clipboard) return;

        const snapshot = createSnapshot(state);
        const idMap = new Map<string, string>();

        // Create new nodes with offset positions
        const newNodes = state.clipboard.nodes.map((node, index) => {
          const newId = nanoid();
          idMap.set(node.id, newId);

          return {
            ...node,
            id: newId,
            position: position
              ? { x: position.x + index * 20, y: position.y + index * 20 }
              : { x: node.position.x + 40, y: node.position.y + 40 },
          };
        });

        // Create new edges with updated references
        const newEdges = state.clipboard.edges.map((edge) => ({
          ...edge,
          id: nanoid(),
          source: idMap.get(edge.source) || edge.source,
          target: idMap.get(edge.target) || edge.target,
        }));

        set({
          nodes: [...state.nodes, ...newNodes],
          edges: [...state.edges, ...newEdges],
          selectedNodes: newNodes.map((n) => n.id),
          past: [...state.past, snapshot],
          future: [],
          isDirty: true,
        });
      },

      // Save state
      markSaved: () => {
        set({ isDirty: false, lastSavedAt: new Date(), isAutoSaving: false });
      },

      markDirty: () => {
        set({ isDirty: true });
      },

      // Reset
      reset: () => {
        set(initialState);
      },
    }),
    { name: 'CanvasStore' },
  ),
);

// ============================================================================
// Utilities
// ============================================================================

function createSnapshot(state: CanvasState): CanvasSnapshot {
  return {
    nodes: state.nodes,
    edges: state.edges,
    viewport: state.viewport,
    timestamp: Date.now(),
  };
}

function getDefaultLabel(type: GridNodeType): string {
  const labels: Record<GridNodeType, string> = {
    trigger: 'Trigger',
    action: 'Action',
    condition: 'Condition',
    loop: 'Loop',
    ai: 'AI',
    webhook: 'Webhook',
    delay: 'Delay',
    transform: 'Transform',
    filter: 'Filter',
    aggregate: 'Aggregate',
    branch: 'Branch',
    merge: 'Merge',
    api: 'API Call',
    database: 'Database',
    email: 'Email',
    notification: 'Notification',
    integration: 'Integration',
    custom: 'Custom',
  };

  return labels[type] || 'Node';
}

// ============================================================================
// Selectors (for performance)
// ============================================================================

export const selectNodes = (state: CanvasStore) => state.nodes;
export const selectEdges = (state: CanvasStore) => state.edges;
export const selectSelectedNodes = (state: CanvasStore) => state.selectedNodes;
export const selectSelectedEdges = (state: CanvasStore) => state.selectedEdges;
export const selectIsDirty = (state: CanvasStore) => state.isDirty;
export const selectCanUndo = (state: CanvasStore) => state.past.length > 0;
export const selectCanRedo = (state: CanvasStore) => state.future.length > 0;
