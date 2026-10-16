import React from 'react';
import Image from 'next/image';
import { portfolioConfig } from '@/config/portfolio.config';
import { ExternalLink, Edit } from 'lucide-react';

export default function AdminProjectsPage() {
  const projects = portfolioConfig.work.projects;

  return (
    <div className="space-y-6 font-mono-hud text-xs">
      <div>
        <div className="text-[#00E599] tracking-widest uppercase mb-1">
          // SHOWCASE ARCHITECTURE
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
          PROJECT MATRIX & DYNAMIC THEMES
        </h1>
        <p className="text-xs text-[#6E857C] mt-1 font-sans">
          Manage projects displayed in Section 04, custom background themes, and case study specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-xl border border-[#132A21] bg-[#091410] flex flex-col md:flex-row gap-6 items-start justify-between hover:border-[#00E599]/40 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-full md:w-56 h-36 rounded-lg overflow-hidden border border-[#132A21] bg-[#050B09] flex-shrink-0">
              <Image
                src={p.mockupImage}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 224px"
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[#00E599] font-bold">{p.code}</span>
                <span className="text-[#6E857C]">/</span>
                <span className="text-[#A0B8AF]">{p.category}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-white">
                {p.title}
              </h3>
              <p className="font-sans text-xs text-[#8EA8A0] line-clamp-2">
                {p.summary}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded border border-[#132A21] bg-[#050B09] text-[10px] text-[#A0B8AF]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Theme Badge & Controls */}
            <div className="flex flex-col items-end space-y-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: p.theme.bg }}
                />
                <span className="text-[10px] text-[#6E857C]">
                  {p.theme.bg}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded border border-[#132A21] hover:text-[#00E599] text-[#6E857C]"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  className="px-3 py-1.5 rounded border border-[#00E599]/40 bg-[#00E599]/10 text-[#00E599] hover:bg-[#00E599]/20 flex items-center space-x-1"
                >
                  <Edit size={12} />
                  <span>EDIT METRIC</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
