# PORTFOLIO.OS — Developer Portfolio Template

> **PORTFOLIO.OS** is a cybernetic HUD / OS-inspired, high-performance developer portfolio template engineered with Next.js 16, Tailwind CSS, Framer Motion, and GSAP. Designed as a plug-and-play template for developers, engineers, and creators.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

---

## 🛠️ How to Customize This Template

All portfolio content is centralized in **`src/config/portfolio.config.ts`**. You can configure your identity, projects, work history, and contact links in this single file.

### 1. Identity & Hero Section (`hero`)
Change your name, role, and HUD monogram:

```typescript
// src/config/portfolio.config.ts
meta: {
  osName: 'PORTFOLIO.OS',
  version: 'V / 03.26',
  buildStatus: 'ACTIVE',
  monogram: 'MK.', // Top-left HUD monogram (e.g., MK.)
  availabilityText: 'AVAILABLE FOR OPPORTUNITIES',
},
hero: {
  firstName: 'MARTIN',
  lastName: 'KING',
  role: 'Mobile Application & Full-Stack Developer',
  taglinePrefix: 'YOU IMAGINE.',
  taglineHighlight: 'I DELIVER',
  basePortrait: '/assets/portrait/portrait-base.png',
  cyberPortrait: '/assets/portrait/portrait-cyber.png',
  circuitNodes: [
    { id: 'ai', code: 'AI', title: 'AI / ML', subtitle: 'INTELLIGENT SYSTEMS', anchorX: 54, anchorY: 31 },
    { id: 'api', code: 'API', title: 'BACKEND', subtitle: 'SCALABLE SERVICES', anchorX: 56, anchorY: 41 },
    { id: 'app', code: 'APP', title: 'MOBILE', subtitle: 'FLUTTER EXPERIENCES', anchorX: 57, anchorY: 52 },
    { id: 'cld', code: 'CLD', title: 'CLOUD', subtitle: 'DEPLOYED INFRA', anchorX: 59, anchorY: 63 },
    { id: 'sec', code: 'SEC', title: 'SECURITY', subtitle: 'PROTECTED DATA', anchorX: 57, anchorY: 75 },
  ],
}
```

### 2. Profile & Metrics Bento Grid (`profile`)
Set your bio paragraphs, experience metrics, and resume download link:

```typescript
profile: {
  greeting: "I'm Martin King",
  bioTitle: "Mobile Application & Full-Stack Developer",
  bioParagraphs: [
    "Your bio paragraph 1...",
    "Your bio paragraph 2...",
  ],
  metrics: [
    { value: '4+', label: 'years', description: 'Building mobile and full-stack products.' },
    { value: '50+', label: 'projects', description: 'Products shipped across mobile, web and backend systems.' },
    { value: '99%', label: 'satisfaction', description: 'Quality-focused delivery shaped by real client feedback.' },
    { value: '8+', label: 'technologies', description: 'Flutter, Dart, React, Firebase, Node.js, and Cloud.', tilt: true },
  ],
  resumeUrl: '/api/resume', // Serves public/resume/resume.pdf
}
```

### 3. Technology Arsenal Matrix (`stack`)
Configure the 9 interactive modules in the 3x3 tech matrix:

```typescript
stack: {
  sectionCode: '03 / TECHNOLOGY ARSENAL',
  titleSolid: 'Tools, aligned',
  titleOutline: 'around the mission.',
  helperText: 'Scroll rotates the active technology system. Point at a module to inspect its role.',
  items: [
    { id: 'flutter', number: '01', name: 'Flutter', category: 'MOBILE CORE', description: '...' },
    // ... up to 9 modules
  ],
}
```

### 4. Project Matrix & Detailed Case Studies (`work`)
Features dynamic morphing background colors and interactive slide-over case studies:

- **01: Let's Ryde** — Real-Time Mobility (Mint Theme `#E6FAF3`)
- **02: MIA** — Driver Assistance (Dark Obsidian Theme `#071013`)
- **03: ClientBook** — Client & Booking Management (Warm Champagne `#FAF6EE`)
- **04: SaifLocators** — Field Geolocation (Navy Blueprint `#0E2238`)
- **05: Linear Craze** — Mobile Mathematics (Deep Violet `#0D0B1C`)
- **06: CoffeeBrew** — Beverage Preferences (Espresso Theme `#140C08`)

Add your own live links (`liveUrl`), repository links (`githubUrl`), and architectural case studies directly in `projects`.

### 5. Career Constellation Journey (`journey`)
Timeline nodes showcasing roles, companies, dates, key highlights, and tech stacks:

```typescript
journey: {
  sectionCode: '05 / CAREER CONSTELLATION',
  titleSolid: 'Growth measured',
  titleOutline: 'in shipped systems.',
  nodes: [
    {
      id: 'role-01',
      nodeNumber: '01',
      role: 'Software Developer',
      company: 'Tech Studio · London, UK (Remote)',
      period: 'SEP 2025 — MAR 2026',
      description: '...',
      highlights: ['...'],
      techStack: ['Flutter', 'Dart', 'REST APIs', 'Android', 'iOS'],
    },
    // ...
  ],
}
```

### 6. Contact & Social Channels (`contact`)
Update your contact email, social channels, and footer links:

```typescript
contact: {
  sectionCode: '06 / FINAL TRANSMISSION',
  signatureUrl: '/assets/portrait/signature.svg',
  headlineWhite: 'YOU IMAGINE,',
  headlineLime: 'I DELIVER.',
  portraitImage: '/assets/portrait/portrait-base.png',
  connectLinks: [
    { label: 'EMAIL DIRECT', href: 'mailto:contact@martinking.dev' },
    { label: 'LINKEDIN', href: 'https://linkedin.com/in/martinking' },
    { label: 'GITHUB', href: 'https://github.com/martinking' },
    { label: 'TWITTER / X', href: 'https://twitter.com/martinking' },
    { label: 'SCHEDULE CALL', href: 'https://cal.com/martinking' },
  ],
  copyright: '© 2026 Martin King. Powered by PORTFOLIO.OS. All systems operational.',
}
```

---

## 🚀 Deployment

The project is optimized for deployment on [Vercel](https://vercel.com/) or any Node.js hosting platform:

```bash
npm run build
npm run start
```
