const Queue = require('bull');
const { redis } = require('./redis');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Email transporter (SendGrid)
const emailTransporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});

// Alternative: Mailgun
// const emailTransporter = nodemailer.createTransport({
//   host: 'smtp.mailgun.org',
//   port: 587,
//   auth: {
//     user: process.env.MAILGUN_USERNAME,
//     pass: process.env.MAILGUN_PASSWORD
//   }
// });

// Create queues
const emailQueue = new Queue('email', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        },
        removeOnComplete: 100,
        removeOnFail: 50
    }
});

const dropletQueue = new Queue('droplet', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    }
});

const snapshotQueue = new Queue('snapshot', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    }
});

const backupQueue = new Queue('backup', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    }
});

// ==================== EMAIL QUEUE PROCESSOR ====================
emailQueue.process(async (job) => {
    const { to, subject, template, data } = job.data;

    try {
        let html;

        switch (template) {
            case 'invitation':
                html = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>You're Invited!</h1>
              </div>
              <div class="content">
                <p>Hi there,</p>
                <p>${data.inviterName} has invited you to join their team on CloudPlatform.</p>
                <p><strong>Role:</strong> ${data.role}</p>
                <p>Click the button below to accept the invitation:</p>
                <a href="${data.inviteUrl}" class="button">Accept Invitation</a>
                <p>This invitation will expire in 7 days.</p>
              </div>
              <div class="footer">
                <p>CloudPlatform © 2024</p>
              </div>
            </div>
          </body>
          </html>
        `;
                break;

            case '2fa-setup':
                html = `
          <!DOCTYPE html>
          <html>
          <body>
            <div class="container">
              <h2>Two-Factor Authentication Setup</h2>
              <p>Scan this QR code with your authenticator app:</p>
              <img src="${data.qrCode}" alt="QR Code" style="max-width: 200px;" />
              <p>Or enter this secret manually: <code>${data.secret}</code></p>
              <p>Backup codes: ${data.backupCodes.join(', ')}</p>
            </div>
          </body>
          </html>
        `;
                break;

            case 'droplet-created':
                html = `
          <h2>Droplet Created Successfully</h2>
          <p>Your droplet <strong>${data.dropletName}</strong> is now running.</p>
          <p><strong>IP Address:</strong> ${data.ipAddress}</p>
          <p><strong>Region:</strong> ${data.region}</p>
        `;
                break;

            case 'snapshot-complete':
                html = `
          <h2>Snapshot Completed</h2>
          <p>Snapshot of <strong>${data.dropletName}</strong> has been completed successfully.</p>
          <p><strong>Snapshot Name:</strong> ${data.snapshotName}</p>
          <p><strong>Size:</strong> ${data.size} GB</p>
        `;
                break;

            default:
                html = data.html || '<p>No content</p>';
        }

        const info = await emailTransporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@cloudplatform.com',
            to,
            subject,
            html
        });

        console.log('📧 Email sent:', info.messageId);

        // Log to activity
        await prisma.activityLog.create({
            data: {
                action: 'EMAIL_SENT',
                entityType: 'EMAIL',
                entityId: info.messageId,
                metadata: { to, subject, template }
            }
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email error:', error);
        throw error;
    }
});

// ==================== DROPLET QUEUE PROCESSOR ====================
dropletQueue.process('create', async (job) => {
    const { dropletId, teamId } = job.data;

    try {
        // Simulate droplet provisioning
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Update droplet status
        const droplet = await prisma.droplet.update({
            where: { id: dropletId },
            data: { status: 'RUNNING' }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'DROPLET_CREATED',
                entityType: 'DROPLET',
                entityId: dropletId,
                teamId,
                metadata: { name: droplet.name, region: droplet.region }
            }
        });

        // Send notification email
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { users: { where: { role: 'OWNER' } } }
        });

        if (team.users[0]) {
            await emailQueue.add({
                to: team.users[0].email,
                subject: 'Droplet Created Successfully',
                template: 'droplet-created',
                data: {
                    dropletName: droplet.name,
                    ipAddress: droplet.ipAddress,
                    region: droplet.region
                }
            });
        }

        return { success: true, droplet };
    } catch (error) {
        console.error('❌ Droplet creation error:', error);
        await prisma.droplet.update({
            where: { id: dropletId },
            data: { status: 'FAILED' }
        });
        throw error;
    }
});

dropletQueue.process('destroy', async (job) => {
    const { dropletId, teamId } = job.data;

    try {
        // Simulate cleanup
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Delete droplet
        await prisma.droplet.delete({
            where: { id: dropletId }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'DROPLET_DESTROYED',
                entityType: 'DROPLET',
                entityId: dropletId,
                teamId,
                metadata: { timestamp: new Date() }
            }
        });

        return { success: true };
    } catch (error) {
        console.error('❌ Droplet destruction error:', error);
        throw error;
    }
});

// ==================== SNAPSHOT QUEUE PROCESSOR ====================
snapshotQueue.process(async (job) => {
    const { dropletId, snapshotName, teamId } = job.data;

    try {
        const droplet = await prisma.droplet.findUnique({
            where: { id: dropletId }
        });

        if (!droplet) throw new Error('Droplet not found');

        // Simulate snapshot creation
        job.progress(25);
        await new Promise(resolve => setTimeout(resolve, 2000));

        job.progress(50);
        await new Promise(resolve => setTimeout(resolve, 2000));

        job.progress(75);
        const size = Math.random() * 50 + 10; // 10-60 GB

        // Create snapshot record
        const snapshot = await prisma.snapshot.create({
            data: {
                name: snapshotName,
                dropletId,
                size,
                status: 'completed',
                monthlyCost: size * 0.05 // $0.05/GB
            }
        });

        job.progress(100);

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'SNAPSHOT_CREATED',
                entityType: 'SNAPSHOT',
                entityId: snapshot.id,
                teamId,
                metadata: { dropletName: droplet.name, size }
            }
        });

        // Send notification
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { users: { where: { role: 'OWNER' } } }
        });

        if (team.users[0]) {
            await emailQueue.add({
                to: team.users[0].email,
                subject: 'Snapshot Completed',
                template: 'snapshot-complete',
                data: {
                    dropletName: droplet.name,
                    snapshotName,
                    size: size.toFixed(2)
                }
            });
        }

        return { success: true, snapshot };
    } catch (error) {
        console.error('❌ Snapshot error:', error);
        throw error;
    }
});

// ==================== BACKUP QUEUE PROCESSOR ====================
backupQueue.process(async (job) => {
    const { teamId, type } = job.data; // type: 'database' | 'droplets' | 'full'

    try {
        const timestamp = new Date().toISOString();
        const backupData = {
            teamId,
            type,
            timestamp,
            status: 'in_progress'
        };

        job.progress(10);

        // Simulate backup
        if (type === 'database' || type === 'full') {
            // Backup databases
            const databases = await prisma.database.findMany({
                where: { teamId }
            });
            backupData.databases = databases.length;
            await new Promise(resolve => setTimeout(resolve, 3000));
            job.progress(40);
        }

        if (type === 'droplets' || type === 'full') {
            // Backup droplet configurations
            const droplets = await prisma.droplet.findMany({
                where: { teamId },
                include: { metrics: true }
            });
            backupData.droplets = droplets.length;
            await new Promise(resolve => setTimeout(resolve, 3000));
            job.progress(70);
        }

        // Store backup metadata
        const backup = await prisma.backup.create({
            data: {
                teamId,
                type,
                size: Math.random() * 1000 + 100, // MB
                status: 'completed',
                metadata: backupData
            }
        });

        job.progress(100);

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'BACKUP_COMPLETED',
                entityType: 'BACKUP',
                entityId: backup.id,
                teamId,
                metadata: backupData
            }
        });

        return { success: true, backup };
    } catch (error) {
        console.error('❌ Backup error:', error);
        throw error;
    }
});

// ==================== SCHEDULED JOBS ====================
// Auto-backup every day at 2 AM
backupQueue.add(
    'scheduled-backup',
    { type: 'full' },
    {
        repeat: {
            cron: '0 2 * * *'
        }
    }
);

// Cleanup old logs every week
const cleanupQueue = new Queue('cleanup', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    }
});

cleanupQueue.process(async (job) => {
    const { olderThan = 90 } = job.data; // days

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThan);

    const deleted = await prisma.activityLog.deleteMany({
        where: {
            createdAt: {
                lt: cutoffDate
            }
        }
    });

    console.log(`🗑️ Cleaned up ${deleted.count} old activity logs`);
    return { deleted: deleted.count };
});

cleanupQueue.add(
    'cleanup-logs',
    { olderThan: 90 },
    {
        repeat: {
            cron: '0 3 * * 0' // Every Sunday at 3 AM
        }
    }
);

// ==================== QUEUE MONITORING ====================
emailQueue.on('completed', (job, result) => {
    console.log(`✅ Email job ${job.id} completed:`, result.messageId);
});

emailQueue.on('failed', (job, err) => {
    console.error(`❌ Email job ${job.id} failed:`, err.message);
});

dropletQueue.on('progress', (job, progress) => {
    console.log(`🔄 Droplet job ${job.id} progress: ${progress}%`);
});

snapshotQueue.on('progress', (job, progress) => {
    console.log(`📸 Snapshot job ${job.id} progress: ${progress}%`);
});

module.exports = {
    emailQueue,
    dropletQueue,
    snapshotQueue,
    backupQueue,
    cleanupQueue
};
