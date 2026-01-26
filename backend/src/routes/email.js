
import sgMail from '@sendgrid/mail';
import { PrismaClient } from '@prisma/client';

// Simple email service stub to fix compilation error in payment.js
// Ideally, this should be a robust service, but for now we mock it or use simple SendGrid if key is present
const prisma = new PrismaClient();

class EmailService {
    constructor() {
        if (process.env.SENDGRID_API_KEY) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        }
    }

    async send(options) {
        // Check if API key is present
        if (!process.env.SENDGRID_API_KEY) {
            console.log('📧 [Mock Email] Would send:', options);
            return { success: true, mocked: true };
        }

        try {
            const msg = {
                to: options.to,
                from: process.env.EMAIL_FROM || 'noreply@cloudnexus.com',
                subject: options.subject,
                html: options.html,
            };

            await sgMail.send(msg);
            console.log(`✉️ Email sent to ${options.to}`);
            return { success: true };
        } catch (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }
    }
}

export const emailService = new EmailService();
