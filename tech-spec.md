# Chi Link — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | React DOM renderer |
| react-router-dom | ^7.0.0 | Multi-page routing (Home, Location, Treatments) |
| gsap | ^3.12.0 | Core animation engine, ScrollTrigger, SplitText |
| lenis | ^1.1.0 | Smooth scroll with inertia |
| three | ^0.170.0 | WebGL ink flow shader in Hero |
| @types/three | ^0.170.0 | TypeScript types for Three.js |
| tailwindcss | ^4.0.0 | Utility styling |
| @tailwindcss/vite | ^4.0.0 | Tailwind Vite integration |
| typescript | ^5.7.0 | Type safety |
| vite | ^6.0.0 | Build tool |
| @vitejs/plugin-react | ^4.0.0 | React Vite plugin |

**Dev note:** All GSAP plugins (ScrollTrigger, SplitText, DrawSVG) are free as of 2025 and included in the `gsap` package. Register before use.

---

## Component Inventory

### Layout (shared across all pages)

| Component | Source | Notes |
|-----------|--------|-------|
| Preloader | Custom | SVG stroke-draw of 气 character (~0.8s), unmounts after animation |
| Navigation | Custom | Transparent over hero, solid on scroll. Logo left, links + CTA right |
| CustomCursor | Custom | Desktop only. 12px cinnabar circle, expands on CTA hover, crosshair on images. Trail ghost with 80ms lag |
| Footer | Custom | Dark void bg, logo, socials, newsletter, location columns, meridian divider line |
| SmoothScrollProvider | Custom (wraps Lenis) | Initializes Lenis, bridges to GSAP ScrollTrigger ticker |

### Homepage Sections

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Diagonal clip-path 65/35 split. Left: WebGL ink canvas. Right: headline, cinnabar line, CTAs, scroll indicator |
| MeridianTransition | Custom | SVG meridian paths that draw on scroll between Philosophy and Treatments |
| PhilosophySection | Custom | Dark section. 气 watermark, centered quote, 3-column Restore/Balance/Renew |
| TreatmentsSection | Custom | Pinned horizontal scroll gallery. 5-6 portrait cards with hover effects |
| SocialProofSection | Custom | Masonry review cards at ±2° rotations, giant 4.9 score |
| InkMapSection | Custom | Stylized SVG map of Eastern Australia with cinnabar location dots |
| ChiStoryStrip | Custom | Narrow cinematic band: "Since 2004" / divider / heritage copy |
| GiftCardsSection | Custom | Warm honey gold bg, headline, gift card illustration, CTA |

### Page: Location Template

| Component | Source | Notes |
|-----------|--------|-------|
| LocationHero | Custom | Reversed diagonal split. Clinic photo right, details + booking CTA left |
| ServicesPills | Custom | Horizontal staggered pills with icons, location-truthful |
| LocationReviews | Custom | Google Reviews filtered by location, 3 visible + load more |
| MiniInkMap | Custom | State-zoomed map with location dot highlighted |
| StickyBookingBar | Custom | Mobile only. Appears after scrolling past hero |

### Page: Treatments

