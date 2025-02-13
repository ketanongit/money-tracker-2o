import { NextResponse } from 'next/server';
import { fetchEmails } from '@/lib/email';
import { getCurrentMonthRange } from '@/lib/dateUtils';

export async function GET() {
  try {
    const emails = await fetchEmails();
    const { firstDay, lastDay } = getCurrentMonthRange();

    // Filter emails to ensure they're within the current month
    const currentMonthEmails = emails.filter(email => {
      const emailDate = new Date(email.date);
      return emailDate >= firstDay && emailDate <= lastDay;
    });

    return NextResponse.json(currentMonthEmails);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}