import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminSessionGuard } from '../admin-users/admin-session.guard';
import { HomeContentService } from './home-content.service';
import { HomeContentDocument, HomeContentDocumentKind } from './home-content.types';
import { DeleteEventCardDto, DeleteEventPdfDto, DeletePublicationCardDto, HomeContentDto } from './dto/home-content.dto';

type UploadedPdfFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@UseGuards(AdminSessionGuard)
@Controller('api/admin/home-content')
export class HomeContentAdminController {
  constructor(private readonly homeContentService: HomeContentService) {}

  @Get()
  getHomeContent() {
    return this.homeContentService.getAdminSnapshot();
  }

  @Put()
  updateHomeContent(@Body() content: HomeContentDto): Promise<{ message: string; content: HomeContentDocument }> {
    return this.homeContentService.updateHomeContent(content as HomeContentDocument);
  }

  @Post('publications/delete')
  deletePublicationCard(
    @Body() payload: DeletePublicationCardDto,
  ): Promise<{ message: string; content: HomeContentDocument }> {
    return this.homeContentService.deletePublicationCard(payload.index);
  }

  @Post('publications/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 12 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        const isPdf =
          file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
        callback(isPdf ? null : new BadRequestException('Only PDF files are allowed.'), isPdf);
      },
    }),
  )
  uploadPublicationPdf(
    @UploadedFile() file: UploadedPdfFile | undefined,
    @Body('index', ParseIntPipe) index: number,
    @Body('kind') kind: HomeContentDocumentKind,
  ): Promise<{ message: string; content: HomeContentDocument; href: string }> {
    if (!file) {
      throw new BadRequestException('Choose a PDF file to upload.');
    }

    if (kind !== 'question-bank' && kind !== 'other-docs') {
      throw new BadRequestException('Invalid document type.');
    }

    return this.homeContentService.uploadPublicationPdf(index, kind, file);
  }

  @Post('publications/upload-direct/init')
  createPublicationPdfUpload(
    @Body('index', ParseIntPipe) index: number,
    @Body('kind') kind: HomeContentDocumentKind,
    @Body('fileName') fileName: string,
  ): Promise<{ uploadUrl: string; storagePath: string }> {
    if (!fileName?.trim()) {
      throw new BadRequestException('File name is required.');
    }

    if (kind !== 'question-bank' && kind !== 'other-docs') {
      throw new BadRequestException('Invalid document type.');
    }

    return this.homeContentService.createPublicationPdfUpload(index, kind, fileName);
  }

  @Post('publications/upload-direct/finalize')
  finalizePublicationPdfUpload(
    @Body('index', ParseIntPipe) index: number,
    @Body('kind') kind: HomeContentDocumentKind,
    @Body('storagePath') storagePath: string,
    @Body('fileName') fileName: string,
  ): Promise<{ message: string; content: HomeContentDocument; href: string }> {
    if (!storagePath?.trim() || !fileName?.trim()) {
      throw new BadRequestException('storagePath and fileName are required.');
    }

    if (kind !== 'question-bank' && kind !== 'other-docs') {
      throw new BadRequestException('Invalid document type.');
    }

    return this.homeContentService.finalizePublicationPdfUpload(index, kind, storagePath, fileName);
  }

  @Post('events/image/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        const isAllowedImage = /^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.mimetype);
        callback(isAllowedImage ? null : new BadRequestException('Only JPG, PNG, WEBP, or GIF images are allowed.'), isAllowedImage);
      },
    }),
  )
  uploadEventImage(
    @UploadedFile() file: UploadedPdfFile | undefined,
    @Body('eventIndex', ParseIntPipe) eventIndex: number,
  ): Promise<{ message: string; content: HomeContentDocument; href: string }> {
    if (!file) {
      throw new BadRequestException('Choose an image file to upload.');
    }

    return this.homeContentService.uploadEventImage(eventIndex, file);
  }

  @Post('events/pdf/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 12 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        const isPdf =
          file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
        callback(isPdf ? null : new BadRequestException('Only PDF files are allowed.'), isPdf);
      },
    }),
  )
  uploadEventPdf(
    @UploadedFile() file: UploadedPdfFile | undefined,
    @Body('eventIndex', ParseIntPipe) eventIndex: number,
    @Body('pdfIndex', ParseIntPipe) pdfIndex: number,
  ): Promise<{ message: string; content: HomeContentDocument; href: string }> {
    if (!file) {
      throw new BadRequestException('Choose a PDF file to upload.');
    }

    return this.homeContentService.uploadEventPdf(eventIndex, pdfIndex, file);
  }

  @Post('events/pdf/upload-direct/init')
  createEventPdfUpload(
    @Body('eventIndex', ParseIntPipe) eventIndex: number,
    @Body('pdfIndex', ParseIntPipe) pdfIndex: number,
    @Body('fileName') fileName: string,
  ): Promise<{ uploadUrl: string; storagePath: string }> {
    if (!fileName?.trim()) {
      throw new BadRequestException('File name is required.');
    }

    return this.homeContentService.createEventPdfUpload(eventIndex, pdfIndex, fileName);
  }

  @Post('events/pdf/upload-direct/finalize')
  finalizeEventPdfUpload(
    @Body('eventIndex', ParseIntPipe) eventIndex: number,
    @Body('pdfIndex', ParseIntPipe) pdfIndex: number,
    @Body('storagePath') storagePath: string,
    @Body('fileName') fileName: string,
  ): Promise<{ message: string; content: HomeContentDocument; href: string }> {
    if (!storagePath?.trim() || !fileName?.trim()) {
      throw new BadRequestException('storagePath and fileName are required.');
    }

    return this.homeContentService.finalizeEventPdfUpload(eventIndex, pdfIndex, storagePath, fileName);
  }

  @Post('events/pdf/delete')
  deleteEventPdf(
    @Body() payload: DeleteEventPdfDto,
  ): Promise<{ message: string; content: HomeContentDocument }> {
    return this.homeContentService.deleteEventPdf(payload.eventIndex, payload.pdfIndex);
  }

  @Post('events/delete')
  deleteEventCard(
    @Body() payload: DeleteEventCardDto,
  ): Promise<{ message: string; content: HomeContentDocument }> {
    return this.homeContentService.deleteEventCard(payload.eventIndex);
  }
}
