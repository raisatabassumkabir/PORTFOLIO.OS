'use client';

import React, { useState } from 'react';
import { useHudStore } from '@/store/useHudStore';
import { X, Send, CheckCircle2 } from 'lucide-react';

export function ProjectBriefModal() {
  const isBriefModalOpen = useHudStore((s) => s.isBriefModalOpen);
  const closeBriefModal = useHudStore((s) => s.closeBriefModal);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    projectType: 'Mobile App',
    budgetRange: '$5k – $15k',
    timeline: '1 – 3 Months',
    brief: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [inquiryId, setInquiryId] = useState('');

  if (!isBriefModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission error');
      }

      setInquiryId(data.inquiryId || 'CONFIRMED');
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Transmission failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#091410] border border-[#00E599]/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,229,153,0.2)] text-[#F3F5F4] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#132A21] mb-6">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-ping" />
            <h3 className="font-mono-hud text-sm font-bold tracking-widest text-[#00E599] uppercase">
              // INITIALIZE PROJECT BRIEF TRANSMISSION
            </h3>
          </div>
          <button
            onClick={closeBriefModal}
            className="p-1 rounded text-[#6E857C] hover:text-white hover:bg-[#132A21] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <CheckCircle2 size={56} className="text-[#00E599] animate-bounce" />
            <h4 className="font-heading text-2xl font-bold text-white">
              TRANSMISSION LOGGED TO DATABASE
            </h4>
            <p className="font-mono-hud text-xs text-[#00E599] tracking-widest">
              INQUIRY ID: {inquiryId}
            </p>
            <p className="font-sans text-sm text-[#8EA8A0] max-w-md">
              Your project parameters have been received. I will review the telemetry and respond to your email within 24 hours.
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                closeBriefModal();
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#00E599] text-[#050B09] font-mono-hud text-xs font-bold uppercase tracking-wider"
            >
              CLOSE TERMINAL ✓
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono-hud text-xs">
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#6E857C] mb-1 tracking-wider uppercase">
                  CLIENT / LEAD NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599]"
                />
              </div>

              <div>
                <label className="block text-[#6E857C] mb-1 tracking-wider uppercase">
                  DIRECT EMAIL *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599]"
                />
              </div>
            </div>

            {/* Row 2: Type, Budget, Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#6E857C] mb-1 tracking-wider uppercase">
                  SYSTEM TYPE
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599]"
                >
                  <option value="Mobile App">Mobile App (Flutter)</option>
                  <option value="Full-Stack Web">Full-Stack Web</option>
                  <option value="AI/ML System">AI / ML System</option>
                  <option value="Cloud/API">Cloud Infra / API</option>
                  <option value="Other">Consultation / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[#6E857C] mb-1 tracking-wider uppercase">
                  BUDGET TARGET
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-3 py-2.5 rounded border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599]"
                >
                  <option value="<$5k">&lt; $5,000</option>
                  <option value="$5k – $15k">$5k – $15k</option>
                  <option value="$15k – $35k">$15k – $35k</option>
                  <option value="$35k+">$35k+</option>
                </select>
              </div>

              <div>
                <label className="block text-[#6E857C] mb-1 tracking-wider uppercase">
                  TIMELINE
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-3 py-2.5 rounded border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599]"
                >
                  <option value="Immediate (&lt;1 Mo)">Urgent (&lt;1 Mo)</option>
                  <option value="1 – 3 Months">1 – 3 Months</option>
                  <option value="3 – 6 Months">3 – 6 Months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Row 3: Brief Description */}
            <div>
              <label className="block text-[#6E857C] mb-1 tracking-wider uppercase">
                PROJECT BRIEF & ARCHITECTURAL GOALS *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Outline core requirements, target platforms, timeline milestones, or technical expectations..."
                value={formData.brief}
                onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded border border-[#132A21] bg-[#050B09] text-white focus:outline-none focus:border-[#00E599] font-sans text-sm resize-none"
              />
            </div>

            {errorMessage && (
              <div className="text-red-400 font-mono text-xs">
                ERROR: {errorMessage}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={closeBriefModal}
                className="px-4 py-2.5 rounded border border-[#132A21] text-[#6E857C] hover:text-white"
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-6 py-2.5 rounded-full bg-[#00E599] text-[#050B09] font-bold tracking-wider uppercase hover:bg-[#2fffba] active:scale-95 transition-all flex items-center space-x-2"
              >
                <span>{status === 'submitting' ? 'TRANSMITTING...' : 'DISPATCH BRIEF'}</span>
                <Send size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
