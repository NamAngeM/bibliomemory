import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole } from '@prisma/client';
import { CreateInstitutionDto } from './dto';

@ApiTags('Metadata')
@Controller('metadata')
export class MetadataController {
    constructor(private readonly prisma: PrismaService) { }

    @Get('institutions')
    @ApiOperation({ summary: 'Get all institutions' })
    async getInstitutions() {
        return this.prisma.institution.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true, acronym: true, city: true, country: true },
        });
    }

    @Post('institutions')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.PLATFORM_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new institution (Admin)' })
    async createInstitution(@Body() dto: CreateInstitutionDto) {
        return this.prisma.institution.create({
            data: dto,
        });
    }

    @Put('institutions/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.PLATFORM_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an institution (Admin)' })
    async updateInstitution(@Param('id') id: string, @Body() dto: CreateInstitutionDto) {
        return this.prisma.institution.update({
            where: { id },
            data: dto,
        });
    }

    @Delete('institutions/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.PLATFORM_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete an institution (Admin)' })
    async deleteInstitution(@Param('id') id: string) {
        return this.prisma.institution.delete({
            where: { id },
        });
    }

    @Get('cycles')
    @ApiOperation({ summary: 'Get all academic cycles' })
    async getCycles() {
        return this.prisma.cycle.findMany({
            orderBy: { level: 'asc' },
        });
    }

    @Get('fields')
    @ApiOperation({ summary: 'Get all fields/specialties' })
    async getFields() {
        return this.prisma.field.findMany({
            orderBy: { name: 'asc' },
            include: { faculty: true },
        });
    }

    @Get('institutions/:id/faculties')
    @ApiOperation({ summary: 'Get faculties for a specific institution' })
    async getFaculties(@Param('id') id: string) {
        return this.prisma.faculty.findMany({
            where: { institutionId: id },
            orderBy: { name: 'asc' },
        });
    }

    @Get('supervisors')
    @ApiOperation({ summary: 'Get all supervisors' })
    async getSupervisors() {
        return this.prisma.supervisor.findMany({
            orderBy: { lastName: 'asc' },
            select: { id: true, firstName: true, lastName: true, title: true },
        });
    }
}
