import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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
  ApiBody,
} from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { SubmitByStudentDto, SubmitByEstablishmentDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole } from '@prisma/client';
import { UploadService } from '../upload/upload.service';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Workflow')
@Controller('workflow')
export class WorkflowController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService,
  ) { }

  // ========== STUDENT ENDPOINTS ==========

  @Post('student/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Submit a document as a student' })
  async submitAsStudent(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: SubmitByStudentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    this.uploadService.validatePdf(file);

    // Get student profile
    const student = await this.prisma.student.findUnique({
      where: { userId: req.user.id },
      include: { user: true },
    });

    if (!student) {
      throw new BadRequestException(
        'Student profile not found. Please complete your profile first.',
      );
    }

    // Get cycle for S3 path
    const cycle = await this.prisma.cycle.findUnique({
      where: { id: dto.cycleId },
    });
    const institution = await this.prisma.institution.findUnique({
      where: { id: student.user.institutionId! },
    });

    if (!cycle || !institution) {
      throw new BadRequestException('Invalid cycle or institution');
    }

    const s3Key = this.uploadService.generateS3Key(
      dto.academicYear,
      cycle.name,
      institution.name,
      student.id,
    );

    const { s3Bucket, fileHash } = await this.uploadService.uploadFile(
      file,
      s3Key,
    );

    return this.workflowService.submitByStudent(dto, student.id, {
      fileName: file.originalname,
      fileSize: file.size,
      fileHash,
      s3Key,
      s3Bucket,
    });
  }

  @Get('student/my-documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get documents submitted by the current student' })
  async getMyDocuments(@Request() req: AuthenticatedRequest) {
    return this.workflowService.getStudentDocuments(req.user.id);
  }

  // ========== ESTABLISHMENT ENDPOINTS ==========

  @Post('establishment/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ESTABLISHMENT)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Submit/archive a document as an establishment' })
  async submitAsEstablishment(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: SubmitByEstablishmentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    this.uploadService.validatePdf(file);

    // Get cycle and institution for S3 path
    const cycle = await this.prisma.cycle.findUnique({
      where: { id: dto.cycleId },
    });
    const institution = await this.prisma.institution.findUnique({
      where: { id: req.user.institutionId },
    });

    if (!cycle || !institution) {
      throw new BadRequestException('Invalid cycle or institution');
    }

    const documentId = req.user.id + Date.now();
    const s3Key = this.uploadService.generateS3Key(
      dto.academicYear,
      cycle.name,
      institution.name,
      documentId,
    );

    const { s3Bucket, fileHash } = await this.uploadService.uploadFile(
      file,
      s3Key,
    );

    return this.workflowService.submitByEstablishment(
      dto,
      {
        id: req.user.id,
        role: req.user.role,
        institutionId: req.user.institutionId,
      },
      {
        fileName: file.originalname,
        fileSize: file.size,
        fileHash,
        s3Key,
        s3Bucket,
      },
    );
  }

  @Get('establishment/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ESTABLISHMENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending documents for validation' })
  async getPendingDocuments(@Request() req: AuthenticatedRequest) {
    if (!req.user.institutionId) {
      throw new BadRequestException('User must be linked to an institution');
    }
    return this.workflowService.getPendingForEstablishment(
      req.user.institutionId,
    );
  }

  @Post('establishment/:id/validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ESTABLISHMENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate a document' })
  async validateDocument(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.workflowService.validateDocument(id, req.user.id);
  }

  @Post('establishment/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ESTABLISHMENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a document' })
  @ApiBody({ schema: { properties: { reason: { type: 'string' } } } })
  async rejectDocument(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!reason) {
      throw new BadRequestException('Rejection reason is required');
    }
    return this.workflowService.rejectDocument(id, reason, req.user.id);
  }

  // ========== ADMIN ENDPOINTS ==========

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all documents (admin)' })
  async getAllDocuments() {
    return this.workflowService.getAllForAdmin();
  }

  @Get('admin/validated')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get validated documents awaiting publication' })
  async getValidatedDocuments() {
    return this.workflowService.getAllForAdmin(
      (UserRole.ESTABLISHMENT as any) === 'VALIDATED'
        ? undefined
        : ('VALIDATED' as any),
    );
  }

  @Post('admin/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a validated document' })
  async publishDocument(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.workflowService.publishDocument(id, req.user.id);
  }
}
