const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function hashPassword() {
    rl.question('Entrez le mot de passe à hasher: ', async (password) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            console.log('\n✅ Mot de passe hashé avec succès!');
            console.log('\nHash à copier dans votre code:');
            console.log('─'.repeat(70));
            console.log(hash);
            console.log('─'.repeat(70));
            console.log('\nUtilisation:');
            console.log(`const users = [{
  id: '1',
  username: 'votre-username',
  password: '${hash}',
  role: 'admin'
}];`);

        } catch (err) {
            console.error('❌ Erreur:', err.message);
        }
        rl.close();
    });
}

hashPassword();
