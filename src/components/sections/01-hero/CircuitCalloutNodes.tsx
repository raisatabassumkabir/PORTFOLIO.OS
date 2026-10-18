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

const TOPS = ['25%', '36.5%', '48%', '59.5%', '71%'];

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
    <div className="hero-intel hero-skill-layer" aria-label="Technical specializations">
      {nodes.map((node, index) => {
        const top = TOPS[index] || `${25 + index * 11.5}%`;
        const proximity = nodeProximities
          ? nodeProximities[index]
          : isLocked
          ? 1
          : nodeIsLit[index]
          ? 1
          : 0.08;
        const activation = isLocked ? 1 : Math.max(0.08, proximity);

        return (
          <div
            key={node.id}
            ref={(el) => {
              if (onCardRef) onCardRef(index, el);
            }}
            id={`hud-card-${node.id}`}
            className="hero-skill-module"
            data-code={node.code}
            onMouseEnter={() => {
              onHoverNode(node.id);
              setCursorVariant('reticle');
            }}
            onMouseLeave={() => {
              onHoverNode(null);
              setCursorVariant('default');
            }}
            style={
              {
                '--top': top,
                '--activation': activation.toFixed(3),
                transform: `translateX(${((1 - activation) * 18).toFixed(2)}px)`,
                opacity: activation,
              } as React.CSSProperties
            }
          >
            <strong>{node.title}</strong>
            <small>{node.subtitle}</small>
          </div>
        );
      })}
    </div>
  );
}

