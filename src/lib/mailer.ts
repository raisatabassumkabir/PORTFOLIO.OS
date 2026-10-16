export async function sendInquiryNotification(inquiry: {
  clientName: string;
  clientEmail: string;
  projectType: string;
  budgetRange?: string;
  timeline?: string;
  brief: string;
}) {
  // Production webhook / Resend / Nodemailer dispatch point
  console.log('----------------------------------------------------');
  console.log('[PORTFOLIO.OS NOTIFICATION] New Project Brief Received:');
  console.log(`From: ${inquiry.clientName} <${inquiry.clientEmail}>`);
  console.log(`Type: ${inquiry.projectType} | Budget: ${inquiry.budgetRange || 'N/A'}`);
  console.log(`Timeline: ${inquiry.timeline || 'Flexible'}`);
  console.log(`Brief: ${inquiry.brief}`);
  console.log('----------------------------------------------------');

  return { success: true };
}
