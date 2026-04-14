export type HomeContentStat = {
  value: string;
  label: string;
};

export type HomeContentDocumentKind = 'question-bank' | 'other-docs';

export type HomeContentLinkCard = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  kind?: HomeContentDocumentKind;
  featured?: boolean;
};

export type HomeContentEventPdf = {
  title: string;
  href: string;
  ctaLabel: string;
};

export type HomeContentEventCard = {
  title: string;
  descriptions: string[];
  image: string;
  pdfs: HomeContentEventPdf[];
};

export type HomeContentFooterCard = {
  title: string;
  description: string;
  links?: {
    label: string;
    href: string;
  }[];
};

export type HomeContentArticleSection = {
  title: string;
  description: string;
};

export type HallTicketSettings = {
  title1: string;
  title2: string;
  footerLine1: string;
  footerLine2: string;
  footerLine3: string;
  footerLine4: string;
  footerLine5: string;
};

export type HomeContentDocument = {
  hero: {
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
    floatingCards: {
      primary: {
        title: string;
        items: string[];
      };
      secondary: {
        title: string;
        items: string[];
      };
    };
  };
  intro: {
    image: string;
    label: string;
    title: string;
    paragraphs: string[];
    stats: HomeContentStat[];
  };
  article1: {
    section1: HomeContentArticleSection;
    section2: HomeContentArticleSection;
  };
  article2: {
    section1: HomeContentArticleSection;
    section2: HomeContentArticleSection;
    section3: HomeContentArticleSection;
    section4: HomeContentArticleSection;
  };
  programmes: {
    label: string;
    title: string;
    subtitle: string;
    cards: HomeContentLinkCard[];
  };
  events: {
    label: string;
    title: string;
    subtitle: string;
    cards: HomeContentEventCard[];
  };
  admission: {
    process: {
      label: string;
      title: string;
      items: string[];
      primaryActionLabel: string;
      primaryActionHref: string;
      secondaryActionLabel: string;
      secondaryActionHref: string;
    };
    campus: {
      label: string;
      title: string;
      paragraph1: string;
      paragraph2: string;
      authorityEmail: string;
    };
  };
  publications: {
    label: string;
    title: string;
    subtitle: string;
    cards: HomeContentLinkCard[];
  };
  hallTicket: HallTicketSettings;
  footer: {
    logoImage: string;
    label: string;
    title: string;
    cards: HomeContentFooterCard[];
  };
};
