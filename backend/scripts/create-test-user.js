
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = 'etudiant@univ-gabon.ga';
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword, // Using correct field
                firstName: 'Jean',
                lastName: 'Test',
                role: 'STUDENT', // String for enum in generic usage or use Prisma.UserRole
                student: {
                    create: {
                        matricule: 'TEST12345'
                    }
                }
            },
        });
        console.log(`User created: ${user.email}`);
    } else {
        // Ensure password is correct
        await prisma.user.update({
            where: { email },
            data: { passwordHash: hashedPassword, role: 'STUDENT' }
        });
        console.log(`User updated: ${user.email}`);
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
