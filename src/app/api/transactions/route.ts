import { NextResponse } from 'next/server';
import { fetchEmails } from '@/lib/email';

export async function GET() {
  try {
    const emails = await fetchEmails();
    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error in email API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}