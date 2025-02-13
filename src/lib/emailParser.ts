interface ParsedTransaction {
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  account: string;
  recipient: string;
  date: Date;
  refNumber: string;
}

export function parseHDFCTransaction(emailHtml: string): ParsedTransaction | null {
  try {
    // Extract the transaction details from the email content
    const debitMatch = emailHtml.match(/Rs\.([\d,]+\.?\d*) has been debited/i);
    const creditMatch = emailHtml.match(/Rs\.([\d,]+\.?\d*) (?:has been|is successfully) credited/i);
    
    if (!debitMatch && !creditMatch) {
      console.log('No transaction amount found in email');
      return null;
    }

    const matches = debitMatch || creditMatch;
    if (!matches) return null;
    const amount = parseFloat(matches[1].replace(/,/g, ''));
    const type = debitMatch ? 'DEBIT' : 'CREDIT';

    // Extract account number
    const accountMatch = emailHtml.match(/account \*\*(\d+)/);
    const account = accountMatch ? accountMatch[1] : '';

    // Extract recipient/sender based on transaction type
    let recipient = '';
    if (type === 'DEBIT') {
      const toVPA = emailHtml.match(/to VPA ([^\s]+)/);
      recipient = toVPA ? toVPA[1] : '';
    } else {
      // For credits, extract both VPA and name if available
      const fromVPA = emailHtml.match(/by VPA ([^\s]+)(?: ([^<\n]+))?/);
      if (fromVPA) {
        recipient = fromVPA[1];
        if (fromVPA[2]) {
          recipient += ` (${fromVPA[2].trim()})`;
        }
      }
    }

    // Extract reference number with flexible pattern
    const refMatch = emailHtml.match(/reference number(?:\s+is)?\s+(\d+)/i);
    const refNumber = refMatch ? refMatch[1] : '';

    // Extract date (assuming it's in DD-MM-YY format in the email)
    const dateMatch = emailHtml.match(/on (\d{2}-\d{2}-\d{2})/);
    const date = dateMatch ? new Date(dateMatch[1]) : new Date();

    return {
      amount,
      type,
      account,
      recipient,
      date,
      refNumber
    };
  } catch (error) {
    console.error('Error parsing HDFC transaction email:', error);
    return null;
  }
}
