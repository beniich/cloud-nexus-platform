const bcrypt = require('bcryptjs');

async function createAdmin() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.error('Usage: node createAdmin.js <username> <password>');
        process.exit(1);
    }

    const [username, password] = args;

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = {
            id: Date.now().toString(),
            username: username,
            password: hash,
            role: 'admin',
            createdAt: new Date().toISOString()
        };

        console.log('\n✅ Utilisateur admin créé avec succès!');
        console.log('\n📋 Détails:');
        console.log('─'.repeat(50));
        console.log(`Username: ${user.username}`);
        console.log(`Password: ${password} (non hashé)`);
        console.log(`Role: ${user.role}`);
        console.log(`Created: ${user.createdAt}`);
        console.log('─'.repeat(50));
        console.log('\n🔒 Hash à ajouter dans votre base de données:');
        console.log(JSON.stringify(user, null, 2));

    } catch (err) {
        console.error('❌ Erreur:', err.message);
        process.exit(1);
    }
}

createAdmin();
