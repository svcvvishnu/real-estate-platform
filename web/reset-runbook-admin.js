const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const mobile = '9000000001';
    const newPassword = 'AdminSecurePass2025!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
        where: { mobile },
        data: { password: hashedPassword },
    });

    console.log(`Password for user ${mobile} reset to '${newPassword}'`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
