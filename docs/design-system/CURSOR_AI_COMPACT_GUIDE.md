# V0 AI WORKFLOW - COMPACT REFERENCE

## THINKING PROCESS
- Read request 2-3x → Extract goal, audience, features, constraints
- Break complexity → Single page = no todos | Multi-system (3+) = use TodoManager
- Ask clarifying questions if vague
- Plan tools needed: SearchRepo, GenerateDesignInspiration, GetOrRequestIntegration

## CONTEXT GATHERING
- Use PARALLEL tool calls (SearchRepo + GenerateDesignInspiration + GetOrRequestIntegration simultaneously)
- Broad search first ("Give me overview") → Identify patterns → Find similar implementations → Verify architecture
- Small files (<2000 lines): Read entire | Large files: Use specific query
- ALWAYS read file before editing

## DESIGN RULES
**Colors**: 3-5 max | 1 primary + 2-3 neutrals + 1-2 accents | Use CSS variables
**Typography**: 2 fonts max | 1 heading + 1 body | Line-height 1.4-1.6
**Layout**: Flexbox (90%) > Grid (complex 2D) > Avoid floats/absolute
**Responsive**: Mobile-first (no prefix) → md: (tablet) → lg: (desktop)
**Design Tokens**: Define all colors in globals.css as CSS variables

## PROJECT STRUCTURE
\`\`\`
src/
├── layouts/Layout.astro
├── components/
│   ├── Header.astro
│   ├── HeroSection.astro
│   ├── RoomsSection.astro
│   ├── AmenitiesSection.astro
│   ├── GallerySection.astro
│   ├── TestimonialsSection.astro
│   ├── ContactSection.astro
│   ├── Footer.astro
│   └── FloatingWhatsApp.astro
├── styles/global.css
└── pages/index.astro
\`\`\`

## ASTRO COMPONENT PATTERN
\`\`\`astro
---
// 1. IMPORTS
// 2. PROPS & TYPES
// 3. LOGIC
// 4. COMPUTED VALUES
---

<!-- 5. TEMPLATE (semantic HTML) -->
<section class="py-12 px-4">
  <!-- Content -->
</section>

<style>
  /* 6. SCOPED STYLES */
</style>
\`\`\`

## RESPONSIVE GRID
\`\`\`
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <!-- 1 col mobile, 2 tablet, 3 desktop -->
</div>
\`\`\`

## ANIMATIONS
- Duration: 0.3s-0.8s | Easing: ease-out | Trigger: hover/scroll/load
- Use transform/opacity (GPU accelerated)
- Define @keyframes in global.css
- Avoid heavy animations on mobile

## CONVERSION OPTIMIZATION
- Visible phone numbers (not just icons)
- Multiple CTAs throughout page
- Floating WhatsApp button (bottom-right, pulsing, z-50)
- Large touch targets (44px+ mobile)
- Clear value proposition

## FILE NAMING
- Components: PascalCase (Header.astro)
- Utilities: kebab-case (animation-utils.ts)
- Styles: kebab-case (global.css)
- Images: kebab-case (hero-image.jpg)

## DEVELOPMENT WORKFLOW
1. **Planning** (5-10 min): Understand goal, identify todos, plan approach
2. **Context** (5-15 min): Parallel tool calls, read files, understand patterns
3. **Design** (5-10 min): Colors, typography, layout, animations, tokens
4. **Implementation** (20-40 min): Build components top-to-bottom, responsive, animations
5. **Polish** (5-10 min): Review, test mobile, optimize, final tweaks

## EDITING FILES
1. Read file first
2. Identify changes needed
3. Add `// ` comment
4. Keep changes minimal
5. Write 2-4 sentence postamble

## ACCESSIBILITY CHECKLIST
- [ ] Semantic HTML (<main>, <section>, <article>)
- [ ] ARIA labels/roles
- [ ] Alt text on images
- [ ] Color contrast 4.5:1
- [ ] Keyboard navigation
- [ ] Touch targets 44px+
- [ ] Screen reader text (sr-only)
- [ ] prefers-reduced-motion respected

## COMMON PATTERNS

### Room Card with Modal
\`\`\`astro
<div class="room-card group">
  <img src={image || "/placeholder.svg"} alt={name} class="group-hover:scale-105 transition-transform" />
  <h3>{name}</h3>
  <p class="text-2xl font-bold text-primary">₹{price}</p>
  <button onclick="openModal('{name}')">View Details</button>
</div>
\`\`\`

### Floating WhatsApp Button
\`\`\`astro
<a 
  href={`https://wa.me/919933437469?text=${message}`}
  class="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 animate-pulse"
>
  WhatsApp
</a>
\`\`\`

### Gallery Grid
\`\`\`astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {images.map(img => (
    <div class="overflow-hidden rounded-lg h-64 group">
      <img src={img || "/placeholder.svg"} class="group-hover:scale-110 transition-transform" />
    </div>
  ))}
</div>
\`\`\`

## HOSPITALITY DESIGN SYSTEM
**Colors**: 
- Primary: #d4a574 (warm gold)
- Secondary: #8b6f47 (earthy brown)
- Background: #faf8f3 (warm off-white)
- Foreground: #1a1a1a (near black)

**Typography**: Playfair Display (headings) + Inter (body)
**Spacing**: 4, 8, 12, 16, 24, 32, 48, 64px
**Radius**: 0.25rem, 0.5rem, 1rem, 9999px

## MISTAKES TO AVOID
✗ Hardcoded colors (use CSS variables)
✗ >2 fonts or >5 colors
✗ Absolute positioning for layout
✗ Not reading files before editing
✗ Desktop-first design (use mobile-first)
✗ Missing alt text or ARIA labels
✗ Insufficient color contrast
✗ Not testing on mobile devices
✗ Arbitrary Tailwind values (use scale)
✗ Mixing margin/padding with gap

## QUICK COMMANDS

**Responsive Grid**:
\`\`\`
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
\`\`\`

**Flexbox Container**:
\`\`\`
flex flex-col md:flex-row items-center justify-between gap-4
\`\`\`

**Button CTA**:
\`\`\`
bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded transition-colors
\`\`\`

**Card**:
\`\`\`
bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6
\`\`\`

**Image Hover**:
\`\`\`
group-hover:scale-110 transition-transform duration-300
\`\`\`

## SUCCESS PRINCIPLES
1. Think before coding (use <Thinking>)
2. Gather context systematically (parallel calls)
3. Mobile-first always
4. Use design tokens (CSS variables)
5. Keep simple (2 fonts, 3-5 colors, flexbox/grid)
6. Accessibility first (WCAG compliance)
7. Test on real devices
8. Optimize images (WebP, compress)
9. Document complex logic
10. Iterate and polish

---
**Use this as system prompt for Cursor AI to replicate v0 workflow exactly.**
