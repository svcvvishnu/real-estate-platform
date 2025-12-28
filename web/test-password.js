const bcrypt = require('bcryptjs');

async function testPassword() {
    const plainPassword = 'AdminSecurePass2025!';
    const newStoredHash = '$2b$10$IqPQsXJugFbrCDXFM/WPMOaVYMqc4so0e8KSm273h7KM9xnThAACO';

    console.log('Testing NEW password hash...');
    console.log('Plain password:', plainPassword);
    console.log('New stored hash:', newStoredHash);

    const match = await bcrypt.compare(plainPassword, newStoredHash);
    console.log('Password match result:', match);
}

testPassword().catch(console.error);
