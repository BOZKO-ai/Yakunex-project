# Yakunex Technologies (Pvt) Ltd — Corporate Web Application
> **Official Web Platform & Digital Presence**  
> **Corporate Headquarters:** NO: 280/A, Ilukwaththa, Kadugannawa, Kandy, Sri Lanka  
> **Leadership:** Director D.P.S. Wijesinghe | Software Engineer & Technical Lead R.A. Ranaweera  

---

## 1. Executive Overview

This web platform is the official web application for **Yakunex Technologies (Pvt) Ltd**, a technology solutions company delivering high-performance software engineering, cloud architecture, cybersecurity, and artificial intelligence solutions.

Built as a **Multi-Page Single-Page Application (SPA)** with React 18 and Vite, the platform features:
- **16 Comprehensive IT Service Offerings** with category filtering and instant keyword search
- **7 Core Values & Engineering Principles** governing quality and client relationships
- **Featured Project Portfolio** showcasing modern architectures and enterprise systems
- **Interactive Multi-Service Inquiry Portal** enabling prospective clients to request tailored quotes
- **Talent & Careers Portal** for aspiring engineers and interns
- **Fluid GSAP ScrollTrigger Animations & 3D Interactive Perspectives**

---

## 2. Directory Architecture

```text
yakunex-react/
├── public/
│   └── logo.png                       # Official Yakunex brand emblem
├── src/
│   ├── assets/
│   │   ├── logo.png                   # High-resolution brand logo
│   │   └── images/                    # Project and team imagery
│   ├── components/
│   │   └── common/
│   │       ├── Navbar.jsx             # Sticky glassmorphic navigation with active states & mobile drawer
│   │       ├── Footer.jsx             # Comprehensive corporate footer & brand signature
│   │       ├── SectionHeader.jsx      # Reusable typography & badge header
│   │       └── ScrollToTop.jsx        # Smooth scroll restoration across route changes
│   ├── data/
│   │   └── companyData.js             # Central data repository: 16 services, 7 values, projects, metrics
│   ├── hooks/
│   │   └── useWeichieScrollAnimations.js # Custom GSAP ScrollTrigger animation controller
│   ├── pages/
│   │   ├── HomePage.jsx               # Hero perspective showcase, services preview, leadership & inquiry
│   │   ├── AboutPage.jsx              # Company history, vision/mission, 7 core values, engineering roadmap
│   │   ├── ServicesPage.jsx           # All 16 specialized IT service domains with search & filter
│   │   ├── PortfolioPage.jsx          # Featured enterprise projects with system architecture modals
│   │   ├── CareersPage.jsx            # Talent tracks, engineering culture & application portal
│   │   └── ContactPage.jsx            # Consultation request portal with multi-domain chip selector
│   ├── styles/
│   │   └── index.css                  # Modern editorial design tokens, typography & responsive layouts
│   ├── App.jsx                        # React Router layout, routes definition & accessibility skip link
│   └── main.jsx                       # Application entry point with BrowserRouter & root mount
├── index.html                         # Semantic HTML5 shell with Google Fonts & SEO meta tags
├── package.json                       # Dependencies & build scripts
├── vite.config.js                     # Vite build & dev server configuration
└── README.md                          # Technical documentation
```

### Media placeholders

Customer review and authorized leadership media is centralized in
`src/data/companyData.js`. The current review cards use anonymous initials
placeholders, and the two named leadership records use initials placeholders
until verified photographs and approved customer feedback are supplied. Replace
the `avatar` or `portrait` values with imported, authorized assets and update
their accompanying alt text/status fields; do not use unverified portraits or
invent customer identities.

---

## 3. Technology Stack

