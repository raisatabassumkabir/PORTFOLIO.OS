import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const forwardedFor = req.headers.get('x-forwarded-for') || 'local';

    // Simple hash/redaction of IP for privacy
    const ipHash = forwardedFor.split(',')[0].trim();

    // Log telemetry event in database asynchronously
    prisma.resumeTelemetry
      .create({
        data: {
          userAgent,
          ipHash,
        },
      })
      .catch((err) => console.warn('Could not record resume telemetry:', err));

    const filePath = path.join(process.cwd(), 'public', 'resume', 'resume.pdf');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Resume file not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Martin_King_Resume.pdf"',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Resume download handler error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
