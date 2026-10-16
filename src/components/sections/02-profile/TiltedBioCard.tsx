'use client';

import React, { useState } from 'react';
import { ArrowDownRight, Check } from 'lucide-react';

interface TiltedBioCardProps {
  greeting: string;
  paragraphs: string[];
  resumeUrl: string;
  assemblyProgress?: number;
}

export function TiltedBioCard({
  greeting,
  paragraphs,
  resumeUrl,
  assemblyProgress = 1,
}: TiltedBioCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Directional assembly: Bio card flies in from bottom-left (matching reference profile-assembly)
  // When user is on the page, assemblyProgress is 1 (animation completely stopped, zero shaking)
  const isAssembled = assemblyProgress >= 0.999;
  const eased = 1 - Math.pow(1 - Math.min(1, Math.max(0, assemblyProgress)), 2.2);
  const remaining = 1 - eased;
  const totalTurn = -8.5 * remaining;
  const totalX = -360 * remaining;
  const totalY = 80 * remaining;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(resumeUrl);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Martin_King_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error(err);
      window.open(resumeUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full rounded-[28px] bg-[#0E382B] p-8 sm:p-9 lg:p-10 text-[#F3F5F4] flex flex-col justify-between select-none"
      style={{
        boxShadow: isHovering
          ? '0 30px 60px -10px rgba(14, 56, 43, 0.45)'
          : '0 20px 45px -12px rgba(14, 56, 43, 0.32)',
        transform: !isAssembled
          ? `perspective(1000px) rotate(${totalTurn.toFixed(2)}deg) translate3d(${totalX.toFixed(1)}px, ${totalY.toFixed(1)}px, 0)`
          : 'none',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
        willChange: !isAssembled ? 'transform' : 'auto',
      }}
    >
      <div>
        {/* Header Name: Authentic DM Mono font as shown in reference */}
        <h3 className="font-mono-hud text-2xl sm:text-[26px] font-bold tracking-normal text-white mb-6">
          {greeting}
        </h3>

        {/* Bio Paragraphs with bold emphasized role */}
        <div className="space-y-4 font-sans text-xs sm:text-[13.5px] leading-[1.65] text-[#A3B8B0]">
          {paragraphs.map((p, idx) => {
            // Emphasize "Mobile Application Developer" like in reference screenshot
            if (p.includes('Mobile Application Developer')) {
              const parts = p.split('Mobile Application Developer');
              return (
                <p key={idx}>
                  {parts[0]}
                  <strong className="text-white font-bold">Mobile Application Developer</strong>
                  {parts[1]}
                </p>
              );
            }
            return <p key={idx}>{p}</p>;
          })}
        </div>
      </div>

      {/* Bottom Full-Width Pill Button with centered label and right arrow */}
      <div className="mt-8 pt-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full relative flex items-center justify-center py-3.5 px-6 rounded-full bg-white text-[#0E382B] font-sans font-medium text-xs sm:text-[13.5px] tracking-normal shadow-sm hover:bg-[#F2F7F4] active:scale-[0.99] transition-all cursor-pointer group"
        >
          {downloaded ? (
            <>
              <Check size={16} className="text-[#059669] mr-2" />
              <span>Resume downloaded ✓</span>
            </>
          ) : downloading ? (
            <span>Fetching resume...</span>
          ) : (
            <>
              <span>Download resume</span>
              <ArrowDownRight size={17} className="absolute right-6 text-[#0E382B] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

