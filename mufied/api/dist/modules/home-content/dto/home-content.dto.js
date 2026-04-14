"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeContentDto = exports.DeleteEventCardDto = exports.DeleteEventPdfDto = exports.DeletePublicationCardDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class FooterLinkDto {
    label;
    href;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FooterLinkDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FooterLinkDto.prototype, "href", void 0);
class HomeContentStatDto {
    value;
    label;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentStatDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentStatDto.prototype, "label", void 0);
class HomeContentLinkCardDto {
    title;
    description;
    href;
    ctaLabel;
    kind;
    featured;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentLinkCardDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentLinkCardDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentLinkCardDto.prototype, "href", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentLinkCardDto.prototype, "ctaLabel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['question-bank', 'other-docs']),
    __metadata("design:type", String)
], HomeContentLinkCardDto.prototype, "kind", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HomeContentLinkCardDto.prototype, "featured", void 0);
class HomeContentEventPdfDto {
    title;
    href;
    ctaLabel;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentEventPdfDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentEventPdfDto.prototype, "href", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentEventPdfDto.prototype, "ctaLabel", void 0);
class HomeContentEventCardDto {
    title;
    descriptions;
    image;
    pdfs;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentEventCardDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HomeContentEventCardDto.prototype, "descriptions", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentEventCardDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HomeContentEventPdfDto),
    __metadata("design:type", Array)
], HomeContentEventCardDto.prototype, "pdfs", void 0);
class HomeContentFooterCardDto {
    title;
    description;
    links;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentFooterCardDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HomeContentFooterCardDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FooterLinkDto),
    __metadata("design:type", Array)
], HomeContentFooterCardDto.prototype, "links", void 0);
class HeroFloatingCardDto {
    title;
    items;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroFloatingCardDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HeroFloatingCardDto.prototype, "items", void 0);
class HeroFloatingCardsDto {
    primary;
    secondary;
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HeroFloatingCardDto),
    __metadata("design:type", HeroFloatingCardDto)
], HeroFloatingCardsDto.prototype, "primary", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HeroFloatingCardDto),
    __metadata("design:type", HeroFloatingCardDto)
], HeroFloatingCardsDto.prototype, "secondary", void 0);
class HeroDto {
    bannerImage;
    logoImage;
    eyebrow;
    title;
    subtitle;
    primaryActionLabel;
    primaryActionHref;
    secondaryActionLabel;
    secondaryActionHref;
    badgeText;
    floatingCards;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "bannerImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "logoImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "eyebrow", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "subtitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "primaryActionLabel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "primaryActionHref", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "secondaryActionLabel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "secondaryActionHref", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroDto.prototype, "badgeText", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HeroFloatingCardsDto),
    __metadata("design:type", HeroFloatingCardsDto)
], HeroDto.prototype, "floatingCards", void 0);
class IntroDto {
    image;
    label;
    title;
    paragraphs;
    stats;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IntroDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IntroDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IntroDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], IntroDto.prototype, "paragraphs", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HomeContentStatDto),
    __metadata("design:type", Array)
], IntroDto.prototype, "stats", void 0);
class ArticleSectionDto {
    title;
    description;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArticleSectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArticleSectionDto.prototype, "description", void 0);
class Article2Dto {
    section1;
    section2;
    section3;
    section4;
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ArticleSectionDto),
    __metadata("design:type", ArticleSectionDto)
], Article2Dto.prototype, "section1", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ArticleSectionDto),
    __metadata("design:type", ArticleSectionDto)
], Article2Dto.prototype, "section2", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ArticleSectionDto),
    __metadata("design:type", ArticleSectionDto)
], Article2Dto.prototype, "section3", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ArticleSectionDto),
    __metadata("design:type", ArticleSectionDto)
], Article2Dto.prototype, "section4", void 0);
class Article1Dto {
    section1;
    section2;
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ArticleSectionDto),
    __metadata("design:type", ArticleSectionDto)
], Article1Dto.prototype, "section1", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ArticleSectionDto),
    __metadata("design:type", ArticleSectionDto)
], Article1Dto.prototype, "section2", void 0);
class LinkSectionDto {
    label;
    title;
    subtitle;
    cards;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkSectionDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkSectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkSectionDto.prototype, "subtitle", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HomeContentLinkCardDto),
    __metadata("design:type", Array)
], LinkSectionDto.prototype, "cards", void 0);
class EventsSectionDto {
    label;
    title;
    subtitle;
    cards;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventsSectionDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventsSectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventsSectionDto.prototype, "subtitle", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HomeContentEventCardDto),
    __metadata("design:type", Array)
], EventsSectionDto.prototype, "cards", void 0);
class HallTicketDto {
    title1;
    title2;
    footerLine1;
    footerLine2;
    footerLine3;
    footerLine4;
    footerLine5;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HallTicketDto.prototype, "title1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HallTicketDto.prototype, "title2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HallTicketDto.prototype, "footerLine1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HallTicketDto.prototype, "footerLine2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HallTicketDto.prototype, "footerLine3", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HallTicketDto.prototype, "footerLine4", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HallTicketDto.prototype, "footerLine5", void 0);
