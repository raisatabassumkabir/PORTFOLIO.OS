import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-admin-key');
    const secret = process.env.ADMIN_SECRET || 'admin123';

    if (authHeader !== secret) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetFolder = (formData.get('folder') as string) || 'projects'; // 'portrait' | 'projects' | 'resume'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uploadDir = path.join(process.cwd(), 'public', 'assets', targetFolder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const destPath = path.join(uploadDir, safeName);
    fs.writeFileSync(destPath, buffer);

    return NextResponse.json({
      success: true,
      url: `/assets/${targetFolder}/${safeName}`,
    });
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
