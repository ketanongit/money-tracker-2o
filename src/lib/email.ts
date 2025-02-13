import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { getCurrentMonthRange } from './dateUtils';

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string | null;
  date: Date;
}

export async function fetchEmails(): Promise<EmailMessage[]> {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST!,
    port: 993,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS!,
      pass: process.env.EMAIL_PASSWORD!
    }
  });

  const emails: EmailMessage[] = [];
  const { firstDay, lastDay } = getCurrentMonthRange();

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');

    try {
      // Search for emails within current month
      const search = await client.search({
        from: 'alerts@hdfcbank.net',
        since: firstDay,
        before: lastDay
      });

      if (search.length > 0) {
        // Fetch the found messages
        const messages = await client.fetch(search, {
          source: true,
          envelope: true,
        });

        for await (const message of messages) {
          const parsed = await simpleParser(message.source);
          
          // Double check the from address to ensure it's from HDFC
          if (parsed.from?.text.toLowerCase().includes('alerts@hdfcbank.net')) {
            emails.push({
              id: message.uid.toString(),
              from: parsed.from?.text || '',
              to: Array.isArray(parsed.to) ? parsed.to.map(a => a.text).join(', ') : parsed.to?.text || '',
              subject: parsed.subject || '',
              text: parsed.text || '',
              html: parsed.html || null,
              date: parsed.date || new Date(),
            });
          }
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (error) {
    console.error('Error fetching HDFC Bank emails:', error);
    throw error;
  }

  // Sort emails by date (most recent first)
  return emails.sort((a, b) => b.date.getTime() - a.date.getTime());
}