class AdmissionProcessDto {
    label;
    title;
    items;
    primaryActionLabel;
    primaryActionHref;
    secondaryActionLabel;
    secondaryActionHref;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionProcessDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionProcessDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AdmissionProcessDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionProcessDto.prototype, "primaryActionLabel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionProcessDto.prototype, "primaryActionHref", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionProcessDto.prototype, "secondaryActionLabel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionProcessDto.prototype, "secondaryActionHref", void 0);
class AdmissionCampusDto {
    label;
    title;
    paragraph1;
    paragraph2;
    authorityEmail;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionCampusDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionCampusDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionCampusDto.prototype, "paragraph1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionCampusDto.prototype, "paragraph2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdmissionCampusDto.prototype, "authorityEmail", void 0);
class AdmissionDto {
    process;
    campus;
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AdmissionProcessDto),
    __metadata("design:type", AdmissionProcessDto)
], AdmissionDto.prototype, "process", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AdmissionCampusDto),
    __metadata("design:type", AdmissionCampusDto)
], AdmissionDto.prototype, "campus", void 0);
class FooterDto {
    logoImage;
    label;
    title;
    cards;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FooterDto.prototype, "logoImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FooterDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FooterDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HomeContentFooterCardDto),
    __metadata("design:type", Array)
], FooterDto.prototype, "cards", void 0);
class DeletePublicationCardDto {
    index;
}
exports.DeletePublicationCardDto = DeletePublicationCardDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DeletePublicationCardDto.prototype, "index", void 0);
class DeleteEventPdfDto {
    eventIndex;
    pdfIndex;
}
exports.DeleteEventPdfDto = DeleteEventPdfDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DeleteEventPdfDto.prototype, "eventIndex", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DeleteEventPdfDto.prototype, "pdfIndex", void 0);
class DeleteEventCardDto {
    eventIndex;
}
exports.DeleteEventCardDto = DeleteEventCardDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], DeleteEventCardDto.prototype, "eventIndex", void 0);
class HomeContentDto {
    hero;
    intro;
    article1;
    article2;
    programmes;
    events;
    admission;
    publications;
    hallTicket;
    footer;
}
exports.HomeContentDto = HomeContentDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HeroDto),
    __metadata("design:type", HeroDto)
], HomeContentDto.prototype, "hero", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => IntroDto),
    __metadata("design:type", IntroDto)
], HomeContentDto.prototype, "intro", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Article1Dto),
    __metadata("design:type", Article1Dto)
], HomeContentDto.prototype, "article1", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Article2Dto),
    __metadata("design:type", Article2Dto)
], HomeContentDto.prototype, "article2", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LinkSectionDto),
    __metadata("design:type", LinkSectionDto)
], HomeContentDto.prototype, "programmes", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EventsSectionDto),
    __metadata("design:type", EventsSectionDto)
], HomeContentDto.prototype, "events", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AdmissionDto),
    __metadata("design:type", AdmissionDto)
], HomeContentDto.prototype, "admission", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LinkSectionDto),
    __metadata("design:type", LinkSectionDto)
], HomeContentDto.prototype, "publications", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HallTicketDto),
    __metadata("design:type", HallTicketDto)
], HomeContentDto.prototype, "hallTicket", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FooterDto),
    __metadata("design:type", FooterDto)
], HomeContentDto.prototype, "footer", void 0);
//# sourceMappingURL=home-content.dto.js.map