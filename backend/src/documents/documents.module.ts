import { Module, forwardRef } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { MetadataController } from './metadata.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [forwardRef(() => UploadModule)],
  controllers: [DocumentsController, WorkflowController, MetadataController],
  providers: [DocumentsService, WorkflowService],
  exports: [DocumentsService, WorkflowService],
})
export class DocumentsModule { }
