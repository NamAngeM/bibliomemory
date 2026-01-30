import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { DocumentsService } from '../documents/documents.service';
import { CreateDocumentDto } from '../documents/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly documentsService: DocumentsService,
    private readonly prisma: PrismaService,
  ) { }

  @Post('document')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new document' })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    // Validate PDF
    this.uploadService.validatePdf(file);

    // Get cycle and institution names for S3 path
    const [cycle, institution] = await Promise.all([
      this.prisma.cycle.findUnique({
        where: { id: createDocumentDto.cycleId },
      }),
      this.prisma.institution.findUnique({
        where: { id: createDocumentDto.institutionId },
      }),
    ]);

    if (!cycle || !institution) {
      throw new BadRequestException('Invalid cycle or institution');
    }

    const documentId = randomUUID();
    const s3Key = this.uploadService.generateS3Key(
      createDocumentDto.academicYear,
      cycle.name,
      institution.name,
      documentId,
    );

    // Upload to S3
    const { s3Bucket, fileHash } = await this.uploadService.uploadFile(
      file,
      s3Key,
    );

    // Create document in database
    const document = await this.documentsService.create(
      createDocumentDto,
      req.user.id,
      {
        fileName: file.originalname,
        fileSize: file.size,
        fileHash,
        s3Key,
        s3Bucket,
      },
    );

    return document;
  }

  @Get('presigned/:documentId')
  @ApiOperation({ summary: 'Get presigned URL for document reading (Secure)' })
  async getPresignedUrl(
    @Param('documentId') documentId: string,
    @Request() req: any, // Req can be authenticated or not
  ) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new BadRequestException('Document not found');
    }

    // Security Check
    let canAccess = false;

    // 1. If document is PUBLIC and PUBLISHED -> Allow
    if (
      document.status === 'PUBLISHED' && // Using strict string check since Enum might be lint-bugged
      !document.isConfidential
    ) {
      // Check Embargo
      if (!document.embargoUntil || document.embargoUntil <= new Date()) {
        canAccess = true;
      }
    }

    // 2. If not public access, check JWT User
    if (!canAccess) {
      // We need to extract the user from the request manually if the route is not Guarded globally
      // OR we rely on a permissive Guard that populates req.user if present
      // ideally, the frontend sends the token.

      // NOTE: Since this route was public, we can't easily enforce Guards without breaking anonymous access.
      // BUT standard JwtStrategy usually attaches user if valid token is present? 
      // No, only if Guard is used. 
      // We will assume that for PRIVATE documents, the user MUST Provide a token.
      // But we can't switch the Guard dynamically. 

      // WORKAROUND: We will throw Forbidden if not public.
      // Real secure implementation requires the user to access a DIFFERENT endpoint for private docs,
      // OR we use a "OptionalAuthGuard".

      // For urgency, we block access. The Dashboard uses a signed URL? 
      // If Dashboard uses this endpoint, it will fail for drafts.
      // Users must use the /workflow/student/my-documents logic which returns metadata, but the PDF usage?

      // FIX: If the document is NOT published, we REQUIRE the user to be authenticated.
      // Since we can't check req.user easily here without a Guard, we should probably 
      // return 403 Forbidden.

      // However, if we want to allow Students to preview their OWN drafts, we need a way.
      // Detailed Plan: 
      // For this iteration, we BLOCK everything except PUBLISHED docs on this endpoint.
      // We advise the user to use a secure endpoint for drafts.

      throw new BadRequestException('Document not available for public access.');
    }

    const url = await this.uploadService.getPresignedUrl(document.s3Key);

    return { url, expiresIn: 3600 };
  }
}
