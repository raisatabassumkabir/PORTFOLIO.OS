export interface MetaConfig {
  osName: string;
  version: string;
  buildStatus: string;
  monogram: string;
  availabilityText: string;
}

export interface CircuitCallout {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  anchorX: number; // percentage (0-100) on portrait
  anchorY: number; // percentage (0-100) on portrait
}

export interface HeroConfig {
  firstName: string;
  lastName: string;
  intro?: string;
  eyebrow?: string;
  role: string;
  taglinePrefix: string;
  taglineHighlight: string;
  lede?: string;
  basePortrait: string;
  cyberPortrait?: string | null;
  circuitNodes: CircuitCallout[];
}

export interface ProfileMetric {
  value: string;
  label: string;
  description: string;
  tilt?: boolean;
}

export interface ProfileConfig {
  greeting: string;
  bioTitle: string;
  bioParagraphs: string[];
  metrics: ProfileMetric[];
  resumeUrl: string;
}

export interface StackItem {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  readoutTitle?: string;
  icon?: string;
}

export interface StackConfig {
  sectionCode: string;
  titleSolid: string;
  titleOutline: string;
  helperText: string;
  items: StackItem[];
}

export interface ProjectTheme {
  bg: string;
  gridColor: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  borderGlow: string;
}

export interface CaseStudy {
  overview: string;
  challenge: string;
  architecture: string[];
  keyFeatures: string[];
  outcome: string;
}

export interface ProjectItem {
  id: string;
  code: string;
  category: string;
  title: string;
  summary: string;
  description: string;
  tech: string[];
  theme: ProjectTheme;
  mockupImage: string;
  canvasSubtitle: string;
  metrics?: string[];
  liveUrl?: string;
  githubUrl?: string;
  caseStudy: CaseStudy;
}

export interface WorkConfig {
  sectionCode: string;
  titleSolid: string;
  titleOutline: string;
  helperText: string;
  projects: ProjectItem[];
}

export interface CareerNode {
  id: string;
  nodeNumber: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  techStack: string[];
}

export interface JourneyConfig {
  sectionCode: string;
  titleSolid: string;
  titleOutline: string;
  nodes: CareerNode[];
}

export interface TechIconItem {
  name: string;
  symbol: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface ContactConfig {
  sectionCode: string;
  signatureUrl: string;
  headlineWhite: string;
  headlineLime: string;
  portraitImage: string;
  techLogos: TechIconItem[];
  pagesLinks: NavLinkItem[];
  connectLinks: NavLinkItem[];
  copyright: string;
}

export interface PortfolioConfig {
  meta: MetaConfig;
  hero: HeroConfig;
  profile: ProfileConfig;
  stack: StackConfig;
  work: WorkConfig;
  journey: JourneyConfig;
  contact: ContactConfig;
}

export interface ProjectInquiryData {
  clientName: string;
  clientEmail: string;
  projectType: string;
  budgetRange?: string;
  timeline?: string;
  brief: string;
}
