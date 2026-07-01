import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  const mailer = getTransporter();
  if (!mailer) return;

  await mailer.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

export function welcomeEmail(name) {
  return `
    <h2>Welcome to BookBridge, ${name}</h2>
    <p>Your campus account is ready. Start listing books or browse what seniors have posted.</p>
  `;
}

export function itemSoldEmail(title) {
  return `
    <h2>Item sold</h2>
    <p>Your listing <strong>${title}</strong> has been marked as sold. Thanks for using BookBridge.</p>
  `;
}
