import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL_ADDRESS,
    pass: process.env.ALERT_EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { remainingBudget, threshold } = await request.json();

    const message = {
      from: process.env.ALERT_EMAIL_ADDRESS,
      to: process.env.USER_EMAIL_ADDRESS,
      subject: `⚠️ Budget Alert: Remaining budget below ₹${threshold.toLocaleString('en-IN')}`,
      html: `
        <h2>Budget Alert</h2>
        <p>Your remaining budget has fallen below ₹${threshold.toLocaleString('en-IN')}</p>
        <p>Current remaining budget: ₹${remainingBudget.toLocaleString('en-IN')}</p>
        <p>Please review your spending and adjust accordingly.</p>
      `,
    };

    await transporter.sendMail(message);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send budget alert:', error);
    return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 });
  }
}
