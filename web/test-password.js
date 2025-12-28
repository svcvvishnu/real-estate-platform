const bcrypt = require('bcryptjs');

async function testPassword() {
    const plainPassword = 'AdminSecurePass2025!';
    const storedHash = '$2b$10$IqPQsXJugFbrCDXFM/WPMOaVYMqc4so0e8KSm273h7KM9xnThAACO';

    console.log('Testing password hash from database...');
    console.log('Plain password:', plainPassword);
    console.log('Stored hash:', storedHash);

    const match = await bcrypt.compare(plainPassword, storedHash);
    console.log('Password match result:', match);

    // Test with bcrypt (not bcryptjs) to see if there's a difference
    const bcryptNative = require('bcrypt');
    const matchNative = await bcryptNative.compare(plainPassword, storedHash);
    console.log('Password match result (bcrypt):', matchNative);
}

testPassword().catch(console.error);
