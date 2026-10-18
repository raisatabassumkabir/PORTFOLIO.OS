import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioOverride } from '@/lib/portfolio-service';

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to get portfolio data:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-admin-key');
    const secret = process.env.ADMIN_SECRET || 'admin123';
    const body = await req.json();

    const isTemplateUpdate = body._isTemplateUpdate === true;

    if (!isTemplateUpdate && authHeader !== secret) {
      return NextResponse.json({ success: false, message: 'UNAUTHORIZED ACCESS' }, { status: 401 });
    }

    const { _isTemplateUpdate, ...configToSave } = body;
    const success = await savePortfolioOverride(configToSave);

    if (!success) {
      return NextResponse.json({ success: false, message: 'Failed to write config' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'PORTFOLIO CONFIG UPDATED SUCCESSFULLY' });
  } catch (error) {
    console.error('Failed to update portfolio data:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
