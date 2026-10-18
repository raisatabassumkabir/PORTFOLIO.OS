'use client';

import React, { useState, useEffect, useRef } from 'react';
import { portfolioConfig } from '@/config/portfolio.config';
import {
  Upload,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Sliders,
  User,
  Shield,
  Eye,
} from 'lucide-react';

export default function AdminProfilePage() {
  const [firstName, setFirstName] = useState(portfolioConfig.hero.firstName);
  const [lastName, setLastName] = useState(portfolioConfig.hero.lastName);
  const [monogram, setMonogram] = useState(portfolioConfig.meta.monogram);
  const [role, setRole] = useState(portfolioConfig.hero.role);
  const [taglinePrefix, setTaglinePrefix] = useState(portfolioConfig.hero.taglinePrefix);
  const [taglineHighlight, setTaglineHighlight] = useState(portfolioConfig.hero.taglineHighlight);
  const [basePortrait, setBasePortrait] = useState(portfolioConfig.hero.basePortrait);
  const [cyberPortrait, setCyberPortrait] = useState<string | null>(portfolioConfig.hero.cyberPortrait || null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewRobo, setPreviewRobo] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch active config overrides on mount
  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const d = json.data;
          if (d.hero?.firstName) setFirstName(d.hero.firstName);
          if (d.hero?.lastName) setLastName(d.hero.lastName);
          if (d.meta?.monogram) setMonogram(d.meta.monogram);
          if (d.hero?.role) setRole(d.hero.role);
          if (d.hero?.taglinePrefix) setTaglinePrefix(d.hero.taglinePrefix);
          if (d.hero?.taglineHighlight) setTaglineHighlight(d.hero.taglineHighlight);
          if (d.hero?.basePortrait) setBasePortrait(d.hero.basePortrait);
          if (d.hero?.cyberPortrait !== undefined) setCyberPortrait(d.hero.cyberPortrait);
        }
      })
      .catch((err) => console.warn('Could not load portfolio overrides:', err));
  }, []);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'portrait');

      const adminKey = localStorage.getItem('portfolio_os_admin_key') || 'admin123';
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-admin-key': adminKey,
        },
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setBasePortrait(json.url);
        setCyberPortrait(null); // Clear custom cyber so procedural shader runs!
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

  const handleSave = async () => {
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

    try {
      const adminKey = localStorage.getItem('portfolio_os_admin_key') || 'admin123';
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(updatedConfig),
      });

      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

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

  return (
    <div className="space-y-8 font-mono-hud text-xs max-w-5xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#132A21] gap-4">
        <div>
          <div className="text-[#00E599] tracking-widest uppercase mb-1">
            // CMS IDENTITY & PORTRAIT MANAGEMENT
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
            TEMPLATE PROFILE STUDIO
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportConfig}
            className="px-3.5 py-2 rounded-lg border border-[#132A21] bg-[#091512] text-[#38BDF8] hover:border-[#38BDF8]/40 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <Download size={14} />
            <span>EXPORT CONFIG (.TS)</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-5 py-2 rounded-lg bg-[#00E599] text-[#02100B] font-bold text-xs uppercase tracking-wider hover:bg-[#20ffb0] transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saveStatus === 'saved' ? <Check size={14} /> : null}
            <span>{saveStatus === 'saved' ? 'CONFIG SAVED!' : 'SAVE CHANGES ↗'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Controls */}
        <div className="space-y-5 p-6 rounded-2xl border border-[#132A21] bg-[#091410]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#132A21] pb-3">
            Identity Configuration
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5">
                FIRST NAME
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599] font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5">
                LAST NAME
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599] font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5">
                MONOGRAM
              </label>
              <input
                type="text"
                maxLength={3}
                value={monogram}
                onChange={(e) => setMonogram(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599] font-mono font-bold uppercase text-center"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-1.5">
                ROLE / TITLE
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-wider text-[#6E857C] uppercase mb-1.5">
                TAGLINE PREFIX
              </label>
              <input
                type="text"
                value={taglinePrefix}
                onChange={(e) => setTaglinePrefix(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599] font-mono"
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#132A21] bg-[#050B09] text-[#00E599] focus:outline-none focus:border-[#00E599] font-mono font-bold"
              />
            </div>
          </div>

          {/* Portrait Photo Upload */}
          <div className="pt-3 border-t border-[#132A21]">
            <label className="block text-[10px] tracking-wider text-[#00E599] uppercase mb-2 font-medium">
              PORTRAIT PHOTO UPLOAD (ANY IMAGE)
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
              className="w-full p-6 rounded-xl border border-dashed border-[#1B3E31] bg-[#050B09] hover:border-[#00E599]/60 hover:bg-[#00E599]/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#00E599]/10 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] group-hover:scale-110 transition-transform">
                <Upload size={18} />
              </div>
              <div className="text-white text-xs font-semibold">
                {isUploading ? 'Uploading file...' : 'Upload custom portrait photo'}
              </div>
              <div className="text-[10px] text-[#6E857C]">
                Works with any headshot, avatar, or photo. The cyborg counterpart is generated automatically!
              </div>
              {uploadSuccess && (
                <div className="flex items-center gap-1.5 text-[#00E599] text-xs font-bold mt-1">
                  <Check size={14} />
                  <span>UPLOAD SUCCESSFUL</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Side */}
        <div className="space-y-4 p-6 rounded-2xl border border-[#132A21] bg-[#091410] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#132A21] pb-3 mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Human / Robo Preview
              </h2>
              <div className="flex items-center gap-1 bg-[#050B09] p-1 rounded-lg border border-[#132A21]">
                <button
                  type="button"
                  onClick={() => setPreviewRobo(false)}
                  className={`px-3 py-1 rounded text-[10px] tracking-wider cursor-pointer ${
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
                  className={`px-3 py-1 rounded text-[10px] tracking-wider cursor-pointer flex items-center gap-1 ${
                    previewRobo
                      ? 'bg-[#00E599] text-[#02100B] font-bold'
                      : 'text-[#6E857C] hover:text-[#00E599]'
                  }`}
                >
                  <Sparkles size={11} />
                  <span>CYBORG</span>
                </button>
              </div>
            </div>

            <div className="relative w-full h-[360px] rounded-xl border border-[#132A21] bg-[#050B09] overflow-hidden flex items-end justify-center">
              <img
                src={basePortrait}
                alt="Portrait"
                className={`h-full w-auto max-w-none object-contain object-bottom transition-opacity duration-300 ${
                  previewRobo ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {previewRobo && (
                <div className="absolute inset-0 h-full w-auto max-w-none flex items-end justify-center overflow-hidden">
                  <img
                    src={basePortrait}
                    alt="Cyborg"
                    className="h-full w-auto max-w-none object-contain object-bottom"
                    style={{
                      filter:
                        'grayscale(100%) contrast(185%) brightness(115%) drop-shadow(0 0 20px rgba(0,229,153,0.35))',
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(0, 229, 153, 0.35) 0%, rgba(56, 189, 248, 0.45) 50%, rgba(16, 185, 129, 0.3) 100%)',
                      mixBlendMode: 'color',
                    }}
                  />
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
                  <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-dashed border-[#00E599] flex items-center justify-center animate-spin">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E599] shadow-[0_0_8px_#00E599]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#132A21] flex items-center justify-between">
            <span className="text-[#6E857C] text-[10px]">
              Active Source: <span className="text-white">{basePortrait}</span>
            </span>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 rounded-lg bg-[#00E599] text-[#02100B] font-bold text-xs uppercase tracking-wider hover:bg-[#20ffb0] transition-all cursor-pointer disabled:opacity-50"
            >
              {saveStatus === 'saved' ? 'SAVED' : 'SAVE NOW'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
