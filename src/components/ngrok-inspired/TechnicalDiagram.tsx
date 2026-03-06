import { useEffect, useState } from 'react';
import { Globe, Database, Zap, Shield, Server } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  sublabel?: string;
  icon: any;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  label?: string;
  color?: string;
  animated?: boolean;
}

interface TechnicalDiagramProps {
  title?: string;
  nodes: Node[];
  connections: Connection[];
  className?: string;
}

export function TechnicalDiagram({
  title = "Architecture du système",
  nodes,
  connections,
  className = "",
}: TechnicalDiagramProps) {
  const [animatedPaths, setAnimatedPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    const animated = new Set(
      connections.filter((c) => c.animated).map((c) => `${c.from}-${c.to}`)
    );
    setAnimatedPaths(animated);
  }, [connections]);

  return (
    <div className={`relative py-12 ${className}`}>
      {/* Title */}
      {title && (
        <p className="text-cyan-400 text-xs sm:text-sm font-mono uppercase tracking-wider mb-8 text-center">
          {title}
        </p>
      )}

      {/* Diagram Container */}
      <div className="relative w-full" style={{ minHeight: '400px' }}>
        <svg className="absolute inset-0 w-full h-full" style={{ minHeight: '400px' }}>
          <defs>
            {/* Gradient definitions for connections */}
            <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            
            <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Connections */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            
            if (!fromNode || !toNode) return null;

            const isAnimated = animatedPaths.has(`${conn.from}-${conn.to}`);
            const gradientId = conn.color || 'cyan-gradient';

            return (
              <g key={idx}>
                {/* Connection line */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={`url(#${gradientId})`}
                  strokeWidth="2"
                  strokeDasharray={isAnimated ? "5,5" : "0"}
                  className="transition-all duration-500"
                >
                  {isAnimated && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="10"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>

                {/* Connection label */}
                {conn.label && (
                  <text
                    x={`${(fromNode.x + toNode.x) / 2}%`}
                    y={`${(fromNode.y + toNode.y) / 2 - 2}%`}
                    fill="#64748b"
                    fontSize="12"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
          >
            <div className="flex flex-col items-center group">
              {/* Node circle */}
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-lg 
                                animate-pulse-slow" />
                
                {/* Main node */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full 
                                bg-gray-900 border-2 border-cyan-500
                                flex items-center justify-center
                                shadow-[0_0_30px_rgba(6,182,212,0.5)]
                                transition-all duration-300
                                group-hover:scale-110 group-hover:border-cyan-400">
                  <node.icon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                </div>

                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500
                                animate-ping opacity-20" />
              </div>

              {/* Label */}
              <div className="mt-3 text-center">
                <p className="text-white text-sm font-medium whitespace-nowrap">
                  {node.label}
                </p>
                {node.sublabel && (
                  <p className="text-gray-400 text-xs mt-1 whitespace-nowrap">
                    {node.sublabel}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example usage component
export function ExampleDiagram() {
  const nodes: Node[] = [
    { id: 'internet', label: 'Internet', icon: Globe, x: 15, y: 50 },
    { id: 'nexus', label: 'Nexus 2030', sublabel: 'Cloud Service', icon: Zap, x: 50, y: 50 },
    { id: 'api', label: 'API Service', icon: Server, x: 85, y: 30 },
    { id: 'database', label: 'Database', icon: Database, x: 85, y: 70 },
  ];

  const connections: Connection[] = [
    { from: 'internet', to: 'nexus', animated: true, color: 'cyan-gradient' },
    { from: 'nexus', to: 'api', label: 'HTTPS', color: 'green-gradient' },
    { from: 'nexus', to: 'database', label: 'Secure', color: 'green-gradient' },
  ];

  return (
    <TechnicalDiagram
      title="Figure 1 - Architecture réseau"
      nodes={nodes}
      connections={connections}
    />
  );
}
