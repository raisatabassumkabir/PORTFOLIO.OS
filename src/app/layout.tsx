import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TopNavbar } from '@/components/hud/TopNavbar';
import { SequenceRail } from '@/components/hud/SequenceRail';
import { TelemetryBar } from '@/components/hud/TelemetryBar';
import { CustomCursor } from '@/components/hud/CustomCursor';
import { ProjectBriefModal } from '@/components/modals/ProjectBriefModal';
import { CaseStudyDrawer } from '@/components/modals/CaseStudyDrawer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050B09',
};

export const metadata: Metadata = {
  title: 'Martin King - Mobile Application & Full-Stack Developer',
  description:
    'Senior Mobile Application Developer specializing in Flutter, React, Firebase, and Full-Stack Development. Creating seamless user experiences for global clients.',
  keywords: [
    'Martin King',
    'Mobile Application Developer',
    'Flutter Developer',
    'React',
    'Firebase',
    'PORTFOLIO.OS',
    'Full Stack Developer',
  ],
  authors: [{ name: 'Martin King' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#050B09] text-[#F3F5F4] antialiased selection:bg-[#00E599] selection:text-[#050B09] min-h-screen relative overflow-x-clip"
      >
        {/* Custom Interactive Desktop Cursor */}
        <CustomCursor />

        {/* Persistent Fixed OS HUD Frame */}
        <TopNavbar />
        <SequenceRail />
        <TelemetryBar />

        {/* Global Modals */}
        <ProjectBriefModal />
        <CaseStudyDrawer />

        {/* Page Content */}
        <main className="relative z-0">{children}</main>
      </body>
    </html>
  );
}
