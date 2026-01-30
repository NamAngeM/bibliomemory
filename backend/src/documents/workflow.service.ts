import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitByStudentDto, SubmitByEstablishmentDto } from './dto';
import { DocumentStatus, SubmissionSource, Language } from '@prisma/client';
import { randomUUID } from 'crypto';

interface FileInfo {
    fileName: string;
    fileSize: number;
    fileHash: string;
    s3Key: string;
    s3Bucket: string;
    pageCount?: number;
}

interface UserContext {
    id: string;
    role: string;
    institutionId?: string;
}

@Injectable()
export class WorkflowService {
    constructor(private readonly prisma: PrismaService) { }

    private generateSlug(title: string): string {
        const baseSlug = title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 100);

        return `${baseSlug}-${randomUUID().substring(0, 8)}`;
    }

    private async getOrCreateKeywords(keywords: string[]) {
        return Promise.all(
            keywords.map(async (kw) => {
                const slug = kw.toLowerCase().replace(/\s+/g, '-');
                return this.prisma.keyword.upsert({
                    where: { keyword: kw.toLowerCase() },
                    create: { keyword: kw.toLowerCase(), slug },
                    update: { usageCount: { increment: 1 } },
                });
            }),
        );
    }

    // ========== STUDENT SUBMISSION ==========

    async submitByStudent(
        dto: SubmitByStudentDto,
        studentId: string,
        file: FileInfo,
    ) {
        // Get student info
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { user: true },
        });

        if (!student) {
            throw new NotFoundException('Student profile not found');
        }

        // Check for duplicate file
        const existingDoc = await this.prisma.document.findUnique({
            where: { fileHash: file.fileHash },
        });

        if (existingDoc) {
            throw new BadRequestException('This document has already been uploaded');
        }

        // Get or create author from student info
        const author = await this.prisma.author.upsert({
            where: {
                firstName_lastName_email: {
                    firstName: student.user.firstName,
                    lastName: student.user.lastName,
                    email: student.user.email,
                },
            },
            create: {
                firstName: student.user.firstName,
                lastName: student.user.lastName,
                email: student.user.email,
            },
            update: {},
        });

        // Get faculty from field
        const field = await this.prisma.field.findUnique({
            where: { id: dto.fieldId },
            include: { faculty: true },
        });

        if (!field) {
            throw new BadRequestException('Invalid field');
        }

        const slug = this.generateSlug(dto.title);
        const keywordRecords = await this.getOrCreateKeywords(dto.keywords);

        const document = await this.prisma.document.create({
            data: {
                title: dto.title,
                slug,
                abstract: dto.abstract,
                language: dto.language || Language.FR,
                documentType: dto.documentType,
                academicYear: dto.academicYear,
                defenseDate: new Date(dto.defenseDate),
                className: dto.className,
                authorId: author.id,
                institutionId: student.user.institutionId!,
                facultyId: field.faculty.id,
                fieldId: dto.fieldId,
                cycleId: dto.cycleId,
                mainSupervisorId: dto.mainSupervisorId,
                coSupervisorId: dto.coSupervisorId,
                fileName: file.fileName,
                fileSize: BigInt(file.fileSize),
                fileHash: file.fileHash,
                s3Key: file.s3Key,
                s3Bucket: file.s3Bucket,
                pageCount: file.pageCount,
                status: DocumentStatus.SUBMITTED_BY_STUDENT,
                submittedBy: SubmissionSource.STUDENT,
                studentId: studentId,
                uploadedBy: student.userId,
                keywords: {
                    create: keywordRecords.map((k) => ({ keywordId: k.id })),
                },
            },
            include: {
                author: true,
                cycle: true,
                field: true,
                institution: true,
            },
        });

        return document;
    }

    // ========== ESTABLISHMENT SUBMISSION ==========

    async submitByEstablishment(
        dto: SubmitByEstablishmentDto,
        user: UserContext,
        file: FileInfo,
    ) {
        if (!user.institutionId) {
            throw new ForbiddenException('User must be linked to an institution');
        }

        // Check for duplicate file
        const existingDoc = await this.prisma.document.findUnique({
            where: { fileHash: file.fileHash },
        });

        if (existingDoc) {
            throw new BadRequestException('This document has already been uploaded');
        }

        // Get or create author
        const author = await this.prisma.author.upsert({
            where: {
                firstName_lastName_email: {
                    firstName: dto.authorFirstName,
                    lastName: dto.authorLastName,
                    email: dto.authorEmail ?? '',
                },
            },
            create: {
                firstName: dto.authorFirstName,
                lastName: dto.authorLastName,
                email: dto.authorEmail,
            },
            update: {},
        });

        const slug = this.generateSlug(dto.title);
        const keywordRecords = await this.getOrCreateKeywords(dto.keywords);

        // Determine status based on options
        let status: DocumentStatus;
        if (dto.saveAsDraft) {
            status = DocumentStatus.DRAFT;
        } else if (dto.isLegacyDocument) {
            status = DocumentStatus.ARCHIVED;
        } else {
            status = DocumentStatus.SUBMITTED_BY_ESTABLISHMENT;
        }

        const document = await this.prisma.document.create({
            data: {
                title: dto.title,
                slug,
                abstract: dto.abstract,
                language: dto.language || Language.FR,
                documentType: dto.documentType,
                academicYear: dto.academicYear,
                defenseDate: new Date(dto.defenseDate),
                className: dto.className,
                authorId: author.id,
                institutionId: user.institutionId,
                facultyId: dto.facultyId,
                fieldId: dto.fieldId,
                cycleId: dto.cycleId,
                mainSupervisorId: dto.mainSupervisorId,
                coSupervisorId: dto.coSupervisorId,
                fileName: file.fileName,
                fileSize: BigInt(file.fileSize),
                fileHash: file.fileHash,
                s3Key: file.s3Key,
                s3Bucket: file.s3Bucket,
                pageCount: file.pageCount,
                status,
                submittedBy: SubmissionSource.ESTABLISHMENT,
                isLegacyDocument: dto.isLegacyDocument || false,
                isConfidential: dto.isConfidential || false,
                embargoUntil: dto.embargoUntil ? new Date(dto.embargoUntil) : null,
                uploadedBy: user.id,
                keywords: {
                    create: keywordRecords.map((k) => ({ keywordId: k.id })),
                },
            },
            include: {
                author: true,
                cycle: true,
                field: true,
                institution: true,
            },
        });

        return document;
    }

    // ========== VALIDATION ==========

    async validateDocument(documentId: string, establishmentUserId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: establishmentUserId },
        });

        if (!user?.institutionId) {
            throw new ForbiddenException('User must belong to an institution');
        }

        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        // Check that the document belongs to the user's institution
        if (document.institutionId !== user.institutionId) {
            throw new ForbiddenException(
                'You can only validate documents from your institution',
            );
        }

        // Check that the document is in a validatable state
        const validatableStatuses: DocumentStatus[] = [
            DocumentStatus.SUBMITTED_BY_STUDENT,
            DocumentStatus.SUBMITTED_BY_ESTABLISHMENT,
            DocumentStatus.UNDER_REVIEW,
        ];

        if (!validatableStatuses.includes(document.status)) {
            throw new BadRequestException(
                `Document cannot be validated (current status: ${document.status})`,
            );
        }

        return this.prisma.document.update({
            where: { id: documentId },
            data: {
                status: DocumentStatus.PUBLISHED,
                validatedBy: establishmentUserId,
                validatedAt: new Date(),
                publishedBy: establishmentUserId,
                publishedAt: new Date(),
            },
        });
    }

    // ========== REJECTION ==========

    async rejectDocument(
        documentId: string,
        reason: string,
        establishmentUserId: string,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { id: establishmentUserId },
        });

        if (!user?.institutionId) {
            throw new ForbiddenException('User must belong to an institution');
        }

        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        if (document.institutionId !== user.institutionId) {
            throw new ForbiddenException(
                'You can only reject documents from your institution',
            );
        }

        return this.prisma.document.update({
            where: { id: documentId },
            data: {
                status: DocumentStatus.REJECTED,
                rejectionReason: reason,
                validatedBy: establishmentUserId,
                validatedAt: new Date(),
            },
        });
    }

    // ========== PUBLICATION (Admin only) ==========

    async publishDocument(documentId: string, adminUserId: string) {
        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        if (document.status !== DocumentStatus.VALIDATED) {
            throw new BadRequestException(
                'Only validated documents can be published',
            );
        }

        return this.prisma.document.update({
            where: { id: documentId },
            data: {
                status: DocumentStatus.PUBLISHED,
                publishedBy: adminUserId,
                publishedAt: new Date(),
            },
        });
    }

    // ========== GET PENDING FOR ESTABLISHMENT ==========

    async getPendingForEstablishment(institutionId: string) {
        return this.prisma.document.findMany({
            where: {
                institutionId,
                status: {
                    in: [
                        DocumentStatus.SUBMITTED_BY_STUDENT,
                        DocumentStatus.SUBMITTED_BY_ESTABLISHMENT,
                        DocumentStatus.UNDER_REVIEW,
                    ],
                },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                author: true,
                cycle: true,
                field: true,
                student: {
                    include: {
                        user: { select: { firstName: true, lastName: true, email: true } },
                    },
                },
            },
        });
    }

    // ========== GET ALL FOR ADMIN ==========

    async getAllForAdmin(status?: DocumentStatus) {
        const where = status ? { status } : {};

        return this.prisma.document.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                author: true,
                cycle: true,
                field: true,
                institution: true,
            },
        });
    }

    // ========== GET FOR STUDENT ==========

    async getStudentDocuments(userId: string) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
        });

        if (!student) {
            throw new NotFoundException('Student profile not found');
        }

        return this.prisma.document.findMany({
            where: { studentId: student.id },
            orderBy: { createdAt: 'desc' },
            include: {
                author: true,
                cycle: true,
                field: true,
                institution: true,
            },
        });
    }
}
