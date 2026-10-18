'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Briefcase, MessageSquare, ArrowLeft, Lock, User } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [secretKey, setSecretKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_os_admin_key');
    if (saved === 'admin123') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey === 'admin123') {
      localStorage.setItem('portfolio_os_admin_key', secretKey);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('INVALID CREDENTIALS // ACCESS DENIED');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_os_admin_key');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#050B09] text-[#F3F5F4] font-mono-hud">
        <div className="w-full max-w-md p-8 rounded-2xl border border-[#00E599]/40 bg-[#091410] shadow-[0_0_50px_rgba(0,229,153,0.15)] text-center">
          <div className="w-12 h-12 rounded-full bg-[#00E599]/10 border border-[#00E599] flex items-center justify-center mx-auto mb-4 text-[#00E599]">
            <Lock size={22} />
          </div>
          <h2 className="text-xl font-bold tracking-widest text-[#00E599] uppercase mb-1">
            PORTFOLIO.OS // ADMIN HUD
          </h2>
          <p className="text-xs text-[#6E857C] mb-6">
            Enter administrative clearance key to access CMS telemetry & briefs.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Clearance Key (Default: admin123)"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded border border-[#132A21] bg-[#050B09] text-white text-xs focus:outline-none focus:border-[#00E599]"
            />
            {error && <div className="text-red-400 text-[11px]">{error}</div>}
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#00E599] text-[#050B09] font-bold text-xs uppercase tracking-wider hover:bg-[#20ffb0] transition-colors"
            >
              AUTHENTICATE ACCESS ↗
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#132A21]">
            <Link
              href="/"
              className="text-xs text-[#6E857C] hover:text-[#00E599] flex items-center justify-center space-x-1"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO PUBLIC PORTFOLIO</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'OVERVIEW', href: '/admin', icon: LayoutDashboard },
    { label: 'PROFILE & TEMPLATE', href: '/admin/profile', icon: User },
    { label: 'INQUIRIES', href: '/admin/inquiries', icon: MessageSquare },
    { label: 'PROJECTS', href: '/admin/projects', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-[#050B09] text-[#F3F5F4] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#132A21] bg-[#091410] p-6 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <Shield size={20} className="text-[#00E599]" />
            <span className="font-mono-hud text-sm font-bold tracking-widest text-[#00E599]">
              PORTFOLIO.OS CMS
            </span>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5 font-mono-hud text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/40 font-bold'
                      : 'text-[#6E857C] hover:text-white hover:bg-[#132A21]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#132A21] space-y-3 font-mono-hud text-xs">
          <Link
            href="/"
            className="flex items-center space-x-2 text-[#6E857C] hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>VIEW LIVE SITE</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-400 hover:text-red-300"
          >
            DISCONNECT SESSION
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
