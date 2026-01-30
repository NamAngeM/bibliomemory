import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Ip,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  SearchDocumentsDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { DocumentStatus, UserRole } from '@prisma/client';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  // ========== PUBLIC ENDPOINTS ==========

  @Get()
  @ApiOperation({ summary: 'Get all approved documents with filters' })
  @ApiResponse({ status: 200, description: 'List of documents' })
  async findAll(@Query() searchDto: SearchDocumentsDto) {
    return this.documentsService.findAllPublic(searchDto);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent documents' })
  async getRecent() {
    return this.documentsService.findAllPublic({
      sortBy: 'date',
      sortOrder: 'desc',
      limit: 10,
    });
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular documents' })
  async getPopular() {
    return this.documentsService.findAllPublic({
      sortBy: 'views',
      sortOrder: 'desc',
      limit: 10,
    });
  }

  @Get('statistics/public')
  @ApiOperation({ summary: 'Get public statistics' })
  async getPublicStats() {
    const stats = await this.documentsService.getStatistics();
    return {
      totalDocuments: stats.approvedDocuments,
      totalViews: stats.totalViews,
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get document by slug' })
  @ApiResponse({ status: 200, description: 'Document details' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.documentsService.findBySlug(slug);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Record document view' })
  async recordView(
    @Param('id') id: string,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Headers('referer') referrer: string,
  ) {
    await this.documentsService.recordView(id, ip, userAgent, referrer);
    return { success: true };
  }

  // ========== ADMIN ENDPOINTS ==========

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all documents (admin)' })
  async findAllAdmin(@Query('status') status?: DocumentStatus) {
    return this.documentsService.findAllAdmin(status);
  }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending documents (admin)' })
  async findPending() {
    return this.documentsService.findAllAdmin(
      DocumentStatus.SUBMITTED_BY_STUDENT,
    );
  }

  @Get('admin/statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin statistics' })
  async getAdminStats() {
    return this.documentsService.getStatistics();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get document by ID (admin)' })
  async findById(@Param('id') id: string) {
    return this.documentsService.findByIdAdmin(id);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update document (admin)' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDto);
  }

  @Post('admin/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve document (admin)' })
  async approve(@Param('id') id: string, @Request() req: any) {
    return this.documentsService.approve(id, req.user.id);
  }

  @Post('admin/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject document (admin)' })
  async reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.documentsService.reject(id, reason);
  }

  @Post('admin/:id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive document (admin)' })
  async archive(@Param('id') id: string) {
    return this.documentsService.archive(id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete document (admin)' })
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
