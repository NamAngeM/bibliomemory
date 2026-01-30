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
 * DTO pour la soumission/archivage de mémoire par un ÉTABLISSEMENT
 * L'établissement peut déposer des nouveaux mémoires ou archiver d'anciens
 */
export class SubmitByEstablishmentDto {
  // === Informations sur l'auteur ===
  @ApiProperty({ description: "Prénom de l'auteur", example: 'Marie' })
  @IsString()
  @MaxLength(100)
  authorFirstName: string;

  @ApiProperty({ description: "Nom de l'auteur", example: 'Dupont' })
  @IsString()
  @MaxLength(100)
  authorLastName: string;

  @ApiPropertyOptional({ description: "Email de l'auteur" })
  @IsOptional()
  @IsString()
  authorEmail?: string;

  @ApiPropertyOptional({
    description: "Promotion de l'auteur",
    example: '2023-2024',
  })
  @IsOptional()
  @IsString()
  promotion?: string;

  // === Informations sur le document ===
  @ApiProperty({ description: 'Titre du mémoire' })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  title: string;

  @ApiProperty({ description: 'Résumé du mémoire' })
  @IsString()
  @MinLength(50)
  @MaxLength(5000)
  abstract: string;

  @ApiProperty({ enum: DocumentType, description: 'Type de document' })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ description: 'Année académique', example: '2023-2024' })
  @IsString()
  academicYear: string;

  @ApiProperty({ description: 'Date de soutenance' })
  @IsDateString()
  defenseDate: string;

  // === Structure académique ===
  @ApiProperty({ description: 'ID de la faculté' })
  @IsString()
  facultyId: string;

  @ApiProperty({ description: 'ID du cycle' })
  @IsString()
  cycleId: string;

  @ApiProperty({ description: 'ID de la filière' })
  @IsString()
  fieldId: string;

  @ApiPropertyOptional({ description: 'Classe / Niveau' })
  @IsOptional()
  @IsString()
  className?: string;

  // === Encadrement ===
  @ApiProperty({ description: "ID de l'encadreur principal" })
  @IsString()
  mainSupervisorId: string;

  @ApiPropertyOptional({ description: 'ID du co-encadreur' })
  @IsOptional()
  @IsString()
  coSupervisorId?: string;

  // === Métadonnées ===
  @ApiProperty({ description: 'Mots-clés', type: [String] })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiPropertyOptional({ enum: Language, default: Language.FR })
  @IsOptional()
  @IsEnum(Language)
  language?: Language = Language.FR;

  // === Options spécifiques établissement ===
  @ApiPropertyOptional({
    description: 'Est-ce un ancien document à archiver?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isLegacyDocument?: boolean = false;

  @ApiPropertyOptional({
    description: 'Document confidentiel (sous embargo)?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isConfidential?: boolean = false;

  @ApiPropertyOptional({ description: "Date de fin d'embargo" })
  @IsOptional()
  @IsDateString()
  embargoUntil?: string;

  @ApiPropertyOptional({
    description: 'Enregistrer comme brouillon?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  saveAsDraft?: boolean = false;
}
