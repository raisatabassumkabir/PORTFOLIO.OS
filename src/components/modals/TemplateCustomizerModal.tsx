'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHudStore } from '@/store/useHudStore';
import { portfolioConfig } from '@/config/portfolio.config';
import {
  X,
  Upload,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  User,
  Sliders,
  Shield,
  Eye,
} from 'lucide-react';

export function TemplateCustomizerModal() {
  const isCustomizerOpen = useHudStore((s) => s.isCustomizerOpen);
  const closeCustomizer = useHudStore((s) => s.closeCustomizer);
  const setCustomConfig = useHudStore((s) => s.setCustomConfig);
  const customConfig = useHudStore((s) => s.customConfig);

  // Form state initialized with active or fallback config
  const activeHero = customConfig?.hero || portfolioConfig.hero;
  const activeMeta = customConfig?.meta || portfolioConfig.meta;

  const [firstName, setFirstName] = useState(activeHero.firstName || 'TALHA');
  const [lastName, setLastName] = useState(activeHero.lastName || 'BADAR');
  const [monogram, setMonogram] = useState(activeMeta.monogram || 'TB');
  const [role, setRole] = useState(activeHero.role || 'Mobile Application Developer');
  const [taglinePrefix, setTaglinePrefix] = useState(activeHero.taglinePrefix || 'YOU IMAGINE,');
  const [taglineHighlight, setTaglineHighlight] = useState(activeHero.taglineHighlight || 'I DELIVER');
  const [basePortrait, setBasePortrait] = useState(activeHero.basePortrait || '/assets/portrait/portrait-base.png');
  const [cyberPortrait, setCyberPortrait] = useState<string | null>(activeHero.cyberPortrait || null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewRobo, setPreviewRobo] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-generate monogram when first or last name changes if monogram matches default
  const handleFirstNameChange = (val: string) => {
    setFirstName(val);
    const firstChar = val.trim()[0] || '';
    const lastChar = lastName.trim()[0] || '';
    if (firstChar || lastChar) {
      setMonogram(`${firstChar}${lastChar}`.toUpperCase());
    }
  };

  const handleLastNameChange = (val: string) => {
    setLastName(val);
    const firstChar = firstName.trim()[0] || '';
    const lastChar = val.trim()[0] || '';
    if (firstChar || lastChar) {
      setMonogram(`${firstChar}${lastChar}`.toUpperCase());
    }
  };

  // Handle Photo File Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'portrait');
      formData.append('isTemplate', 'true');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setBasePortrait(json.url);
        // Clear custom cyber portrait so the procedural cyber-shader generates the cyborg version automatically!
        setCyberPortrait(null);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        alert(json.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Apply Changes Live
  const handleApply = async () => {
    setSaveStatus('saving');

    const updatedConfig = {
      meta: {
        ...portfolioConfig.meta,
        monogram: monogram.toUpperCase().trim(),
      },
      hero: {
        ...portfolioConfig.hero,
        firstName: firstName.toUpperCase().trim(),
        lastName: lastName.toUpperCase().trim(),
        role: role.trim(),
        taglinePrefix: taglinePrefix.trim(),
        taglineHighlight: taglineHighlight.trim(),
        basePortrait,
        cyberPortrait,
        eyebrow: `${firstName.toUpperCase().trim()} // DEVELOPER · REMOTE / WORLDWIDE`,
      },
      profile: {
        ...portfolioConfig.profile,
        greeting: `I'm ${firstName.trim()} ${lastName.trim()}`,
        bioTitle: role.trim(),
      },
    };

    // Update client Zustand store immediately for instant reactive update
    setCustomConfig(updatedConfig);

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _isTemplateUpdate: true,
          ...updatedConfig,
        }),
      });

      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus('idle');
          closeCustomizer();
        }, 1200);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  // Reset to Original Demo Config
  const handleReset = async () => {
    if (confirm('Reset portfolio to original default template configuration?')) {
      setFirstName(portfolioConfig.hero.firstName);
      setLastName(portfolioConfig.hero.lastName);
      setMonogram(portfolioConfig.meta.monogram);
      setRole(portfolioConfig.hero.role);
      setTaglinePrefix(portfolioConfig.hero.taglinePrefix);
      setTaglineHighlight(portfolioConfig.hero.taglineHighlight);
      setBasePortrait(portfolioConfig.hero.basePortrait);
      setCyberPortrait(portfolioConfig.hero.cyberPortrait || null);

      setCustomConfig(null);

      await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _isTemplateUpdate: true,
          meta: portfolioConfig.meta,
          hero: portfolioConfig.hero,
          profile: portfolioConfig.profile,
        }),
      });

      closeCustomizer();
    }
  };

  // Export portfolio.config.ts Download
  const handleExportConfig = () => {
    const tsContent = `import { PortfolioConfig } from '@/types/portfolio';

export const portfolioConfig: PortfolioConfig = {
  meta: {
    osName: 'PORTFOLIO.OS',
    version: 'V / 03.26',
    buildStatus: 'ACTIVE',
    monogram: '${monogram.toUpperCase().trim()}',
    availabilityText: 'AVAILABLE FOR OPPORTUNITIES',
  },
  hero: {
    firstName: '${firstName.toUpperCase().trim()}',
    lastName: '${lastName.toUpperCase().trim()}',
    intro: "Hi, I'm",
    eyebrow: '${firstName.toUpperCase().trim()} // DEVELOPER · REMOTE / WORLDWIDE',
    role: '${role.trim()}',
    taglinePrefix: '${taglinePrefix.trim()}',
    taglineHighlight: '${taglineHighlight.trim()}',
    lede: 'Transforming ideas into high-impact digital experiences through modern engineering.',
    basePortrait: '${basePortrait}',
    cyberPortrait: ${cyberPortrait ? `'${cyberPortrait}'` : 'null'},
    circuitNodes: [
      { id: 'ai', code: 'AI', title: 'AI / ML', subtitle: 'INTELLIGENT SYSTEMS', anchorX: 58, anchorY: 31 },
      { id: 'api', code: 'API', title: 'BACKEND', subtitle: 'SCALABLE SERVICES', anchorX: 59, anchorY: 41 },
      { id: 'app', code: 'APP', title: 'MOBILE', subtitle: 'MODERN EXPERIENCES', anchorX: 52, anchorY: 52 },
      { id: 'cld', code: 'CLD', title: 'CLOUD', subtitle: 'DEPLOYED INFRA', anchorX: 54, anchorY: 63 },
      { id: 'sec', code: 'SEC', title: 'SECURITY', subtitle: 'PROTECTED DATA', anchorX: 50, anchorY: 74 },
    ],
  },
  profile: {
    greeting: "I'm ${firstName.trim()} ${lastName.trim()}",
    bioTitle: '${role.trim()}',
    bioParagraphs: [
      "I'm a dedicated engineer who turns ideas into polished, dependable digital products.",
      'My work spans full-stack architecture, clean user interfaces, APIs, and scalable infrastructure.',
    ],
    metrics: [
      { value: '4+', label: 'years', description: 'Building products.' },
      { value: '15+', label: 'projects', description: 'Delivered worldwide.' },
      { value: '99%', label: 'satisfaction', description: 'Client feedback score.' },
    ],
    resumeUrl: '/assets/resume/resume.pdf',
  },
  stack: ${JSON.stringify(portfolioConfig.stack, null, 2)},
  work: ${JSON.stringify(portfolioConfig.work, null, 2)},
  journey: ${JSON.stringify(portfolioConfig.journey, null, 2)},
  contact: ${JSON.stringify(portfolioConfig.contact, null, 2)},
};
`;

    const blob = new Blob([tsContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.config.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isCustomizerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md font-mono-hud text-xs text-[#F3F5F4] select-none animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[#00E599]/40 bg-[#06100D] shadow-[0_0_80px_rgba(0,229,153,0.2)] p-5 sm:p-8 flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#132A21] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00E599]/10 border border-[#00E599]/40 flex items-center justify-center text-[#00E599]">
              <Sliders size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#00E599] font-bold tracking-widest text-[11px] uppercase">
                  TEMPLATE STUDIO // FORK PORTFOLIO.OS
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 font-medium">
                  UNIVERSAL
                </span>
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Customize Identity & Portrait
              </h2>
            </div>
          </div>

          <button
            onClick={closeCustomizer}
            className="p-2 rounded-lg border border-[#132A21] bg-[#091512] text-[#6E857C] hover:text-[#00E599] hover:border-[#00E599]/40 transition-colors cursor-pointer"
            aria-label="Close customizer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Two Column Setup Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5 font-medium">
                FIRST NAME
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                placeholder="e.g. SARAH"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#132A21] bg-[#020706] text-white focus:outline-none focus:border-[#00E599] text-xs font-mono uppercase tracking-wider transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5 font-medium">
                LAST NAME
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                placeholder="e.g. CONNOR"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#132A21] bg-[#020706] text-white focus:outline-none focus:border-[#00E599] text-xs font-mono uppercase tracking-wider transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5 font-medium">
                  MONOGRAM
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={monogram}
                  onChange={(e) => setMonogram(e.target.value)}
                  placeholder="SC"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#132A21] bg-[#020706] text-white focus:outline-none focus:border-[#00E599] text-xs font-mono font-bold uppercase tracking-widest text-center transition-colors"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5 font-medium">
                  PROFESSIONAL ROLE
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full-Stack Engineer"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#132A21] bg-[#020706] text-white focus:outline-none focus:border-[#00E599] text-xs font-mono transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] tracking-wider text-[#6E857C] uppercase mb-1.5">
                  TAGLINE PREFIX
                </label>
                <input
                  type="text"
                  value={taglinePrefix}
                  onChange={(e) => setTaglinePrefix(e.target.value)}
                  placeholder="YOU IMAGINE,"
                  className="w-full px-3 py-2 rounded-lg border border-[#132A21] bg-[#020706] text-white/80 focus:outline-none focus:border-[#00E599] text-[11px] font-mono transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5">
                  TAGLINE HIGHLIGHT
                </label>
                <input
                  type="text"
                  value={taglineHighlight}
                  onChange={(e) => setTaglineHighlight(e.target.value)}
                  placeholder="I DELIVER"
                  className="w-full px-3 py-2 rounded-lg border border-[#132A21] bg-[#020706] text-[#00E599] focus:outline-none focus:border-[#00E599] text-[11px] font-mono font-bold transition-colors"
                />
              </div>
            </div>

            {/* Photo Upload Zone */}
            <div className="pt-2">
              <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5 font-medium flex items-center justify-between">
                <span>PORTRAIT PHOTO UPLOAD</span>
                <span className="text-[#6E857C] text-[9px] lowercase">png, jpg, webp</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 rounded-xl border border-dashed border-[#1B3E31] bg-[#030907] hover:border-[#00E599]/60 hover:bg-[#00E599]/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 group"
              >
                <div className="w-9 h-9 rounded-full bg-[#00E599]/10 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] group-hover:scale-110 transition-transform">
                  <Upload size={16} />
                </div>
                <div>
                  <div className="text-white text-xs font-semibold group-hover:text-[#00E599] transition-colors">
                    {isUploading ? 'Uploading & Processing...' : 'Click or Drag photo here'}
                  </div>
                  <div className="text-[10px] text-[#6E857C] mt-0.5">
                    Works on any image — cyborg version is synthesized automatically!
                  </div>
                </div>
                {uploadSuccess && (
                  <div className="flex items-center gap-1.5 text-[#00E599] text-[11px] font-bold">
                    <Check size={14} />
                    <span>PORTRAIT UPLOADED SUCCESSFULLY</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Human-to-Robo Preview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-wider text-[#00E599] uppercase font-medium">
                LIVE INTERACTIVE PREVIEW
              </span>
              <div className="flex items-center gap-1 bg-[#020706] p-1 rounded-lg border border-[#132A21]">
                <button
                  type="button"
                  onClick={() => setPreviewRobo(false)}
                  className={`px-2.5 py-1 rounded text-[10px] tracking-wider transition-colors cursor-pointer ${
                    !previewRobo
                      ? 'bg-[#00E599] text-[#02100B] font-bold'
                      : 'text-[#6E857C] hover:text-white'
                  }`}
                >
                  HUMAN
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewRobo(true)}
                  className={`px-2.5 py-1 rounded text-[10px] tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                    previewRobo
                      ? 'bg-[#00E599] text-[#02100B] font-bold shadow-[0_0_12px_rgba(0,229,153,0.5)]'
                      : 'text-[#6E857C] hover:text-[#00E599]'
                  }`}
                >
                  <Sparkles size={11} />
                  <span>CYBORG</span>
                </button>
              </div>
            </div>

            {/* Visual Portrait Stage */}
            <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl border border-[#132A21] bg-[#020706] overflow-hidden flex items-end justify-center">
              {/* Grid Background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(0, 229, 153, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 153, 0.2) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Human Base Image */}
              <img
                src={basePortrait}
                alt="Portrait Preview"
                className={`h-full w-auto max-w-none object-contain object-bottom transition-opacity duration-300 ${
                  previewRobo ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Procedural Cyborg Version */}
              {previewRobo && (
                <div className="absolute inset-0 h-full w-auto max-w-none flex items-end justify-center overflow-hidden animate-fadeIn">
                  {/* Chrome Layer */}
                  <img
                    src={basePortrait}
                    alt="Cyborg Preview"
                    className="h-full w-auto max-w-none object-contain object-bottom"
                    style={{
                      filter:
                        'grayscale(100%) contrast(185%) brightness(115%) drop-shadow(0 0 20px rgba(0,229,153,0.35))',
                    }}
                  />
                  {/* Cyan/Emerald Duotone */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(0, 229, 153, 0.35) 0%, rgba(56, 189, 248, 0.45) 50%, rgba(16, 185, 129, 0.3) 100%)',
                      mixBlendMode: 'color',
                    }}
                  />
                  {/* Motherboard Pattern */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 50% 35%, rgba(0, 229, 153, 0.25) 0%, transparent 65%), linear-gradient(rgba(0, 229, 153, 0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 153, 0.16) 1px, transparent 1px)',
                      backgroundSize: '100% 100%, 18px 18px, 18px 18px',
                      mixBlendMode: 'screen',
                      opacity: 0.85,
                    }}
                  />
                  {/* Scanlines */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0, 229, 153, 0.15) 3px 4px)',
                      mixBlendMode: 'overlay',
                    }}
                  />
                  {/* Targeting Reticle over Face */}
                  <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-dashed border-[#00E599] flex items-center justify-center animate-spin">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E599] shadow-[0_0_8px_#00E599]" />
                  </div>
                  <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-[8px] px-1.5 py-0.5 rounded border border-[#00E599]/40 bg-[#020C08]/90 text-[#00E599] tracking-widest">
                    CYBORG // ACTIVE
                  </div>
                </div>
              )}

              {/* Telemetry Footer Badge */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] text-[#6E857C] bg-[#020706]/80 px-2 py-1 rounded border border-[#132A21] backdrop-blur-sm">
                <span>IDENTITY: {firstName} {lastName}</span>
                <span className="text-[#00E599]">{previewRobo ? 'ROBOTIC X-RAY' : 'HUMAN BASE'}</span>
              </div>
            </div>

            <div className="text-[10px] text-[#6E857C] leading-relaxed">
              💡 <span className="text-white">Universal Cyborg Engine</span>: When you upload your photo, visitors can hover their mouse to reveal the robotic cyborg version seamlessly!
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#132A21]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-lg border border-[#132A21] bg-[#091512] text-[#6E857C] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[10px]"
            >
              <RotateCcw size={13} />
              <span>Reset Default</span>
            </button>
            <button
              type="button"
              onClick={handleExportConfig}
              className="px-3 py-2 rounded-lg border border-[#132A21] bg-[#091512] text-[#38BDF8] hover:border-[#38BDF8]/40 transition-colors cursor-pointer flex items-center gap-1.5 text-[10px]"
              title="Download your custom portfolio.config.ts"
            >
              <Download size={13} />
              <span>Export Config (.ts)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={closeCustomizer}
              className="px-4 py-2.5 rounded-lg border border-[#132A21] text-[#6E857C] hover:text-white transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={saveStatus === 'saving'}
              className="px-6 py-2.5 rounded-lg bg-[#00E599] text-[#02100B] font-bold text-xs uppercase tracking-wider hover:bg-[#20ffb0] transition-all shadow-[0_0_20px_rgba(0,229,153,0.3)] cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {saveStatus === 'saving' && <div className="w-3 h-3 rounded-full border-2 border-[#02100B] border-t-transparent animate-spin" />}
              {saveStatus === 'saved' && <Check size={14} />}
              <span>{saveStatus === 'saved' ? 'APPLIED & SAVED!' : 'APPLY & SAVE TO OS ↗'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
