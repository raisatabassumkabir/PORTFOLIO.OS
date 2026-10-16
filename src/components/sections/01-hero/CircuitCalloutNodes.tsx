'use client';

import React from 'react';
import { CircuitCallout } from '@/types/portfolio';
import { useHudStore } from '@/store/useHudStore';

interface CircuitCalloutNodesProps {
  nodes: CircuitCallout[];
  isLocked: boolean;
  nodeIsLit: boolean[];
  nodeProximities?: number[];
  onHoverNode: (id: string | null) => void;
  onCardRef?: (index: number, el: HTMLDivElement | null) => void;
}

export function CircuitCalloutNodes({
  nodes,
  isLocked,
  nodeIsLit,
  nodeProximities,
  onHoverNode,
  onCardRef,
}: CircuitCalloutNodesProps) {
  const setCursorVariant = useHudStore((s) => s.setCursorVariant);

  return (
    <div className="flex flex-col gap-5 select-none pointer-events-auto">
      {nodes.map((node, index) => {
        const proximity = nodeProximities
          ? nodeProximities[index]
          : isLocked
          ? 1
          : nodeIsLit[index]
          ? 1
          : 0.12;
        const isLit = isLocked || (nodeIsLit[index] ?? false) || proximity > 0.4;

        return (
          <div
            key={node.id}
            suppressHydrationWarning
            ref={(el) => {
              if (onCardRef) onCardRef(index, el);
            }}
            id={`hud-card-${node.id}`}
            onMouseEnter={() => {
              onHoverNode(node.id);
              setCursorVariant('reticle');
            }}
            onMouseLeave={() => {
              onHoverNode(null);
              setCursorVariant('default');
            }}
            style={{
              width: '210px',
              padding: '11px 16px',
              borderRadius: '0px',
              opacity: proximity,
              transition:
                'opacity 0.15s ease, background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
            }}
            className={`relative group cursor-pointer border select-none pointer-events-auto backdrop-blur-[4px] ${
              isLit
                ? 'bg-[#040E0A]/95 border-[#10B981]/70 shadow-[0_0_20px_rgba(16,185,129,0.2)] translate-x-1'
                : 'bg-[#040A07]/50 border-[#10B981]/20 hover:border-[#10B981]/50 hover:bg-[#040E0A]/75'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Left: small emerald code in 10px monospace */}
              <span
                className={`font-mono-hud text-[10px] tracking-wider flex-shrink-0 w-7 transition-colors duration-200 ${
                  isLit
                    ? 'text-[#34D399] font-bold drop-shadow-[0_0_8px_#34D399]'
                    : 'text-[#10B981]/80 font-medium group-hover:text-[#34D399]'
                }`}
              >
                {node.code}
              </span>

              {/* Right: Title in bold 13px white monospace + subtitle in 9px muted monospace */}
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-mono-hud text-[13px] font-bold tracking-wider uppercase transition-colors duration-200 truncate ${
                    isLit
                      ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]'
                      : 'text-[#E5ECE8] group-hover:text-white'
                  }`}
                >
                  {node.title}
                </span>
                <span
                  className={`font-mono-hud text-[9px] tracking-widest uppercase transition-colors duration-200 truncate mt-0.5 ${
                    isLit
                      ? 'text-[#10B981] font-semibold'
                      : 'text-[#52635B] group-hover:text-[#8AA397]'
                  }`}
                >
                  {node.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
