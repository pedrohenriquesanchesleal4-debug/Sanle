export type Locale = "pt" | "en" | "es";

export interface Dictionary {
  common: {
    localeName: string;
    loading: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    whatsapp: string;
    online: string;
    all: string;
    backToHome: string;
    theme: string;
  };
  header: {
    capabilities: string;
    engineering: string;
    projects: string;
    contracting: string;
    solutions: string;
    contact: string;
    about: string;
    talkToSpecialist: string;
    buildSolution: string;
    menuOpen: string;
    menuClose: string;
  };
  hero: {
    eyebrow: string;
    headlineTop: string;
    headlineBottom: string;
    headlineItalic: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    microProof: string;
    pillarDigital: string;
    pillarDigitalSub: string;
    pillarSystems: string;
    pillarSystemsSub: string;
    pillarAgents: string;
    pillarAgentsSub: string;
    pillarAuto: string;
    pillarAutoSub: string;
  };
  capabilities: {
    badge: string;
    headline: string;
    headlineItalic: string;
    subheadline: string;
    whatWeBuild: string;
    ctaDigital: string;
    ctaSystems: string;
    ctaAgents: string;
    ctaAutomation: string;
    talkOnWhatsapp: string;
  };
  pinnedProblems: {
    environmentBadge: string;
    environmentTitle: string;
    environmentDesc: string;
    panelEyebrow: string;
    panelTitle: string;
    panelDesc: string;
    dossierLabel: string;
    calcCta: string;
    mapCta: string;
  };
  calculator: {
    badge: string;
    title: string;
    desc: string;
    teamLabel: string;
    hoursLabel: string;
    salaryLabel: string;
    monthlyLossLabel: string;
    yearlyLossLabel: string;
    cta: string;
  };
  cases: {
    badge: string;
    title: string;
    desc: string;
    filterAll: string;
    filterSites: string;
    filterSystems: string;
    filterAgents: string;
    filterAutomation: string;
    theChallenge: string;
    implementedSolution: string;
    verifiedFeatures: string;
    transparencyNote: string;
  };
  commercialModels: {
    badge: string;
    title: string;
    titleItalic: string;
    desc: string;
    whatIsIncluded: string;
    idealFor: string;
    requestProposal: string;
    transparencyTitle: string;
    transparencyDesc: string;
  };
  contactForm: {
    badge: string;
    title: string;
    desc: string;
    selectNature: string;
    stepIndicator: string;
    nameLabel: string;
    companyLabel: string;
    whatsappLabel: string;
    segmentLabel: string;
    privacyConsent: string;
    privacyLink: string;
    submitCta: string;
    whatsappCta: string;
    seeDemos: string;
    successTitle: string;
    successDesc: string;
    continueOnWhatsapp: string;
  };
  footer: {
    tagline: string;
    rights: string;
    privacy: string;
    terms: string;
    contactDirect: string;
  };
}
