'use client';

import React from 'react';
import { StackItem } from '@/types/portfolio';
import { motion, AnimatePresence } from 'framer-motion';

interface ActiveModuleReadoutProps {
  activeItem: StackItem;
}

export function ActiveModuleReadout({ activeItem }: ActiveModuleReadoutProps) {
  const displayTitle = (activeItem.readoutTitle || activeItem.name).toUpperCase();

  return (
    <div className="relative min-h-[110px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.id || activeItem.number}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative pl-5 border-l border-[#62f5b7] py-0.5 flex flex-col justify-center"
        >
          {/* Muted Sage Label matching reference */}
          <small className="font-mono-hud text-[10px] text-[#647b73] font-light tracking-[0.14em] uppercase mb-1">
            ACTIVE MODULE
          </small>

          {/* Light-weight Manrope Name matching reference strong */}
          <strong className="font-heading font-[300] text-4xl sm:text-5xl lg:text-[56px] text-[#62f5b7] tracking-tight uppercase leading-none my-1">
            {displayTitle}
          </strong>

          {/* Description */}
          <span className="font-heading text-[13px] sm:text-[13.5px] text-[#8fa39c] font-normal leading-relaxed mt-1">
            {activeItem.description}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
