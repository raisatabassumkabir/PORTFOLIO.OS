import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MessageSquare, Download, CheckCircle, Clock } from 'lucide-react';

export default async function AdminOverviewPage() {
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

  let resumeCount = 0;

  try {
    inquiries = await prisma.projectInquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    resumeCount = await prisma.resumeTelemetry.count();
  } catch (e) {
    console.warn('Admin overview fetch fallback:', e);
  }

  const newCount = inquiries.filter((i) => i.status === 'NEW').length;

  return (
    <div className="space-y-8 font-mono-hud text-xs">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#132A21] gap-4">
        <div>
          <div className="text-[#00E599] tracking-widest uppercase mb-1">
            // TELEMETRY & INQUIRY OVERVIEW
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
            SYSTEM MISSION CONTROL
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#00E599] bg-[#00E599]/10 border border-[#00E599]/30 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
          <span>PORTFOLIO.OS ONLINE</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-xl border border-[#132A21] bg-[#091410] flex items-center justify-between">
          <div>
            <div className="text-[#6E857C] uppercase mb-1">TOTAL BRIEFS</div>
            <div className="font-heading text-3xl font-bold text-white">
              {inquiries.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#00E599]/10 flex items-center justify-center text-[#00E599]">
            <MessageSquare size={18} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-xl border border-[#132A21] bg-[#091410] flex items-center justify-between">
          <div>
            <div className="text-[#6E857C] uppercase mb-1">PENDING REVIEW</div>
            <div className="font-heading text-3xl font-bold text-[#00E599]">
              {newCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#00E599]/10 flex items-center justify-center text-[#00E599]">
            <Clock size={18} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-xl border border-[#132A21] bg-[#091410] flex items-center justify-between">
          <div>
            <div className="text-[#6E857C] uppercase mb-1">RESUME DOWNLOADS</div>
            <div className="font-heading text-3xl font-bold text-white">
              {resumeCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8]">
            <Download size={18} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-xl border border-[#132A21] bg-[#091410] flex items-center justify-between">
          <div>
            <div className="text-[#6E857C] uppercase mb-1">SYSTEM HEALTH</div>
            <div className="font-heading text-xl font-bold text-[#00E599]">
              100% OPERATIONAL
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#00E599]/10 flex items-center justify-center text-[#00E599]">
            <CheckCircle size={18} />
          </div>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="rounded-xl border border-[#132A21] bg-[#091410] overflow-hidden">
        <div className="p-5 border-b border-[#132A21] flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-white">
            RECENT CLIENT INQUIRIES & BRIEFS
          </h2>
          <Link
            href="/admin/inquiries"
            className="text-xs text-[#00E599] hover:underline"
          >
            VIEW ALL BRIEFS →
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="p-10 text-center text-[#6E857C]">
            No project briefs received yet. Test the transmission form on the live site!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#050B09] text-[#6E857C] text-[10px] uppercase border-b border-[#132A21]">
                <tr>
                  <th className="py-3 px-4">CLIENT</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">BUDGET</th>
                  <th className="py-3 px-4">TIMELINE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#132A21] text-xs">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#132A21]/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{inq.clientName}</div>
                      <div className="text-[10px] text-[#6E857C]">{inq.clientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#00E599]">{inq.projectType}</td>
                    <td className="py-3.5 px-4 text-[#C4D9D0]">{inq.budgetRange || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-[#C4D9D0]">{inq.timeline || 'Flexible'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inq.status === 'NEW'
                            ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#6E857C]">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
