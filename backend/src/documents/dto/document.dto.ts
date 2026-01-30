import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
  MinLength,
  MaxLength,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType, Language, DocumentStatus } from '@prisma/client';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Title of the document', maxLength: 500 })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  title: string;

  @ApiProperty({
    description: 'Abstract/Summary of the document',
    minLength: 100,
    maxLength: 5000,
  })
  @IsString()
  @MinLength(100)
  @MaxLength(5000)
  abstract: string;

  @ApiProperty({ enum: Language, default: Language.FR })
  @IsEnum(Language)
  language: Language;

  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ description: 'Academic year (e.g., 2023-2024)' })
  @IsString()
  academicYear: string;

  @ApiProperty({ description: 'Defense date' })
  @IsDateString()
  defenseDate: string;

  @ApiProperty({ description: 'Author ID' })
  @IsUUID()
  authorId: string;

  @ApiProperty({ description: 'Institution ID' })
  @IsUUID()
  institutionId: string;

  @ApiProperty({ description: 'Faculty ID' })
  @IsUUID()
  facultyId: string;

  @ApiProperty({ description: 'Field/Specialty ID' })
  @IsUUID()
  fieldId: string;

  @ApiProperty({ description: 'Cycle ID (Licence, Master, Doctorat, etc.)' })
  @IsUUID()
  cycleId: string;

  @ApiProperty({ description: 'Main supervisor ID' })
  @IsUUID()
  mainSupervisorId: string;

  @ApiPropertyOptional({ description: 'Co-supervisor ID' })
  @IsOptional()
  @IsUUID()
  coSupervisorId?: string;

  @ApiProperty({ description: 'Keywords (3-10)', type: [String] })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiPropertyOptional({ description: 'Is the document confidential?' })
  @IsOptional()
  @IsBoolean()
  isConfidential?: boolean;

  @ApiPropertyOptional({ description: 'Embargo end date (if confidential)' })
  @IsOptional()
  @IsDateString()
  embargoUntil?: string;
}

export class UpdateDocumentDto {
  @ApiPropertyOptional({ description: 'Title of the document', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional({ description: 'Abstract/Summary of the document' })
  @IsOptional()
  @IsString()
  @MinLength(100)
  @MaxLength(5000)
  abstract?: string;

  @ApiPropertyOptional({ enum: Language })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional({ enum: DocumentType })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({ description: 'Academic year' })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({ description: 'Defense date' })
  @IsOptional()
  @IsDateString()
  defenseDate?: string;

  @ApiPropertyOptional({ description: 'Keywords', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ enum: DocumentStatus })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional({ description: 'Rejection reason' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class SearchDocumentsDto {
  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Filter by cycle ID' })
  @IsOptional()
  @IsUUID()
  cycleId?: string;

  @ApiPropertyOptional({ description: 'Filter by field ID' })
  @IsOptional()
  @IsUUID()
  fieldId?: string;

  @ApiPropertyOptional({ description: 'Filter by institution ID' })
  @IsOptional()
  @IsUUID()
  institutionId?: string;

  @ApiPropertyOptional({ description: 'Filter by academic year' })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({ enum: Language })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional({ enum: DocumentType })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['relevance', 'date', 'views', 'title'],
  })
  @IsOptional()
  @IsString()
  sortBy?: 'relevance' | 'date' | 'views' | 'title';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
