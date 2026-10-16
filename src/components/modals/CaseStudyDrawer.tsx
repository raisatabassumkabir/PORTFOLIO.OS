'use client';

import React from 'react';
import Image from 'next/image';
import { useHudStore } from '@/store/useHudStore';
import { portfolioConfig } from '@/config/portfolio.config';
import { X, ExternalLink, Code2, Check } from 'lucide-react';

export function CaseStudyDrawer() {
  const activeCaseStudyId = useHudStore((s) => s.activeCaseStudyId);
  const closeCaseStudy = useHudStore((s) => s.closeCaseStudy);

  if (!activeCaseStudyId) return null;

  const project = portfolioConfig.work.projects.find((p) => p.id === activeCaseStudyId);
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={closeCaseStudy} />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-2xl h-full bg-[#091410] border-l border-[#132A21] text-[#F3F5F4] p-6 sm:p-10 overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#132A21] mb-6">
            <div className="flex items-center space-x-2 font-mono-hud text-xs text-[#00E599] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00E599]" />
              <span>CASE STUDY // {project.code}</span>
            </div>
            <button
              onClick={closeCaseStudy}
              className="p-1 rounded text-[#6E857C] hover:text-white hover:bg-[#132A21] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Project Title & Category */}
          <div
            className="font-mono-hud text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: project.theme.accentColor }}
          >
            {project.category}
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {project.title}
          </h2>

          {/* Large Mockup Showcase */}
          <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden my-6 border border-[#132A21] bg-[#050B09]">
            <Image
              src={project.mockupImage}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, 600px"
              className="object-cover"
            />
          </div>

          {/* Metric Badges */}
          {project.metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              {project.metrics.map((m, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-[#132A21] bg-[#050B09] font-mono-hud text-center"
                >
                  <div className="text-xs text-[#00E599] font-bold">{m}</div>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          <div className="my-6 space-y-2">
            <h4 className="font-mono-hud text-xs font-bold text-[#6E857C] tracking-widest uppercase">
              // EXECUTIVE OVERVIEW
            </h4>
            <p className="font-sans text-sm sm:text-base text-[#C4D9D0] leading-relaxed">
              {project.caseStudy.overview}
            </p>
          </div>

          {/* Challenge */}
          <div className="my-6 space-y-2">
            <h4 className="font-mono-hud text-xs font-bold text-[#6E857C] tracking-widest uppercase">
              // SYSTEM CHALLENGE
            </h4>
            <p className="font-sans text-sm sm:text-base text-[#A5C0B6] leading-relaxed">
              {project.caseStudy.challenge}
            </p>
          </div>

          {/* Architecture */}
          <div className="my-6 space-y-3">
            <h4 className="font-mono-hud text-xs font-bold text-[#6E857C] tracking-widest uppercase">
              // ARCHITECTURAL PIPELINE
            </h4>
            <div className="space-y-2">
              {project.caseStudy.architecture.map((arch, i) => (
                <div key={i} className="flex items-start space-x-2 text-sm text-[#C4D9D0]">
                  <span className="text-[#00E599] mt-0.5">▹</span>
                  <span>{arch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="my-6 space-y-3">
            <h4 className="font-mono-hud text-xs font-bold text-[#6E857C] tracking-widest uppercase">
              // KEY DELIVERABLES
            </h4>
            <div className="space-y-2">
              {project.caseStudy.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-start space-x-2 text-sm text-[#C4D9D0]">
                  <Check size={16} className="text-[#00E599] mt-0.5 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div className="my-6 p-4 rounded-xl border border-[#00E599]/30 bg-[#00E599]/5">
            <h4 className="font-mono-hud text-xs font-bold text-[#00E599] tracking-widest uppercase mb-1">
              // SYSTEM OUTCOME & IMPACT
            </h4>
            <p className="font-sans text-sm text-white leading-relaxed">
              {project.caseStudy.outcome}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#132A21] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 font-mono-hud text-xs text-[#00E599] hover:underline"
              >
                <span>LIVE SYSTEM</span>
                <ExternalLink size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 font-mono-hud text-xs text-[#A0B8AF] hover:text-white"
              >
                <Code2 size={14} />
                <span>SOURCE CODE</span>
              </a>
            )}
          </div>

          <button
            onClick={closeCaseStudy}
            className="px-5 py-2 rounded-full border border-[#132A21] bg-[#050B09] text-xs font-mono-hud hover:text-white"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
