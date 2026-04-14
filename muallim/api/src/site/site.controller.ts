import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateContentBlockDto } from './dto/create-content-block.dto';
import { CreateMediaAssetDto } from './dto/create-media-asset.dto';
import { UpdateContentBlockDto } from './dto/update-content-block.dto';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteService } from './site.service';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('public')
  getPublicSitePayload() {
    return this.siteService.getPublicSitePayload();
  }

  @Get('settings')
  getSettings() {
    return this.siteService.getSettings();
  }

  @Put('settings')
  updateSettings(@Body() dto: UpdateSiteSettingsDto) {
    return this.siteService.updateSettings(dto);
  }

  @Get('content-blocks')
  listContentBlocks() {
    return this.siteService.listContentBlocks();
  }

  @Post('content-blocks')
  createContentBlock(@Body() dto: CreateContentBlockDto) {
    return this.siteService.createContentBlock(dto);
  }

  @Put('content-blocks/:id')
  updateContentBlock(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContentBlockDto) {
    return this.siteService.updateContentBlock(id, dto);
  }

  @Delete('content-blocks/:id')
  removeContentBlock(@Param('id', ParseIntPipe) id: number) {
    return this.siteService.removeContentBlock(id);
  }

  @Get('media-assets')
  listMediaAssets() {
    return this.siteService.listMediaAssets();
  }

  @Post('media-assets')
  createMediaAsset(@Body() dto: CreateMediaAssetDto) {
    return this.siteService.createMediaAsset(dto);
  }

  @Put('media-assets/:id')
  updateMediaAsset(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMediaAssetDto) {
    return this.siteService.updateMediaAsset(id, dto);
  }

  @Delete('media-assets/:id')
  removeMediaAsset(@Param('id', ParseIntPipe) id: number) {
    return this.siteService.removeMediaAsset(id);
  }
}
