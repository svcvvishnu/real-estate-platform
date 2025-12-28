import { PrismaClient, UserRole, KYCStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("password123", 10);

    const users = [
        {
            mobile: "9000000001",
            name: "Admin User",
            role: UserRole.ADMIN,
            kycStatus: KYCStatus.APPROVED,
        },
        {
            mobile: "9000000002",
            name: "Buyer User",
            role: UserRole.BUYER,
            kycStatus: KYCStatus.APPROVED,
        },
        {
            mobile: "9000000003",
            name: "Seller User",
            role: UserRole.SELLER,
            kycStatus: KYCStatus.APPROVED,
        },
        {
            mobile: "9000000004",
            name: "Verification Team",
            role: UserRole.VERIFICATION_TEAM,
            kycStatus: KYCStatus.APPROVED,
        },
    ];

    console.log("Seeding users...");

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { mobile: u.mobile },
            update: {
                role: u.role,
                kycStatus: u.kycStatus, // Ensure they are KYC approved for ease of testing
                name: u.name,
            },
            create: {
                mobile: u.mobile,
                password,
                name: u.name,
                role: u.role,
                kycStatus: u.kycStatus,
            },
        });
        console.log(`Created/Updated User: ${u.name} (${u.role}) - ${u.mobile}`);
    }

    // Also ensure we have at least one property for the seller if not exists
    const seller = await prisma.user.findUnique({ where: { mobile: "9000000003" } });
    if (seller) {
        const propCount = await prisma.property.count({ where: { ownerId: seller.id } });
        if (propCount === 0) {
            await prisma.property.create({
                data: {
                    title: "Sample Seeded Villa",
                    description: "A beautiful seeded villa for testing purposes.",
                    price: 15000000,
                    area: 2500,
                    type: "HOUSE",
                    address: "100 Seed Lane, Database City",
                    status: "APPROVED",
                    ownerId: seller.id,
                    images: {
                        create: {
                            url: "https://placehold.co/600x400/2563eb/ffffff?text=Seeded+Property"
                        }
                    }
                }
            });
            console.log("Created sample property for Seller");
        }
    }

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
