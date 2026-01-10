const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = 'tarikbenaich@gmail.com';
    const password = '1985@Trbm';

    console.log(`Setting password for ${email}...`);

    try {
        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.update({
            where: { email: email },
            data: { passwordHash: passwordHash }
        });

        console.log('✅ Password successfully set!');
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log('\nYou can now login with:');
        console.log(`  Email: ${email}`);
        console.log(`  Password: ${password}`);
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
