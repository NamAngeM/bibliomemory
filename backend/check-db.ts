import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const counts = {
        institutions: await prisma.institution.count(),
        cycles: await prisma.cycle.count(),
        fields: await prisma.field.count(),
        faculties: await prisma.faculty.count(),
        supervisors: await prisma.supervisor.count(),
        users: await prisma.user.count(),
    };
    console.log('Database Counts:', JSON.stringify(counts, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
