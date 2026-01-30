import { PrismaClient, UserRole, SupervisorTitle } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Institutions
    const uob = await prisma.institution.upsert({
        where: { name: 'Université Omar Bongo' },
        update: {},
        create: {
            name: 'Université Omar Bongo',
            acronym: 'UOB',
            country: 'Gabon',
            city: 'Libreville',
        },
    });

    const ustm = await prisma.institution.upsert({
        where: { name: 'Université des Sciences et Techniques de Masuku' },
        update: {},
        create: {
            name: 'Université des Sciences et Techniques de Masuku',
            acronym: 'USTM',
            country: 'Gabon',
            city: 'Franceville',
        },
    });

    // 2. Cycles
    const cycles = [
        { name: 'Licence', level: 1, slug: 'licence' },
        { name: 'Master', level: 2, slug: 'master' },
        { name: 'Doctorat', level: 3, slug: 'doctorat' },
    ];

    for (const c of cycles) {
        await prisma.cycle.upsert({
            where: { slug: c.slug },
            update: {},
            create: c,
        });
    }

    // 3. Faculties
    const flsh = await prisma.faculty.upsert({
        where: { institutionId_name: { institutionId: uob.id, name: 'Faculté des Lettres et Sciences Humaines' } },
        update: {},
        create: {
            name: 'Faculté des Lettres et Sciences Humaines',
            acronym: 'FLSH',
            institutionId: uob.id,
        },
    });

    // 4. Fields
    await prisma.field.upsert({
        where: { slug: 'informatique-de-gestion' },
        update: {},
        create: {
            name: 'Informatique de Gestion',
            slug: 'informatique-de-gestion',
            facultyId: flsh.id,
        },
    });

    // 5. Supervisors
    await prisma.supervisor.upsert({
        where: { firstName_lastName_email: { firstName: 'Jean', lastName: 'Ntoutoume', email: 'j.ntoutoume@uob.ga' } },
        update: {},
        create: {
            firstName: 'Jean',
            lastName: 'Ntoutoume',
            title: SupervisorTitle.PROFESSOR,
            email: 'j.ntoutoume@uob.ga',
            institutionId: uob.id,
        },
    });

    // 6. Test User (Admin Espace Etablissement)
    const hashedPass = await bcrypt.hash('password123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@uob.ga' },
        update: {},
        create: {
            email: 'admin@uob.ga',
            passwordHash: hashedPass,
            firstName: 'Admin',
            lastName: 'UOB',
            role: UserRole.ESTABLISHMENT,
            institutionId: uob.id,
        },
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
