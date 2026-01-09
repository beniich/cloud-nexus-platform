const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const email = 'tarikbenaich@gmail.com';

    console.log(`Promoting ${email} to OWNER/ADMIN...`);

    try {
        const user = await prisma.user.upsert({
            where: { email: email },
            update: { role: 'owner' },
            create: {
                email: email,
                name: 'Super Admin',
                role: 'owner',
                passwordHash: '' // Placeholder for OAuth
            }
        });

        console.log('✅ Success! User upserted (Created or Updated):');
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
    } catch (error) {
        console.error('❌ An error occurred:', error);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
