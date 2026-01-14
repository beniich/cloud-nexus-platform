import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
    const email = 'admin@nexus.com';
    const password = 'NexusAdmin2026!';
    const name = 'Nexus Super Admin';

    try {
        console.log('🔍 Checking if user already exists...');
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log('⚠️ User already exists. Updating role to owner...');
            await prisma.user.update({
                where: { email },
                data: { role: 'owner' }
            });
            console.log('✅ Role updated successfully.');
        } else {
            console.log('👤 Creating new Super Admin account...');
            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'owner',
                    team: {
                        create: {
                            name: 'Admin Team'
                        }
                    }
                }
            });
            console.log('✅ Super Admin account created successfully.');
        }

        console.log('\n-----------------------------------');
        console.log('Credentials:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('Role: Super Admin (owner)');
        console.log('-----------------------------------\n');

    } catch (error) {
        console.error('❌ Error creating Super Admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createSuperAdmin();
