import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType, Language } from '@prisma/client';

/**
 * DTO pour la soumission de mémoire par un ÉTUDIANT
 * L'étudiant soumet pour validation par son établissement
 */
export class SubmitByStudentDto {
  @ApiProperty({
    description: 'Titre du mémoire',
    example: "Application de l'IA dans le diagnostic médical",
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  title: string;

  @ApiProperty({
    description: 'Résumé du mémoire',
    example: 'Ce mémoire explore les applications...',
  })
  @IsString()
  @MinLength(100)
  @MaxLength(5000)
  abstract: string;

  @ApiProperty({ enum: DocumentType, description: 'Type de document' })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ description: 'Année académique', example: '2023-2024' })
  @IsString()
  academicYear: string;

  @ApiProperty({ description: 'Date de soutenance', example: '2024-06-15' })
  @IsDateString()
  defenseDate: string;

  @ApiProperty({ description: 'ID du cycle (Licence, Master, etc.)' })
  @IsString()
  cycleId: string;

  @ApiProperty({ description: 'ID de la filière' })
  @IsString()
  fieldId: string;

  @ApiPropertyOptional({ description: 'Classe / Niveau', example: 'Master 2' })
  @IsOptional()
  @IsString()
  className?: string;

  @ApiProperty({ description: "ID de l'encadreur principal" })
  @IsString()
  mainSupervisorId: string;

  @ApiPropertyOptional({ description: 'ID du co-encadreur' })
  @IsOptional()
  @IsString()
  coSupervisorId?: string;

  @ApiProperty({
    description: 'Mots-clés',
    example: ['intelligence artificielle', 'santé', 'diagnostic'],
  })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiPropertyOptional({ enum: Language, default: Language.FR })
  @IsOptional()
  @IsEnum(Language)
  language?: Language = Language.FR;
}
