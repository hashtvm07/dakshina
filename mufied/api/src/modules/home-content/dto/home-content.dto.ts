import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class FooterLinkDto {
  @IsString()
  label!: string;

  @IsString()
  href!: string;
}

class HomeContentStatDto {
  @IsString()
  value!: string;

  @IsString()
  label!: string;
}

class HomeContentLinkCardDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  href!: string;

  @IsString()
  ctaLabel!: string;

  @IsOptional()
  @IsIn(['question-bank', 'other-docs'])
  kind?: 'question-bank' | 'other-docs';

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

class HomeContentEventPdfDto {
  @IsString()
  title!: string;

  @IsString()
  href!: string;

  @IsString()
  ctaLabel!: string;
}

class HomeContentEventCardDto {
  @IsString()
  title!: string;

  @IsArray()
  @IsString({ each: true })
  descriptions!: string[];

  @IsString()
  image!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeContentEventPdfDto)
  pdfs!: HomeContentEventPdfDto[];
}

class HomeContentFooterCardDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  links?: FooterLinkDto[];
}

class HeroFloatingCardDto {
  @IsString()
  title!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  items!: string[];
}

class HeroFloatingCardsDto {
  @ValidateNested()
  @Type(() => HeroFloatingCardDto)
  primary!: HeroFloatingCardDto;

  @ValidateNested()
  @Type(() => HeroFloatingCardDto)
  secondary!: HeroFloatingCardDto;
}

class HeroDto {
  @IsString()
  bannerImage!: string;

  @IsString()
  logoImage!: string;

  @IsString()
  eyebrow!: string;

  @IsString()
  title!: string;

  @IsString()
  subtitle!: string;

  @IsString()
  primaryActionLabel!: string;

  @IsString()
  primaryActionHref!: string;

  @IsString()
  secondaryActionLabel!: string;

  @IsString()
  secondaryActionHref!: string;

  @IsString()
  badgeText!: string;

  @ValidateNested()
  @Type(() => HeroFloatingCardsDto)
  floatingCards!: HeroFloatingCardsDto;
}

class IntroDto {
  @IsString()
  image!: string;

  @IsString()
  label!: string;

  @IsString()
  title!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  paragraphs!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HomeContentStatDto)
  stats!: HomeContentStatDto[];
}

class ArticleSectionDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;
}

class Article2Dto {
  @ValidateNested()
  @Type(() => ArticleSectionDto)
  section1!: ArticleSectionDto;

  @ValidateNested()
  @Type(() => ArticleSectionDto)
  section2!: ArticleSectionDto;

  @ValidateNested()
  @Type(() => ArticleSectionDto)
  section3!: ArticleSectionDto;

  @ValidateNested()
  @Type(() => ArticleSectionDto)
  section4!: ArticleSectionDto;
}

class Article1Dto {
  @ValidateNested()
  @Type(() => ArticleSectionDto)
  section1!: ArticleSectionDto;

  @ValidateNested()
  @Type(() => ArticleSectionDto)
  section2!: ArticleSectionDto;
}

class LinkSectionDto {
  @IsString()
  label!: string;

  @IsString()
  title!: string;

  @IsString()
  subtitle!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeContentLinkCardDto)
  cards!: HomeContentLinkCardDto[];
}

class EventsSectionDto {
  @IsString()
  label!: string;

  @IsString()
  title!: string;

  @IsString()
  subtitle!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeContentEventCardDto)
  cards!: HomeContentEventCardDto[];
}

class HallTicketDto {
  @IsString()
  title1!: string;

  @IsString()
  title2!: string;

  @IsString()
  footerLine1!: string;

  @IsString()
  footerLine2!: string;

  @IsString()
  footerLine3!: string;

  @IsString()
  footerLine4!: string;

  @IsString()
  footerLine5!: string;

  @IsBoolean()
  showExamResultMenu!: boolean;
}

class AdmissionProcessDto {
  @IsString()
  label!: string;

  @IsString()
  title!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  items!: string[];

  @IsString()
  primaryActionLabel!: string;

  @IsString()
  primaryActionHref!: string;

  @IsString()
  secondaryActionLabel!: string;

  @IsString()
  secondaryActionHref!: string;
}

class AdmissionCampusDto {
  @IsString()
  label!: string;

  @IsString()
  title!: string;

  @IsString()
  paragraph1!: string;

  @IsString()
  paragraph2!: string;

  @IsString()
  authorityEmail!: string;
}

class AdmissionDto {
  @ValidateNested()
  @Type(() => AdmissionProcessDto)
  process!: AdmissionProcessDto;

  @ValidateNested()
  @Type(() => AdmissionCampusDto)
  campus!: AdmissionCampusDto;
}

class FooterDto {
  @IsString()
  logoImage!: string;

  @IsString()
  label!: string;

  @IsString()
  title!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HomeContentFooterCardDto)
  cards!: HomeContentFooterCardDto[];
}

export class DeletePublicationCardDto {
  @IsInt()
  @Min(0)
  index!: number;
}

export class DeleteEventPdfDto {
  @IsInt()
  @Min(0)
  eventIndex!: number;

  @IsInt()
  @Min(0)
  pdfIndex!: number;
}

export class DeleteEventCardDto {
  @IsInt()
  @Min(0)
  eventIndex!: number;
}

export class HomeContentDto {
  @ValidateNested()
  @Type(() => HeroDto)
  hero!: HeroDto;

  @ValidateNested()
  @Type(() => IntroDto)
  intro!: IntroDto;

  @ValidateNested()
  @Type(() => Article1Dto)
  article1!: Article1Dto;

  @ValidateNested()
  @Type(() => Article2Dto)
  article2!: Article2Dto;

  @ValidateNested()
  @Type(() => LinkSectionDto)
  programmes!: LinkSectionDto;

  @ValidateNested()
  @Type(() => EventsSectionDto)
  events!: EventsSectionDto;

  @ValidateNested()
  @Type(() => AdmissionDto)
  admission!: AdmissionDto;

  @ValidateNested()
  @Type(() => LinkSectionDto)
  publications!: LinkSectionDto;

  @ValidateNested()
  @Type(() => HallTicketDto)
  hallTicket!: HallTicketDto;

  @ValidateNested()
  @Type(() => FooterDto)
  footer!: FooterDto;
}
