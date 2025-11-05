import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Mail,
  Calendar,
  FileText,
  Database,
  Zap,
  Sparkles,
  Filter,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Save,
  ZoomIn,
  ZoomOut,
  Edit3,
  Plug,
  MessageSquare,
  Trash2,
} from 'lucide-react';

interface NodeType {
  id: number;
  type: string;
  icon: any;
  label: string;
  gradient: string;
  shadow: string;
  position: { x: number; y: number };
}

// Initial node data - AI Assistant as central hub with organized workflow branches
const initialNodes: NodeType[] = [
  // Top-left branch: Document input
  {
    id: 1,
    type: 'trigger',
    icon: Sparkles,
    label: 'AI Assistant',
    gradient: 'from-blue-400 to-blue-600',
    shadow: 'shadow-blue-500/50',
    position: { x: 100, y: 100 },
  },
  {
    id: 2,
    type: 'action',
    icon: FileText,
    label: 'Document',
    gradient: 'from-green-400 to-green-600',
    shadow: 'shadow-green-500/50',
    position: { x: 300, y: 100 },
  },
  
  // Central Hub: Main AI Assistant
  {
    id: 3,
    type: 'ai-assistant',
    icon: Sparkles,
    label: 'AI Assistant',
    gradient: 'from-purple-500 to-purple-700',
    shadow: 'shadow-purple-500/50',
    position: { x: 300, y: 250 }, // Center position
  },
  
  // Branch 1: Email automation (top-right)
  {
    id: 4,
    type: 'integration',
    icon: Mail,
    label: 'Email',
    gradient: 'from-blue-400 to-blue-600',
    shadow: 'shadow-blue-500/50',
    position: { x: 500, y: 150 },
  },
  {
    id: 5,
    type: 'ai-assistant',
    icon: Sparkles,
    label: 'AI Assistant',
    gradient: 'from-pink-400 to-pink-600',
    shadow: 'shadow-pink-500/50',
    position: { x: 700, y: 150 },
  },
  {
    id: 6,
    type: 'integration',
    icon: Database,
    label: 'Database',
    gradient: 'from-pink-400 to-pink-600',
    shadow: 'shadow-pink-500/50',
    position: { x: 900, y: 150 },
  },
  
  // Branch 2: Document processing (bottom)
  {
    id: 7,
    type: 'action',
    icon: FileText,
    label: 'Document',
    gradient: 'from-red-400 to-red-600',
    shadow: 'shadow-red-500/50',
    position: { x: 500, y: 350 },
  },
  {
    id: 8,
    type: 'action',
    icon: MessageSquare,
    label: 'Message',
    gradient: 'from-orange-400 to-orange-600',
    shadow: 'shadow-orange-500/50',
    position: { x: 700, y: 350 },
  },
  {
    id: 9,
    type: 'action',
    icon: FileText,
    label: 'Document',
    gradient: 'from-red-400 to-red-600',
    shadow: 'shadow-red-500/50',
    position: { x: 900, y: 350 },
  },
  {
    id: 10,
    type: 'integration',
    icon: Mail,
    label: 'Email',
    gradient: 'from-orange-400 to-orange-600',
    shadow: 'shadow-orange-500/50',
    position: { x: 1100, y: 350 },
  },
];

// Define connections - AI Assistant (id: 3) as central hub
const connections: { from: number; to: number }[] = [
  // Top input branch
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  
  // Branch 1: Email automation (from central hub)
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  
  // Branch 2: Document processing (from central hub)
  { from: 3, to: 7 },
  { from: 7, to: 8 },
  { from: 8, to: 9 },
  { from: 9, to: 10 },
];

