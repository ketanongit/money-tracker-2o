import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL_ADDRESS,
    pass: process.env.ALERT_EMAIL_PASSWORD,
  },
});

export async function sendBudgetAlert(remainingBudget: number, threshold: number) {
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

  try {
    await transporter.sendMail(message);
    console.log(`Budget alert sent for threshold: ₹${threshold}`);
  } catch (error) {
    console.error('Failed to send budget alert:', error);
  }
}