| Component | Source | Notes |
|-----------|--------|-------|
| BodyMap | Custom | SVG anatomical silhouette with hover tooltips linking to treatments |
| TreatmentCardGrid | Custom | Fallback grid below body map, same card design as homepage |

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| WebGL ink flow reveal (FBM noise, gold shimmer, progress wipe) | Three.js raw ShaderMaterial | Orthographic camera, plane geometry, custom vertex/fragment shaders with snoise + fbm. u_progress animated 1.0→0.0 on load | **High** 🔒 |
| Preloader 气 SVG stroke draw | GSAP DrawSVG + timeline | DrawSVG plugin strokes the character path, fades out, unmounts component | Medium |
| Hero cinnabar line expand | GSAP | Width 0→100% over 1.2s after preloader completes | Low |
| Hero diagonal clip-path | CSS | `clip-path: polygon(...)` on left panel. Static, not animated | Low |
| 气 watermark slow rotate | GSAP ScrollTrigger | scrub-linked rotation 0→2deg over scroll distance | Low |
| Philosophy 3-column stagger reveal | GSAP ScrollTrigger | batch() or stagger fade-in-up, 120ms delay between columns | Low |
| Scroll indicator breathing pulse | CSS @keyframes | Vertical line height oscillation + opacity pulse, infinite | Low |
| **Treatments horizontal scroll** | GSAP ScrollTrigger pin + scrub | Pin the section, scrub translateX of card track based on vertical scroll. `end: +=trackWidth` | **High** 🔒 |
| Treatment card hover (lift, desaturate, cinnabar bar) | CSS transitions | transform, filter, pseudo-element transitions. No JS needed | Low |
| **Meridian SVG path draw** | GSAP ScrollTrigger | Per-path strokeDashoffset animation tied to scroll scrub in transition zone | **High** 🔒 |
| Social proof masonry + rotations | CSS + GSAP ScrollTrigger | Static rotations (±2deg), staggered fade-in on scroll | Medium |
| Ink map dot pulse | CSS @keyframes | scale 1→1.3→1, 400ms, on hover trigger | Low |
| Location card slide-up | GSAP | translateY from bottom on dot hover | Low |
| Section background transitions | GSAP ScrollTrigger | scrub-linked background-color tween over 200px overlap zones | Medium |
| Custom cursor trail | requestAnimationFrame | Main cursor at mouse position, ghost circle lerped/trailing at 80ms delay. Morph states on hover detection | Medium |
| Cursor ink-splash on click | GSAP | scale 1→1.5→1 over 200ms | Low |
| Scroll-triggered reveals (global) | GSAP ScrollTrigger | batch configuration: opacity 0→1, translateY 32→0, 700ms, 90ms sibling stagger, 0.15 threshold | Low |
| Location page hero entrance | GSAP timeline | SplitText headline reveal + content stagger after preloader | Medium |
| Body map hover tooltips | GSAP / CSS | Mouse-follow tooltip with treatment highlight, region detection via SVG paths | Medium |

---

## State & Logic

### Three.js ↔ React Bridge
The WebGL ink canvas lives outside React's render cycle. Use a `useRef` for the canvas container and a `useEffect` to initialize/destroy the Three.js scene. All animation (renderer, clock, uniform updates) runs in a `requestAnimationFrame` loop managed imperatively. Pass `u_progress` updates via GSAP tweening the uniform value directly.

### Lenis ↔ GSAP ScrollTrigger Bridge
Lenis must drive ScrollTrigger's scroll position. On every Lenis `scroll` event, call `ScrollTrigger.update()`. Connect Lenis's RAF loop to GSAP's ticker via `gsap.ticker.add()` for frame synchronization. This is a one-time setup in `SmoothScrollProvider`.

### Custom Cursor State Machine
The cursor has 4 visual states: default, CTA hover, image hover, clicking. Track via a single `cursorState` ref (not React state — updates at 60fps). Detect target type via `mouseover` event delegation on `document.body`. Switch cursor appearance by applying CSS classes or direct style manipulation on the cursor DOM elements.

### Multi-Page Routing
Use `react-router-dom` with 3 routes: `/` (Home), `/locations/:slug` (Location template), `/treatments` (Treatments). Each page is a separate component. The Preloader, Navigation, CustomCursor, and SmoothScrollProvider live at the app root, wrapping `<Outlet />`.

---

## Other Key Decisions

### Raw Three.js over R3F
The hero WebGL effect is a single full-screen shader with no 3D scene graph, no models, and no React-driven props. Raw Three.js in a `useEffect` is lighter and avoids the overhead of @react-three/fiber's reconciler for this use case.

### SVG over Mapbox for Ink Map
The design specifies a "cartographer's sketch" style — minimalist ink lines, abstract landmarks, cinnabar dots. A hand-crafted SVG achieves this aesthetic precisely without Mapbox GL JS overhead or API keys. The map is decorative, not interactive navigation.

### Image Assets
All treatment card photos, clinic interior photos, and testimonial avatars are generated via AI image generation. The hero uses the WebGL shader as its sole background — no video file or fallback video needed. The preloader SVG 气 character is hand-coded as a path element.

### Mobile Horizontal Scroll Fallback
On mobile (< 768px), the treatments horizontal scroll pin is disabled entirely. Cards become a CSS `scroll-snap` horizontal carousel with native momentum scrolling. This avoids GSAP pin issues on touch devices and provides better UX.