export function VisualGridBuilder() {
  const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<number | null>(3); // Start with central AI Assistant hub selected
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate bounding box of all nodes and adjust zoom
  useEffect(() => {
    if (nodes.length === 0 || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const padding = 100; // Padding around nodes
    const nodeSize = 80; // Size of each node

    // Find bounding box
    const minX = Math.min(...nodes.map((n) => n.position.x));
    const minY = Math.min(...nodes.map((n) => n.position.y));
    const maxX = Math.max(...nodes.map((n) => n.position.x + nodeSize));
    const maxY = Math.max(...nodes.map((n) => n.position.y + nodeSize));

    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;

    // Calculate zoom to fit
    const zoomX = (containerRect.width - 100) / contentWidth;
    const zoomY = (containerRect.height - 100) / contentHeight;
    const newZoom = Math.min(Math.max(Math.min(zoomX, zoomY), 0.3), 1.5);

    // Calculate pan to center
    const newPanX = containerRect.width / 2 / newZoom - (minX + maxX) / 2 - 40;
    const newPanY = containerRect.height / 2 / newZoom - (minY + maxY) / 2 - 40;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  }, [nodes]);

  const handleMouseDown = (nodeId: number, e: React.MouseEvent) => {
    e.preventDefault();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Select the node
    setSelectedNode(nodeId);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    });
    setDraggedNode(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode === null || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = (e.clientX - containerRect.left) / zoom - dragOffset.x - pan.x;
    const newY = (e.clientY - containerRect.top) / zoom - dragOffset.y - pan.y;

    setNodes((prev) =>
      prev.map((node) =>
        node.id === draggedNode ? { ...node, position: { x: newX, y: newY } } : node,
      ),
    );
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  return (
    <Card className="h-full p-6 flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3>Visual Workflow</h3>
            <p className="text-sm text-muted-foreground">
              Your agent will be built as you describe it
            </p>
          </div>
          <Badge variant="outline" className="bg-muted">
            <Zap className="h-3 w-3 mr-1" />
            Auto-building
          </Badge>
        </div>
      </div>

      {/* Grid Builder Area */}
      <div
        ref={containerRef}
        className="flex-1 rounded-lg border border-border overflow-hidden relative cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Dot Grid Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle, hsl(var(--muted-foreground)) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95" />

        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 shadow-lg mx-auto">
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground">
                  Start describing your agent to see the workflow build automatically
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full p-8">
            {/* Zoomable/Pannable Container */}
            <div
              style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: '0 0',
                transition: draggedNode === null ? 'transform 0.3s ease-out' : 'none',
                width: '100%',
                height: '100%',
              }}
            >
              {/* SVG Layer for Connections */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  zIndex: 1,
                  left: '-2000px',
                  top: '-2000px',
                  width: '8000px',
                  height: '8000px',
                }}
                viewBox="-2000 -2000 8000 8000"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Draw connection paths */}
                {connections.map((conn, idx) => {
                  const fromNode = nodes.find((n) => n.id === conn.from);
                  const toNode = nodes.find((n) => n.id === conn.to);
                  if (!fromNode || !toNode) return null;

                  const fromX = fromNode.position.x + 40; // Center of 80px node
                  const fromY = fromNode.position.y + 40;
                  const toX = toNode.position.x + 40;
                  const toY = toNode.position.y + 40;

                  return (
                    <g key={idx}>
                      {/* Main path - light and permanent */}
                      <line
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        stroke="#6366f1"
                        strokeWidth="2"
                        opacity="0.4"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Nodes Layer */}
              <div className="relative w-full h-full" style={{ zIndex: 2 }}>
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: `${node.position.x}px`,
                      top: `${node.position.y}px`,
                    }}
                  >
                    <div
                      className="group cursor-grab active:cursor-grabbing"
                      onMouseDown={(e) => handleMouseDown(node.id, e)}
                    >
                      <div className="relative">
                        {/* Node Label */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-background border border-border rounded-lg px-3 py-1.5 shadow-lg">
                            <p className="text-xs">{node.label}</p>
                          </div>
                        </div>

                        {/* Clean Button */}
                        <div
                          className={`
                            relative w-20 h-20 rounded-2xl bg-gradient-to-br ${node.gradient}
                            transform transition-all duration-200
                            hover:scale-105
                            flex items-center justify-center
                            before:absolute before:inset-0 before:rounded-2xl 
                            before:bg-gradient-to-b before:from-white/10 before:to-transparent
                            ${draggedNode === node.id ? 'scale-105 cursor-grabbing shadow-2xl' : ''}
                            ${selectedNode === node.id ? 'shadow-xl' : 'shadow-md'}
                          `}
                          style={{
                            filter:
                              selectedNode === node.id
                                ? 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))'
                                : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                          }}
                        >
                          <node.icon className="h-8 w-8 text-white relative z-10 drop-shadow pointer-events-none" />
                        </div>

                        {/* Subtle Bottom Shadow */}
                        <div
                          className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-14 h-2 bg-gradient-to-br ${node.gradient} opacity-15 blur-sm rounded-full pointer-events-none`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Toolbar - Bottom */}
        {nodes.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-background/80 backdrop-blur-lg border border-border rounded-full shadow-lg px-3 py-2 flex items-center gap-1">
              {/* Playback Controls */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-accent"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-full py-1 px-3">Run Workflow</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-accent"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-full py-1 px-3">Pause Workflow</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-accent"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-full py-1 px-3">Reset Workflow</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6 mx-1" />

              {/* Add Node */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-accent"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-full py-1 px-3">Add Node</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6 mx-1" />

              {/* Zoom Controls */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-accent"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-full py-1 px-3">Zoom Out</TooltipContent>
              </Tooltip>

              <div className="px-2 text-xs text-muted-foreground min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-accent"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-full py-1 px-3">Zoom In</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6 mx-1" />

              {/* Save */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-accent"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-full py-1 px-3">Save Workflow</TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Floating Toolbar - Right Edge (Node Editor) */}
        {selectedNode && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
            <div className="bg-background/80 backdrop-blur-lg border border-border rounded-full shadow-lg py-3 px-2 flex flex-col items-center gap-1">
              {/* Edit Node Details */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-accent"
                  >
                    <Edit3 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="rounded-full py-1 px-3">
                  Edit Node
                </TooltipContent>
              </Tooltip>

              <Separator orientation="horizontal" className="w-6 my-1" />

              {/* Integration Sign-in */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-accent"
                  >
                    <Plug className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="rounded-full py-1 px-3">
                  Connect Integration
                </TooltipContent>
              </Tooltip>

              <Separator orientation="horizontal" className="w-6 my-1" />

              {/* AI Assistant for Node */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-accent bg-gradient-to-br from-purple-500/20 to-purple-700/20"
                  >
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="rounded-full py-1 px-3">
                  Train with AI
                </TooltipContent>
              </Tooltip>

              <Separator orientation="horizontal" className="w-6 my-1" />

              {/* Delete Node */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="rounded-full py-1 px-3">
                  Delete Node
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
