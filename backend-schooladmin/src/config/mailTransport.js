import nodemailer from 'nodemailer';
import { env } from './env.js';

/**
 * Self-hosted SMTP transport only. Do NOT add SendGrid/SES/Mailgun/Resend
 * or any hosted email API integration here — company policy requires all
 * mail to route through our own SMTP server (MAIL_HOST).
 */
function buildTransportOptions() {
  const encryption = (env.mail.encryption || 'ssl').toLowerCase();

  return {
    host: env.mail.host,
    port: env.mail.port,
    secure: encryption === 'ssl', // true for port 465 (implicit TLS)
    requireTLS: encryption === 'tls', // STARTTLS for port 587
    auth: {
      user: env.mail.username,
      pass: env.mail.password,
    },
  };
}

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(buildTransportOptions());
  }
  return transporter;
}
