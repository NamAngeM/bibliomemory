import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInstitutionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    acronym: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    website?: string;
}
