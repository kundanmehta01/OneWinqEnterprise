import nodemailer from 'nodemailer';
import { env } from '../../config/env.config.js';
import { logger } from '../../config/logger.config.js';

class EmailService {
  constructor() {
    this.provider = env.EMAIL_PROVIDER;
    this.transporter = null;
    this.init();
  }

  init() {
    if (this.provider === 'smtp') {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: env.SMTP_USER ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD
        } : undefined
      });
      logger.info(`Email service initialized with SMTP host: ${env.SMTP_HOST}`);
    } else {
      logger.info(`Email service initialized with '${this.provider}' provider mode.`);
    }
  }

  async sendMail({ to, subject, html, text }) {
    const mailOptions = {
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html
    };

    if (this.provider === 'smtp' && this.transporter) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        logger.info(`[EmailService] Email sent to ${to} (MessageId: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        logger.error(`[EmailService] Failed to send email via SMTP to ${to}: ${error.message}`, { error });
        throw error;
      }
    } else {
      // Console / Mock mode
      logger.info(`\n================== [OUTGOING EMAIL (${this.provider.toUpperCase()})] ==================\n` +
        `To: ${to}\n` +
        `Subject: ${subject}\n` +
        `Body:\n${text || html}\n` +
        `========================================================================\n`
      );
      return { success: true, mock: true };
    }
  }

  async sendInvitationEmail({ to, inviterName, inviteLink, companyName = 'OneWinq', designation }) {
    const subject = `You're invited to join ${companyName} on OneWinq`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #1a1a1a;">Welcome to ${companyName}</h2>
        <p>Hello,</p>
        <p><strong>${inviterName}</strong> has invited you to join <strong>${companyName}</strong> as <strong>${designation || 'Team Member'}</strong> on the OneWinq digital identity platform.</p>
        <p style="margin: 30px 0;">
          <a href="${inviteLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Accept Invitation & Setup Account
          </a>
        </p>
        <p style="color: #666666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${inviteLink}</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="color: #999999; font-size: 12px;">This invitation link will expire in 7 days. If you did not expect this invitation, please ignore this email.</p>
      </div>
    `;
    return this.sendMail({ to, subject, html });
  }

  async sendPasswordResetEmail({ to, resetLink }) {
    const subject = 'Reset your OneWinq password';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #1a1a1a;">Password Reset Request</h2>
        <p>We received a request to reset your OneWinq password.</p>
        <p style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #ef4444; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color: #666666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${resetLink}</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="color: #999999; font-size: 12px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `;
    return this.sendMail({ to, subject, html });
  }

  async sendProfileStatusNotification({ to, name, status, reviewNote }) {
    const isApproved = status === 'approved';
    const subject = `Your OneWinq Profile Changes: ${status.toUpperCase()}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #1a1a1a;">Profile Review Update</h2>
        <p>Hello ${name},</p>
        <p>Your profile changes have been reviewed with the following status: <strong>${status.toUpperCase()}</strong></p>
        ${reviewNote ? `<blockquote style="background: #f3f4f6; padding: 12px; border-left: 4px solid #2563eb; margin: 20px 0;"><strong>Reviewer Feedback:</strong> ${reviewNote}</blockquote>` : ''}
        <p>${isApproved ? 'Your public digital profile has been updated and published.' : 'Please log in to your account to review feedback and update your draft.'}</p>
      </div>
    `;
    return this.sendMail({ to, subject, html });
  }

  async sendWelcomeCredentialsEmail({ to, name, initialPassword, loginUrl }) {
    const loginLink = loginUrl || `${env.FRONTEND_URL}/login`;
    const subject = `Welcome to OneWinq - Your Account Credentials`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px; color: #333;">
        <h2 style="color: #2563eb; margin-top: 0;">Welcome to OneWinq, ${name}!</h2>
        <p>Your organization account has been created. You can now log in to manage your digital profile and business card.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">Your Login Credentials:</h3>
          <p style="margin: 6px 0;"><strong>Email:</strong> <span style="color: #2563eb;">${to}</span></p>
          <p style="margin: 6px 0;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${initialPassword}</code></p>
        </div>

        <p style="margin: 28px 0;">
          <a href="${loginLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Log In to OneWinq
          </a>
        </p>

        <p style="color: #64748b; font-size: 13px;">For security, we recommend changing your password after your first login.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">If you have any questions, please reach out to your organization administrator.</p>
      </div>
    `;
    return this.sendMail({ to, subject, html });
  }
}

export const emailService = new EmailService();
