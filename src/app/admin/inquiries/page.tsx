import React from 'react';
import { prisma } from '@/lib/prisma';
import { Mail, Clock, DollarSign, Calendar } from 'lucide-react';

export default async function InquiriesManagementPage() {
  let inquiries: Array<{
    id: string;
    clientName: string;
    clientEmail: string;
    projectType: string;
    budgetRange: string | null;
    timeline: string | null;
    brief: string;
    status: string;
    createdAt: Date;
  }> = [];

  try {
    inquiries = await prisma.projectInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.warn('Inquiries page fetch error:', e);
  }

  return (
    <div className="space-y-6 font-mono-hud text-xs">
      <div>
        <div className="text-[#00E599] tracking-widest uppercase mb-1">
          // CLIENT BRIEF REPOSITORY
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
          INCOMING PROJECT TRANSMISSIONS
        </h1>
        <p className="text-xs text-[#6E857C] mt-1 font-sans">
          Review, analyze, and directly respond to prospect inquiries submitted through the interactive HUD modal.
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="p-12 rounded-xl border border-[#132A21] bg-[#091410] text-center text-[#6E857C]">
          No project transmissions logged in database yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-6 rounded-xl border border-[#132A21] bg-[#091410] space-y-4 hover:border-[#00E599]/50 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#132A21]">
                <div>
                  <div className="text-base font-bold text-white font-heading">
                    {inq.clientName}
                  </div>
                  <div className="text-[#00E599] flex items-center space-x-1">
                    <Mail size={12} />
                    <a
                      href={`mailto:${inq.clientEmail}`}
                      className="hover:underline"
                    >
                      {inq.clientEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 font-bold text-[10px]">
                    {inq.projectType}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white font-bold text-[10px]">
                    {inq.status}
                  </span>
                </div>
              </div>

              {/* Parameters */}
              <div className="flex flex-wrap items-center gap-6 text-[#A0B8AF]">
                <div className="flex items-center space-x-1.5">
                  <DollarSign size={14} className="text-[#00E599]" />
                  <span>Budget: {inq.budgetRange || 'Flexible'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar size={14} className="text-[#00E599]" />
                  <span>Timeline: {inq.timeline || 'Flexible'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock size={14} className="text-[#6E857C]" />
                  <span>Logged: {new Date(inq.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Brief Content */}
              <div className="p-4 rounded-lg bg-[#050B09] border border-[#132A21] font-sans text-sm text-[#D2E0DA] leading-relaxed">
                {inq.brief}
              </div>

              {/* Action */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <a
                  href={`mailto:${inq.clientEmail}?subject=Re:%20${encodeURIComponent(inq.projectType)}%20Project%20Brief`}
                  className="px-4 py-2 rounded-full bg-[#00E599] text-[#050B09] font-bold text-xs uppercase tracking-wider hover:bg-[#2effb9] transition-colors"
                >
                  REPLY DIRECTLY ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
