const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const mobile = '9000000001';
    const user = await prisma.user.findUnique({
        where: { mobile },
    });
    console.log(`Checking User ${mobile}:`);
    if (!user) {
        console.log('User does not exist.');
    } else {
        console.log('User found:', user);
        console.log('Role:', user.role);
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
