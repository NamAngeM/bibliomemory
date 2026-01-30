import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  SearchDocumentsDto,
} from './dto';
import { DocumentStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) { }

  // Helper to generate slug from title
  private generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single
      .substring(0, 100);

    return `${baseSlug}-${randomUUID().substring(0, 8)}`;
  }

  // Get all approved documents for public view
  async findAllPublic(searchDto: SearchDocumentsDto) {
    const {
      query,
      cycleId,
      fieldId,
      institutionId,
      academicYear,
      language,
      documentType,
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc',
    } = searchDto;

    const skip = (page - 1) * limit;

    const where: Prisma.DocumentWhereInput = {
      status: DocumentStatus.PUBLISHED,
      isConfidential: false,
      OR: [{ embargoUntil: null }, { embargoUntil: { lte: new Date() } }],
    };

    // Apply filters
    if (cycleId) where.cycleId = cycleId;
    if (fieldId) where.fieldId = fieldId;
    if (institutionId) where.institutionId = institutionId;
    if (academicYear) where.academicYear = academicYear;
    if (language) where.language = language;
    if (documentType) where.documentType = documentType;

    // Apply text search if query provided
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { abstract: { contains: query, mode: 'insensitive' } },
        {
          keywords: {
            some: {
              keyword: {
                keyword: { contains: query, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    // Determine sort order
    let orderBy: Prisma.DocumentOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'date':
        orderBy = { defenseDate: sortOrder };
        break;
      case 'views':
        orderBy = { viewCount: sortOrder };
        break;
      case 'title':
        orderBy = { title: sortOrder };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: true,
          cycle: true,
          field: true,
          institution: true,
          keywords: {
            include: { keyword: true },
          },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      data: documents.map((doc) => ({
        ...doc,
        keywords: doc.keywords.map((k) => k.keyword.keyword),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get document by slug (public)
  async findBySlug(slug: string) {
    const document = await this.prisma.document.findUnique({
      where: { slug },
      include: {
        author: true,
        cycle: true,
        field: true,
        faculty: true,
        institution: true,
        mainSupervisor: true,
        coSupervisor: true,
        keywords: {
          include: { keyword: true },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.status !== DocumentStatus.PUBLISHED) {
      throw new NotFoundException('Document not available');
    }

    // Check embargo
    if (
      document.isConfidential &&
      document.embargoUntil &&
      document.embargoUntil > new Date()
    ) {
      throw new NotFoundException('Document under embargo');
    }

    return {
      ...document,
      keywords: document.keywords.map((k) => k.keyword.keyword),
    };
  }

  // Get document by ID (public)
  async findById(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        author: true,
        cycle: true,
        field: true,
        faculty: true,
        institution: true,
        mainSupervisor: true,
        coSupervisor: true,
        keywords: {
          include: { keyword: true },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.status !== DocumentStatus.PUBLISHED) {
      throw new NotFoundException('Document not available');
    }

    // Check embargo
    if (
      document.isConfidential &&
      document.embargoUntil &&
      document.embargoUntil > new Date()
    ) {
      throw new NotFoundException('Document under embargo');
    }

    return {
      ...document,
      keywords: document.keywords.map((k) => k.keyword.keyword),
    };
  }

  // Record a view
  async recordView(
    documentId: string,
    viewerIp?: string,
    userAgent?: string,
    referrer?: string,
  ) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || document.status !== DocumentStatus.PUBLISHED) {
      return;
    }

    // Update view count and record view
    await this.prisma.$transaction([
      this.prisma.document.update({
        where: { id: documentId },
        data: {
          viewCount: { increment: 1 },
          lastViewedAt: new Date(),
        },
      }),
      this.prisma.documentView.create({
        data: {
          documentId,
          viewerIp,
          userAgent,
          referrer,
        },
      }),
    ]);
  }

  // ========== ADMIN METHODS ==========

  // Get all documents (admin)
  async findAllAdmin(status?: DocumentStatus) {
    const where: Prisma.DocumentWhereInput = {};
    if (status) where.status = status;

    const documents = await this.prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        cycle: true,
        field: true,
        institution: true,
        uploadedByUser: {
          select: { firstName: true, lastName: true, email: true },
        },
        validatedByUser: {
          select: { firstName: true, lastName: true, email: true },
        },
        keywords: {
          include: { keyword: true },
        },
      },
    });

    return documents.map((doc) => ({
      ...doc,
      keywords: doc.keywords.map((k) => k.keyword.keyword),
    }));
  }

  // Get document by ID (admin)
  async findByIdAdmin(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        author: true,
        cycle: true,
        field: true,
        institution: true,
        uploadedByUser: {
          select: { firstName: true, lastName: true, email: true },
        },
        validatedByUser: {
          select: { firstName: true, lastName: true, email: true },
        },
        keywords: {
          include: { keyword: true },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return {
      ...document,
      keywords: document.keywords.map((k) => k.keyword.keyword),
    };
  }

  // Create document (admin)
  async create(
    createDto: CreateDocumentDto,
    uploadedBy: string,
    fileInfo: {
      fileName: string;
      fileSize: number;
      fileHash: string;
      s3Key: string;
      s3Bucket: string;
      pageCount?: number;
    },
  ) {
    const slug = this.generateSlug(createDto.title);

    // Check for duplicate file hash
    const existingDoc = await this.prisma.document.findUnique({
      where: { fileHash: fileInfo.fileHash },
    });

    if (existingDoc) {
      throw new BadRequestException('This document has already been uploaded');
    }

    // Create or find keywords
    const keywordRecords = await Promise.all(
      createDto.keywords.map(async (kw) => {
        const slug = kw.toLowerCase().replace(/\s+/g, '-');
        return this.prisma.keyword.upsert({
          where: { keyword: kw.toLowerCase() },
          create: { keyword: kw.toLowerCase(), slug },
          update: { usageCount: { increment: 1 } },
        });
      }),
    );

    const document = await this.prisma.document.create({
      data: {
        title: createDto.title,
        slug,
        abstract: createDto.abstract,
        language: createDto.language,
        documentType: createDto.documentType,
        academicYear: createDto.academicYear,
        defenseDate: new Date(createDto.defenseDate),
        authorId: createDto.authorId,
        institutionId: createDto.institutionId,
        facultyId: createDto.facultyId,
        fieldId: createDto.fieldId,
        cycleId: createDto.cycleId,
        mainSupervisorId: createDto.mainSupervisorId,
        coSupervisorId: createDto.coSupervisorId,
        isConfidential: createDto.isConfidential || false,
        embargoUntil: createDto.embargoUntil
          ? new Date(createDto.embargoUntil)
          : null,
        fileName: fileInfo.fileName,
        fileSize: BigInt(fileInfo.fileSize),
        fileHash: fileInfo.fileHash,
        s3Key: fileInfo.s3Key,
        s3Bucket: fileInfo.s3Bucket,
        pageCount: fileInfo.pageCount,
        uploadedBy,
        status: DocumentStatus.DRAFT,
        keywords: {
          create: keywordRecords.map((k) => ({
            keywordId: k.id,
          })),
        },
      },
      include: {
        author: true,
        cycle: true,
        field: true,
        institution: true,
        keywords: {
          include: { keyword: true },
        },
      },
    });

    return {
      ...document,
      keywords: document.keywords.map((k) => k.keyword.keyword),
    };
  }

  // Update document (admin)
  async update(id: string, updateDto: UpdateDocumentDto) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const updateData: Prisma.DocumentUpdateInput = {};

    if (updateDto.title) {
      updateData.title = updateDto.title;
      updateData.slug = this.generateSlug(updateDto.title);
    }
    if (updateDto.abstract) updateData.abstract = updateDto.abstract;
    if (updateDto.language) updateData.language = updateDto.language;
    if (updateDto.documentType)
      updateData.documentType = updateDto.documentType;
    if (updateDto.academicYear)
      updateData.academicYear = updateDto.academicYear;
    if (updateDto.defenseDate)
      updateData.defenseDate = new Date(updateDto.defenseDate);
    if (updateDto.status) updateData.status = updateDto.status;
    if (updateDto.rejectionReason)
      updateData.rejectionReason = updateDto.rejectionReason;

    // Handle keywords update
    if (updateDto.keywords) {
      // Delete existing keywords
      await this.prisma.documentKeyword.deleteMany({
        where: { documentId: id },
      });

      // Create or find new keywords
      const keywordRecords = await Promise.all(
        updateDto.keywords.map(async (kw) => {
          const slug = kw.toLowerCase().replace(/\s+/g, '-');
          return this.prisma.keyword.upsert({
            where: { keyword: kw.toLowerCase() },
            create: { keyword: kw.toLowerCase(), slug },
            update: { usageCount: { increment: 1 } },
          });
        }),
      );

      // Add new keyword relations
      await this.prisma.documentKeyword.createMany({
        data: keywordRecords.map((k) => ({
          documentId: id,
          keywordId: k.id,
        })),
      });
    }

    return this.prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        cycle: true,
        field: true,
        institution: true,
        keywords: {
          include: { keyword: true },
        },
      },
    });
  }

  // Approve document (admin)
  async approve(id: string, publishedBy: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.PUBLISHED,
        publishedBy,
        publishedAt: new Date(),
      },
    });
  }

  // Reject document (admin)
  async reject(id: string, reason: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        status: DocumentStatus.REJECTED,
        rejectionReason: reason,
      },
    });
  }

  // Archive document (admin)
  async archive(id: string) {
    return this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.ARCHIVED },
    });
  }

  // Delete document (admin)
  async remove(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Soft delete by archiving
    return this.archive(id);
  }

  // Get statistics
  async getStatistics() {
    const [
      totalDocuments,
      approvedDocuments,
      pendingDocuments,
      totalViews,
      topViewed,
      recentDocuments,
      documentsByStatus,
      documentsByCycle,
    ] = await Promise.all([
      this.prisma.document.count(),
      this.prisma.document.count({
        where: { status: DocumentStatus.PUBLISHED },
      }),
      this.prisma.document.count({
        where: { status: DocumentStatus.SUBMITTED_BY_STUDENT },
      }),
      this.prisma.document.aggregate({ _sum: { viewCount: true } }),
      this.prisma.document.findMany({
        where: { status: DocumentStatus.PUBLISHED },
        orderBy: { viewCount: 'desc' },
        take: 10,
        include: {
          author: true,
          cycle: true,
        },
      }),
      this.prisma.document.findMany({
        where: { status: DocumentStatus.PUBLISHED },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          author: true,
          cycle: true,
        },
      }),
      this.prisma.document.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.document.groupBy({
        by: ['cycleId'],
        where: { status: DocumentStatus.PUBLISHED },
        _count: { _all: true },
      }),
    ]);

    return {
      totalDocuments,
      approvedDocuments,
      pendingDocuments,
      totalViews: totalViews._sum.viewCount || 0,
      topViewed,
      recentDocuments,
      documentsByStatus,
      documentsByCycle,
    };
  }
}
