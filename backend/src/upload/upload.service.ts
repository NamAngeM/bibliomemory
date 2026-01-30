import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION') || 'eu-west-1',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
    this.bucketName =
      this.configService.get('S3_BUCKET_NAME') || 'bibliomemory-documents';
  }

  // Validate PDF file
  validatePdf(file: Express.Multer.File): void {
    // Check MIME type
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    // Check magic bytes (PDF header)
    const pdfMagicBytes = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF
    if (!file.buffer.subarray(0, 4).equals(pdfMagicBytes)) {
      throw new BadRequestException('Invalid PDF file');
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 50MB limit');
    }
  }

  // Calculate file hash (SHA-256)
  calculateHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Generate S3 key for document
  generateS3Key(
    academicYear: string,
    cycle: string,
    institution: string,
    documentId: string,
  ): string {
    const sanitize = (str: string) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .substring(0, 50);

    return `documents/${academicYear}/${sanitize(cycle)}/${sanitize(institution)}/${documentId}.pdf`;
  }

  // Upload file to S3
  async uploadFile(
    file: Express.Multer.File,
    s3Key: string,
  ): Promise<{ s3Key: string; s3Bucket: string; fileHash: string }> {
    this.validatePdf(file);

    const fileHash = this.calculateHash(file.buffer);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
      Body: file.buffer,
      ContentType: 'application/pdf',
      ContentDisposition: 'inline',
      ServerSideEncryption: 'AES256',
      Metadata: {
        fileHash,
        uploadedAt: new Date().toISOString(),
      },
    });

    await this.s3Client.send(command);

    return {
      s3Key,
      s3Bucket: this.bucketName,
      fileHash,
    };
  }

  // Get presigned URL for reading
  async getPresignedUrl(s3Key: string): Promise<string> {
    const expiresIn = parseInt(
      this.configService.get('S3_PRESIGNED_URL_EXPIRES') || '3600',
      10,
    );

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
      ResponseContentType: 'application/pdf',
      ResponseContentDisposition: 'inline',
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  // Delete file from S3
  async deleteFile(s3Key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
    });

    await this.s3Client.send(command);
  }
}
