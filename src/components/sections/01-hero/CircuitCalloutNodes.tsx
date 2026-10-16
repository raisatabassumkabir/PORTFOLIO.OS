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
              opacity: isLocked ? 1 : isLit ? 1 : 0.22,
              transition:
                'opacity 0.25s ease, background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
            }}
            className={`relative group cursor-pointer border select-none pointer-events-auto backdrop-blur-[6px] ${
              isLit
                ? 'bg-[rgba(3,18,14,0.92)] border-[#00E599] shadow-[0_0_22px_rgba(0,229,153,0.3)] translate-x-1'
                : 'bg-[rgba(2,10,8,0.35)] border-[rgba(16,185,129,0.12)] hover:border-[#00E599]/60 hover:bg-[rgba(3,18,14,0.75)]'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Left: small emerald code in 10px monospace */}
              <span
                className={`font-mono-hud text-[10px] tracking-wider flex-shrink-0 w-7 transition-colors duration-200 ${
                  isLit
                    ? 'text-[#00E599] font-bold drop-shadow-[0_0_8px_#00E599]'
                    : 'text-[#10B981]/70 font-medium group-hover:text-[#00E599]'
                }`}
              >
                {node.code}
              </span>

              {/* Right: Title in bold 13px white monospace + subtitle in 9px muted monospace */}
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-mono-hud text-[13px] font-bold tracking-wider uppercase transition-colors duration-200 truncate ${
                    isLit
                      ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]'
                      : 'text-[#A5BDB4] group-hover:text-white'
                  }`}
                >
                  {node.title}
                </span>
                <span
                  className={`font-mono-hud text-[9px] tracking-widest uppercase transition-colors duration-200 truncate mt-0.5 ${
                    isLit
                      ? 'text-[#5EEAD4] font-semibold'
                      : 'text-[#5A736A] group-hover:text-[#8AA49B]'
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