| Layer | Technology | Technical Rationale |
| :--- | :--- | :--- |
| **Framework** | **React 18** | Component-driven architecture, modular state management, declarative rendering. |
| **Build Tool** | **Vite 8** | Lightning-fast HMR and optimized production asset bundling. |
| **Routing** | **React Router DOM v7** | Client-side routing with URL query-state preservation. |
| **Animations** | **GSAP & ScrollTrigger** | High-performance hardware-accelerated scroll animations and parallax effects. |
| **Styling** | **Vanilla CSS (Design Tokens)** | Zero-overhead, complete design control with theme variables and responsive grids. |
| **Iconography** | **Lucide React** | Scalable, accessible SVG icons. |

---

## 4. Key Sections & Capabilities

### 🌟 Home Page (`/`)
- Perspective 3D curved hero showcase highlighting flagship software platforms.
- Clear presentation of **Company Vision** and **Company Mission**.
- 7 Core Values preview and key capabilities.
- Interactive **"Tell us what you need"** multi-service selection inquiry flow.

### 🏢 About Us (`/about`)
- Company background and Sri Lanka headquarters (*Kadugannawa, Kandy*).
- Full breakdown of the **7 Core Principles**: Innovation, Quality, Integrity, Customer Satisfaction, Teamwork, Continuous Learning, and Responsibility.
- Executive Leadership team credentials.
- 6-Phase Engineering Delivery Lifecycle.

### 💻 Services (`/services`)
- Full coverage of **all 16 IT Service Areas**:
  1. *Software Development*
  2. *Web Development*
  3. *Mobile Application Development*
  4. *UI/UX and Graphic Design*
  5. *Artificial Intelligence and Machine Learning*
  6. *Cloud Computing and DevOps*
  7. *Cybersecurity and IT Security*
  8. *Networking and IT Infrastructure*
  9. *Database Management*
  10. *E-commerce and Digital Business*
  11. *IT Consulting and Technical Support*
  12. *Digital Marketing and SEO*
  13. *IoT and Emerging Technologies*
  14. *Quality Assurance and Software Testing*
  15. *Business Automation and System Integration*
  16. *IT Education and Professional Training*
- **Real-time search bar** filtering by keyword or tech stack.
- Category filter chips (*Software & Apps, Web & Cloud, AI & Data, Infrastructure & Security, Consulting & Growth*).
- Specification modal presenting granular sub-services and inquiry shortcut.

### 🚀 Portfolio (`/portfolio`)
- Featured enterprise systems (NexusPOS, MediCare, CloudSentinel, ApexCart, OmniAssist, CyberShield).
- Interactive architecture blueprint modals with technical highlights and technology badges.

### 🎓 Careers & Internships (`/careers`)
- Open talent tracks: Software Engineering, UI/UX Design, QA Testing, Cloud & DevOps.
- Candidate application portal with instant confirmation.

### 📬 Contact & Consultation (`/contact`)
- Direct headquarters contact channels (email, hotline, physical address, office hours).
- **Interactive Multi-Service Chip Selector**: Select multiple services among all 16 domains.
- Client validation with direct response commitment.

---

## 5. Getting Started & Local Setup

### Prerequisites
- **Node.js**: v20.19.0 or higher, or v22.12.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Run

1. Clone or navigate to the repository directory:
   ```bash
   cd c:\Users\USER\Desktop\yakunex-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open your browser at: `http://localhost:5173`

4. Production Build:
   ```bash
   npm run build
   npm run preview
   ```

---

## 6. Quality, Performance & Accessibility

- **Responsive Design**: Fluidly tested across Desktop (1440px), Laptop (1024px), Tablet (768px), and Mobile (375px) viewports.
- **Accessibility (A11y)**: Includes skip-to-content anchor, semantic HTML5 tags (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`), ARIA labels on buttons and navigation drawers.
- **Data Security**: Client data is validated securely with no sensitive keys exposed.
- **Defensive Error Handling**: Catch-all routing redirects unknown URLs back to the Home view gracefully.

---

© Yakunex Technologies (Pvt) Ltd. All Rights Reserved.
