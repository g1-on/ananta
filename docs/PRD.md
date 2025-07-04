# Project Ananta – Landing-Page Redesign  
**Version:** 0.1   **Date:** 05-Jul-2025  

---
## 1  Project Goal
Deliver a modern, performant, single-page marketing site for *Project Ananta* (luxury construction venture). The new site must:

* Re-use/refresh existing copy & assets.
* Embrace a white-background / black-content visual identity.
* Feature smooth, on-scroll animations (Lenis + GSAP), text splitting and dynamic sections inspired by *heights.agency* & *ventriloc.ca*.
* Be fully responsive with a single code-base (Tailwind break-points).
* Achieve Lighthouse ≥ 90 on performance, a11y & best-practices.

---
## 2  Key Pages / Sections
| Status | # | Section | Content Source (old site) | New Animation / Interaction |
|---|---------|--------------------------|-----------------------------|
| [ ] | 1 | **Splash / Pre-loader** | `<section id="splash-screen">` (Ananta Devanagari headline & ring video) | Fade-in logo + GSAP SplitText letter stagger, then auto-scroll cue. Lenis paused until imagesLoaded complete. |
| [ ] | 2 | **Hero** | Headline: “Luxury Service Apartments in Lucknow” (implied); CTA “Know More” | Parallax background image (scale 1.2 → 1) & headline slide-up on page load. |
| [ ] | 3 | **Stats Counters** | `.counter-value` elements (₹ investment, units sold, etc.) | Count-up once 35 % visible via IntersectionObserver. Sticky on wide screens. |
| [ ] | 4 | **About / Highlights** | `<section id="about">` lists 5 Towers, 800 units, etc. | Split 2-column; left text block scroll-reveals list items. Sticky asset on right that cross-fades images. |
| [ ] | 5 | **Amenities** | Grid of 18 + amenity images (old “amenities-wrapper”). | Pinned horizontal scroll (desktop) using Lenis + ScrollTrigger; simple vertical masonry on mobile. |
| [ ] | 6 | **Testimonials** | Cards with name, role, quote. | Infinite marquee built with GSAP `to({x:"-=50%"})` + hover-pause. |
| [ ] | 7 | **Location** | Copy + Map placeholder video. | Embed Mapbox GL with grayscale tiles; fade-in pins as they enter view. |
| [ ] | 8 | **Contact** | Name, email, phone, message form (posts to Express route). | Floating-label inputs; GSAP shake on invalid submit; success modal. |
| [ ] | 9 | **Our Group** | Logos of 10 group companies. | Grid zoom-in on hover; IntersectionObserver fade-in sequence. |
| [ ] | 10 | **Utility** | Scroll-to-top button, chatbot toggle. | Button scales in after hero; chatbot slides from bottom-left. |

---
## 3  Technical Stack
* **Build & Dev:** Vite 5 + ESM.  
* **Styling:** Tailwind CSS 3.4 (`@tailwind base/components/utilities`).  
* **Typography:** Google Fonts `Montserrat` & `Tiro Devanagari Hindi`.  
* **Smooth Scroll:** `@studio-freight/lenis`.  
* **Animations:** GSAP 3 (Core, ScrollTrigger, SplitText) + SplitType fallback.  
* **Viewport Detection:** Native Intersection Observer.  
* **Images:** `<picture>` with AVIF/WebP + lazy `loading="lazy"`.  
* **Forms:** Fetch to existing Express `/contact` route, with client-side validation (Zod).  
* **Deployment:** Vercel (project root `/web`).

---
## 4  Responsive & Accessibility Requirements
1. **Break-points:** `sm` ≥ 640 px, `md` ≥ 768 px, `lg` ≥ 1024 px, `xl` ≥ 1280 px.  
2. Keyboard navigable; `prefers-reduced-motion` disables heavy scroll animations.  
3. Color contrast ≥ 4.5:1 for text on white (#000 on #FFF).  
4. Alt tags on all images; aria-labels on interactive controls.

---
## 5  Performance Targets
| Metric | Target |
|--------|--------|
| Largest Contentful Paint (LCP) | ≤ 2.5 s |
| Total Blocking Time (TBT) | ≤ 150 ms |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |
| First Input Delay (FID) | ≤ 100 ms |

---
## 6  Open Questions / Notes
1. Will SplitText commercial license be procured, or use SplitType?  
2. Final copy for hero tagline & counter values?  
3. Exact list of amenities to keep (current list is 18).  
4. Mapbox API key availability.  
5. Contact form backend stays in existing Express app—OK?

---
## 7  Timeline (Draft)
| Week | Milestone |
|------|-----------|
| 1 | Project setup, Tailwind theme, Lenis/GSAP integration, Splash + Hero done. |
| 2 | About, Counters, Amenities (desktop & mobile variants). |
| 3 | Testimonials, Location (Mapbox), Our Group grid. |
| 4 | QA, a11y pass, Lighthouse tuning, content freeze. |
| 5 | Client review, tweaks, launch preparation. |

---
## 8  Glossary of Terms
* **Lenis:** JS library providing virtualized, smooth scrolling.  
* **ScrollTrigger:** GSAP plugin linking scroll position to animation timeline.  
* **SplitText / SplitType:** Libraries that convert text into individually animatable spans.  
* **Pinned Section:** A block that remains fixed while the rest of the page scrolls.

---
*End of PRD*
