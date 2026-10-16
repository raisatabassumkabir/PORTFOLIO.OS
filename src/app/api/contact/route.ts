import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projectInquirySchema } from '@/lib/validations';
import { sendInquiryNotification } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = projectInquirySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { clientName, clientEmail, projectType, budgetRange, timeline, brief } = validation.data;

    const saved = await prisma.projectInquiry.create({
      data: {
        clientName,
        clientEmail,
        projectType,
        budgetRange: budgetRange || null,
        timeline: timeline || null,
        brief,
        status: 'NEW',
      },
    });

    await sendInquiryNotification({
      clientName,
      clientEmail,
      projectType,
      budgetRange,
      timeline,
      brief,
    });

    return NextResponse.json({
      success: true,
      message: 'TRANSMISSION RECEIVED // BRIEF LOGGED TO SYSTEM',
      inquiryId: saved.id,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { success: false, message: 'CRITICAL SYSTEM ERROR: Unable to log transmission' },
      { status: 500 }
    );
  }
}
