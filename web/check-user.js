const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { mobile: '9999999999' },
    });
    console.log('User found:', user);
    if (!user) {
        console.log('Admin user does not exist.');
    } else {
        console.log('User Role:', user.role);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
