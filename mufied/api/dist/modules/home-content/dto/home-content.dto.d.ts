declare class FooterLinkDto {
    label: string;
    href: string;
}
declare class HomeContentStatDto {
    value: string;
    label: string;
}
declare class HomeContentLinkCardDto {
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
    kind?: 'question-bank' | 'other-docs';
    featured?: boolean;
}
declare class HomeContentEventPdfDto {
    title: string;
    href: string;
    ctaLabel: string;
}
declare class HomeContentEventCardDto {
    title: string;
    descriptions: string[];
    image: string;
    pdfs: HomeContentEventPdfDto[];
}
declare class HomeContentFooterCardDto {
    title: string;
    description: string;
    links?: FooterLinkDto[];
}
declare class HeroFloatingCardDto {
    title: string;
    items: string[];
}
declare class HeroFloatingCardsDto {
    primary: HeroFloatingCardDto;
    secondary: HeroFloatingCardDto;
}
declare class HeroDto {
    bannerImage: string;
    logoImage: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryActionLabel: string;
    primaryActionHref: string;
    secondaryActionLabel: string;
    secondaryActionHref: string;
    badgeText: string;
    floatingCards: HeroFloatingCardsDto;
}
declare class IntroDto {
    image: string;
    label: string;
    title: string;
    paragraphs: string[];
    stats: HomeContentStatDto[];
}
declare class ArticleSectionDto {
    title: string;
    description: string;
}
declare class Article2Dto {
    section1: ArticleSectionDto;
    section2: ArticleSectionDto;
    section3: ArticleSectionDto;
    section4: ArticleSectionDto;
}
declare class Article1Dto {
    section1: ArticleSectionDto;
    section2: ArticleSectionDto;
}
declare class LinkSectionDto {
    label: string;
    title: string;
    subtitle: string;
    cards: HomeContentLinkCardDto[];
}
declare class EventsSectionDto {
    label: string;
    title: string;
    subtitle: string;
    cards: HomeContentEventCardDto[];
}
declare class HallTicketDto {
    title1: string;
    title2: string;
    footerLine1: string;
    footerLine2: string;
    footerLine3: string;
    footerLine4: string;
    footerLine5: string;
}
declare class AdmissionProcessDto {
    label: string;
    title: string;
    items: string[];
    primaryActionLabel: string;
    primaryActionHref: string;
    secondaryActionLabel: string;
    secondaryActionHref: string;
}
declare class AdmissionCampusDto {
    label: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    authorityEmail: string;
}
declare class AdmissionDto {
    process: AdmissionProcessDto;
    campus: AdmissionCampusDto;
}
declare class FooterDto {
    logoImage: string;
    label: string;
    title: string;
    cards: HomeContentFooterCardDto[];
}
export declare class DeletePublicationCardDto {
    index: number;
}
export declare class DeleteEventPdfDto {
    eventIndex: number;
    pdfIndex: number;
}
export declare class DeleteEventCardDto {
    eventIndex: number;
}
export declare class HomeContentDto {
    hero: HeroDto;
    intro: IntroDto;
    article1: Article1Dto;
    article2: Article2Dto;
    programmes: LinkSectionDto;
    events: EventsSectionDto;
    admission: AdmissionDto;
    publications: LinkSectionDto;
    hallTicket: HallTicketDto;
    footer: FooterDto;
}
export {};
