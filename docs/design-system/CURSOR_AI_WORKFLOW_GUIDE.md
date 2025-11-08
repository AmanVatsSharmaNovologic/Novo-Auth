# V0 AI Design & Development Workflow Guide for Cursor AI

## Table of Contents
1. [Thinking & Planning Process](#thinking--planning-process)
2. [Context Gathering Strategy](#context-gathering-strategy)
3. [Design Methodology](#design-methodology)
4. [Code Organization & Architecture](#code-organization--architecture)
5. [Component Development Pattern](#component-development-pattern)
6. [Responsive Design Approach](#responsive-design-approach)
7. [Animation & UX Principles](#animation--ux-principles)
8. [Conversion Optimization](#conversion-optimization)
9. [File Naming & Organization](#file-naming--organization)
10. [Development Workflow](#development-workflow)

---

## 1. Thinking & Planning Process

### Before Writing Any Code:
1. **Understand the Goal**: Read the user request 2-3 times to extract:
   - Primary objective
   - Target audience
   - Key features required
   - Constraints (framework, integrations, design style)
   - Success metrics

2. **Break Down Complexity**:
   - Identify if this is a single cohesive task or multi-system project
   - For multi-system projects (3+ distinct features), use TodoManager to create 3-7 milestone tasks
   - For single pages/components, work directly without todos

3. **Ask Clarifying Questions** (if needed):
   - If request is vague ("build a business app"), ask specific questions
   - Understand the exact scope before planning
   - Get design preferences, color schemes, and brand guidelines

4. **Plan the Approach**:
   - Identify which tools to use (SearchRepo, GenerateDesignInspiration, GetOrRequestIntegration)
   - Determine if design inspiration is needed
   - Check if integrations are required
   - Plan the component hierarchy

### Example Thinking Process:
\`\`\`
User wants: "Landing page for email AI app"
Analysis:
- Single cohesive page (no todos needed)
- Design-focused request (needs GenerateDesignInspiration)
- No backend/integrations required
- Mobile-first responsive design needed
- Conversion-focused (email signup)

Action Plan:
1. Call GenerateDesignInspiration for visual direction
2. Call SearchRepo to understand codebase structure
3. Create components: Hero, Features, Pricing, CTA, Footer
4. Implement responsive grid layouts
5. Add smooth animations and transitions
\`\`\`

---

## 2. Context Gathering Strategy

### Parallel Tool Calls (Speed Optimization):
When multiple tools can run independently, call them simultaneously:

\`\`\`
GOOD (Parallel):
- SearchRepo for codebase overview
- GenerateDesignInspiration for design brief
- GetOrRequestIntegration for database schema
(All run at same time)

BAD (Sequential):
- SearchRepo first
- Then GenerateDesignInspiration
- Then GetOrRequestIntegration
(Wastes time waiting)
\`\`\`

### Systematic Search Approach:
1. **Broad Search First**: "Give me an overview of the codebase"
2. **Identify Patterns**: Look for existing components, utilities, styling patterns
3. **Find Similar Implementations**: Search for similar features already built
4. **Verify Architecture**: Understand how components connect and communicate
5. **Check Dependencies**: See what libraries and tools are available

### File Reading Strategy:
- **Small files (<2000 lines)**: Read entire file without query
- **Large files (>2000 lines)**: Use specific query to get relevant chunks
- **Before editing**: ALWAYS read the file first to understand current implementation
- **Multiple files**: Read all related files to understand the full system

### Example Context Gathering:
\`\`\`
Task: Add authentication to existing app

Step 1: SearchRepo("Give me an overview of the codebase")
→ Understand project structure, existing auth patterns

Step 2: GrepRepo("auth|Auth|login|Login")
→ Find all authentication-related code

Step 3: ReadFile(existing auth files)
→ Understand current implementation

Step 4: GetOrRequestIntegration(["Supabase"])
→ Check if auth service is connected

Step 5: Now ready to implement with full context
\`\`\`

---

## 3. Design Methodology

### Color System (3-5 Colors Maximum):
\`\`\`
Structure:
- 1 Primary Brand Color (main theme)
- 2-3 Neutral Colors (white, grays, off-whites, blacks)
- 1-2 Accent Colors (highlights, CTAs)

Example (Hospitality Theme):
- Primary: #d4a574 (warm gold/amber)
- Primary Dark: #b8935f (deeper gold)
- Secondary: #8b6f47 (earthy brown)
- Accent: #c9a961 (lighter gold)
- Background: #faf8f3 (warm off-white)
- Foreground: #1a1a1a (near black)
- Muted: #9ca3af (gray)
- Border: #e5e7eb (light gray)

Rules:
- Never exceed 5 colors without explicit permission
- Avoid purple/violet unless specifically requested
- If changing background, MUST change text color for contrast
- Use CSS variables for all colors (--color-primary, etc.)
\`\`\`

### Typography (Maximum 2 Font Families):
\`\`\`
Structure:
- 1 Font for Headings (can use multiple weights)
- 1 Font for Body Text

Example:
- Headings: "Playfair Display" (serif, elegant, 700 weight)
- Body: "Inter" (sans-serif, readable, 400-500 weight)

Rules:
- Line-height: 1.4-1.6 for body text (use leading-relaxed or leading-6)
- Never use decorative fonts for body text
- Minimum font size: 14px for body text
- Use text-balance or text-pretty for titles
\`\`\`

### Layout Method Priority:
\`\`\`
1. FLEXBOX (90% of layouts)
   - Most layouts: flex items-center justify-between
   - Spacing: use gap-4, gap-x-2, gap-y-6
   - Alignment: items-center, justify-between, justify-around

2. CSS GRID (Complex 2D layouts only)
   - Multi-column layouts: grid grid-cols-3 gap-4
   - Responsive: md:grid-cols-2 lg:grid-cols-3
   - Use gap classes for spacing

3. AVOID (unless absolutely necessary)
   - Floats
   - Absolute positioning
   - Arbitrary values (use Tailwind scale)

Example:
✓ GOOD: flex items-center justify-between gap-4
✗ BAD: flex items-center justify-between p-[16px] mx-[8px]
\`\`\`

### Responsive Design (Mobile-First):
\`\`\`
Breakpoints:
- Mobile: 0px (default)
- Tablet: md: 768px
- Desktop: lg: 1024px
- Large: xl: 1280px

Pattern:
1. Design for mobile first (no prefix)
2. Enhance for tablet (md: prefix)
3. Optimize for desktop (lg: prefix)

Example:
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
</div>
\`\`\`

### Design Tokens (Semantic CSS Variables):
\`\`\`
Always define in globals.css:

:root {
  --color-primary: #d4a574;
  --color-primary-dark: #b8935f;
  --color-secondary: #8b6f47;
  --color-accent: #c9a961;
  --color-background: #faf8f3;
  --color-foreground: #1a1a1a;
  --color-muted: #9ca3af;
  --color-border: #e5e7eb;
  --radius: 0.5rem;
}

Usage in code:
✓ GOOD: bg-[var(--color-primary)] text-[var(--color-foreground)]
✗ BAD: bg-white text-black (hardcoded colors)
\`\`\`

---

## 4. Code Organization & Architecture

### Project Structure:
\`\`\`
src/
├── layouts/
│   └── Layout.astro (main layout wrapper)
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
├── styles/
│   └── global.css (animations, utilities, design tokens)
└── pages/
    └── index.astro (main page)
\`\`\`

### Component Hierarchy:
\`\`\`
Layout.astro (wrapper)
├── Header.astro
├── HeroSection.astro
├── AboutSection.astro
├── RoomsSection.astro
│   └── RoomCard (with modal)
├── AmenitiesSection.astro
├── GallerySection.astro
├── TestimonialsSection.astro
├── ContactSection.astro
├── Footer.astro
└── FloatingWhatsApp.astro
\`\`\`

### Component Responsibility:
- **Each component = one section/feature**
- **Single Responsibility Principle**: Component does one thing well
- **Reusable patterns**: Extract common patterns into utilities
- **Props over hardcoding**: Make components flexible
- **Clear naming**: Component name = what it does

---

## 5. Component Development Pattern

### Astro Component Structure:
\`\`\`astro
---
// 1. IMPORTS (top of file)
import { Image } from 'astro:assets';

// 2. PROPS & TYPES (if needed)
interface Props {
  title: string;
  description: string;
  items: Array<{id: string; name: string}>;
}

const { title, description, items } = Astro.props;

// 3. LOGIC (data processing, calculations)
const processedItems = items.map(item => ({
  ...item,
  slug: item.name.toLowerCase().replace(/\s+/g, '-')
}));

// 4. COMPUTED VALUES
const itemCount = processedItems.length;
---

<!-- 5. TEMPLATE (HTML structure) -->
<section class="py-12 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
    <p class="text-muted mb-8">{description}</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {processedItems.map(item => (
        <div class="card">
          <h3>{item.name}</h3>
        </div>
      ))}
    </div>
  </div>
</section>

<!-- 6. STYLES (scoped to component) -->
<style>
  .card {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
</style>
\`\`\`

### Best Practices:
- **Semantic HTML**: Use `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`
- **ARIA attributes**: Add roles and labels for accessibility
- **Alt text**: All images must have descriptive alt text
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
- **Screen reader text**: Use sr-only class for screen reader only content

---

## 6. Responsive Design Approach

### Mobile-First Workflow:
\`\`\`
Step 1: Design for mobile (320px - 480px)
- Single column layouts
- Large touch targets (44px minimum)
- Simplified navigation
- Stacked elements

Step 2: Enhance for tablet (768px - 1024px)
- Two column layouts
- More whitespace
- Horizontal navigation
- Optimized spacing

Step 3: Optimize for desktop (1024px+)
- Three+ column layouts
- Full feature set
- Hover states
- Advanced interactions

Example:
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  <!-- Responsive grid with responsive gaps -->
</div>
\`\`\`

### Responsive Images:
\`\`\`astro
<!-- Use srcset for responsive images -->
<img 
  src="/images/hero-mobile.jpg"
  srcset="/images/hero-mobile.jpg 480w, /images/hero-tablet.jpg 768w, /images/hero-desktop.jpg 1024w"
  sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 100vw"
  alt="Hero section"
  class="w-full h-auto"
/>

<!-- Or use Astro Image component -->
<Image 
  src={heroImage || "/placeholder.svg"}
  alt="Hero section"
  class="w-full h-auto"
/>
\`\`\`

### Responsive Typography:
\`\`\`
Mobile: text-lg (18px)
Tablet: md:text-xl (20px)
Desktop: lg:text-2xl (24px)

Pattern:
<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>
\`\`\`

---

## 7. Animation & UX Principles

### Animation Strategy:
\`\`\`
Purpose: Enhance UX, not distract
Duration: 0.3s - 0.8s (fast, snappy)
Easing: ease-out (natural feel)
Trigger: Hover, scroll, load, interaction

Common Animations:
- Fade in: opacity 0 → 1
- Slide in: transform translateX/Y
- Scale: transform scale
- Glow: box-shadow pulse
- Float: subtle up/down movement
\`\`\`

### Animation Implementation:
\`\`\`css
/* Define in global.css */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Use in components */
<div class="animate-fade-in-up">Content</div>
\`\`\`

### Hover States:
\`\`\`
Always provide visual feedback:
- Color change
- Scale/transform
- Shadow enhancement
- Cursor change

Example:
<button class="bg-primary hover:bg-primary-dark transition-colors duration-300">
  Click me
</button>
\`\`\`

### Scroll Animations:
\`\`\`
Use Intersection Observer for scroll-triggered animations:
- Fade in on scroll
- Slide in on scroll
- Count up animations
- Parallax effects

Pattern:
1. Add animation class to element
2. Use JavaScript to detect scroll
3. Add class when element enters viewport
4. Remove class when leaves viewport
\`\`\`

### Floating WhatsApp Button Animation:
\`\`\`
Pulsing effect with glow:
- Pulse animation (opacity change)
- Glow animation (box-shadow)
- Float animation (subtle movement)
- Hover scale effect

Implementation:
<button class="animate-pulse animate-glow animate-float hover:scale-110">
  WhatsApp
</button>
\`\`\`

---

## 8. Conversion Optimization

### CTA Button Strategy:
\`\`\`
Principles:
- Visible phone numbers (not just icons)
- Multiple CTAs throughout page
- Clear value proposition
- Urgency/scarcity messaging
- High contrast colors
- Large touch targets (44px+)

Example:
<a href="tel:+919933437469" class="flex items-center gap-2 bg-green-500 hover:bg-green-600">
  <svg><!-- phone icon --></svg>
  <span>+91 9933437469</span>
</a>
\`\`\`

### Floating Action Button:
\`\`\`
Best practices:
- Bottom-right corner (standard)
- Pulsing animation to attract attention
- Always visible (fixed positioning)
- High z-index (z-50+)
- Accessible (keyboard navigation)
- Mobile-optimized size

Implementation:
<button 
  class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 animate-pulse animate-glow"
  aria-label="Contact via WhatsApp"
>
  WhatsApp
</button>
\`\`\`

### Form Optimization:
\`\`\`
- Minimal fields (only essential)
- Clear labels
- Helpful placeholder text
- Error messages
- Success feedback
- Mobile-friendly inputs
- Auto-focus first field
\`\`\`

### Page Speed:
\`\`\`
- Optimize images (use WebP, compress)
- Lazy load images below fold
- Minimize CSS/JS
- Use CSS variables (no runtime calculations)
- Avoid heavy animations on mobile
- Preload critical resources
\`\`\`

---

## 9. File Naming & Organization

### Naming Conventions:
\`\`\`
Components: PascalCase
- Header.astro
- HeroSection.astro
- RoomCard.astro
- FloatingWhatsApp.astro

Utilities: kebab-case
- animation-utils.ts
- color-helpers.ts
- responsive-utils.ts

Styles: kebab-case
- global.css
- animations.css
- responsive.css

Images: kebab-case
- hero-image.jpg
- room-gallery-01.jpg
- testimonial-avatar.jpg

Pages: kebab-case
- index.astro
- about.astro
- contact.astro
\`\`\`

### File Organization:
\`\`\`
src/
├── layouts/
│   └── Layout.astro (main wrapper)
├── components/
│   ├── sections/ (page sections)
│   │   ├── HeroSection.astro
│   │   ├── RoomsSection.astro
│   │   └── FooterSection.astro
│   ├── common/ (reusable components)
│   │   ├── Header.astro
│   │   ├── Button.astro
│   │   └── Card.astro
│   └── interactive/ (interactive elements)
│       ├── Modal.astro
│       ├── FloatingWhatsApp.astro
│       └── Carousel.astro
├── styles/
│   ├── global.css (design tokens, animations)
│   ├── animations.css (keyframes)
│   └── responsive.css (media queries)
├── utils/
│   ├── constants.ts (prices, contact info)
│   ├── helpers.ts (utility functions)
│   └── types.ts (TypeScript interfaces)
└── pages/
    └── index.astro
\`\`\`

---

## 10. Development Workflow

### Step-by-Step Process:

#### Phase 1: Planning (5-10 minutes)
\`\`\`
1. Read user request carefully
2. Identify project type (single page vs multi-system)
3. Determine if todos needed
4. List required tools/integrations
5. Plan component hierarchy
6. Sketch design approach
\`\`\`

#### Phase 2: Context Gathering (5-15 minutes)
\`\`\`
1. Use parallel tool calls where possible
2. SearchRepo for codebase overview
3. GenerateDesignInspiration if needed
4. GetOrRequestIntegration if needed
5. Read relevant existing files
6. Understand patterns and architecture
\`\`\`

#### Phase 3: Design (5-10 minutes)
\`\`\`
1. Define color palette (3-5 colors)
2. Choose typography (2 fonts max)
3. Plan layout structure (flexbox/grid)
4. Sketch responsive breakpoints
5. Plan animations and interactions
6. Create design tokens in CSS
\`\`\`

#### Phase 4: Implementation (20-40 minutes)
\`\`\`
1. Create Layout.astro wrapper
2. Build components from top to bottom
3. Implement responsive design
4. Add animations and transitions
5. Optimize for mobile first
6. Test accessibility
\`\`\`

#### Phase 5: Polish (5-10 minutes)
\`\`\`
1. Review animations
2. Check responsive design
3. Verify accessibility
4. Optimize images
5. Test on mobile
6. Final tweaks
\`\`\`

### Code Review Checklist:
\`\`\`
Before submitting code:
- [ ] Mobile-first responsive design
- [ ] Semantic HTML used
- [ ] ARIA attributes added
- [ ] Alt text on images
- [ ] Color contrast sufficient
- [ ] Animations smooth and purposeful
- [ ] No hardcoded colors (use CSS variables)
- [ ] Maximum 2 fonts used
- [ ] 3-5 colors maximum
- [ ] Flexbox/Grid used appropriately
- [ ] Touch targets 44px+ on mobile
- [ ] Performance optimized
- [ ] Accessibility tested
- [ ] Cross-browser compatible
\`\`\`

### Editing Existing Files:
\`\`\`
Pattern:
1. Read file first (understand current code)
2. Identify what needs to change
4. Add "// " comment before modifications
5. Keep changes minimal and focused
6. Write postamble explaining changes

Example:

<button class="bg-primary hover:bg-primary-dark transition-colors">
  Click me
</button>

\`\`\`

### Debugging Process:
\`\`\`
1. Add console.log("[v0] ...") statements
2. Check browser console for output
3. Trace execution flow
4. Inspect variable states
5. Identify issue
6. Fix code
7. Remove debug statements with comment
\`\`\`

---

## 11. Specific Patterns for Common Tasks

### Building a Room Card with Modal:
\`\`\`astro
---
interface Props {
  roomName: string;
  price: number;
  features: string[];
  images: string[];
}

const { roomName, price, features, images } = Astro.props;
---

<div class="room-card group cursor-pointer" data-room={roomName}>
  <div class="relative overflow-hidden rounded-lg">
    <img 
      src={images[0] || "/placeholder.svg"} 
      alt={roomName}
      class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
  </div>
  
  <div class="p-4">
    <h3 class="text-xl font-bold mb-2">{roomName}</h3>
    <p class="text-2xl font-bold text-primary mb-4">₹{price}</p>
    <button 
      class="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded transition-colors"
      onclick="openModal('{roomName}')"
    >
      View Details
    </button>
  </div>
</div>

<style>
  .room-card {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .room-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
</style>
\`\`\`

### Building a Floating WhatsApp Button:
\`\`\`astro
---
const whatsappNumber = "+919933437469";
const whatsappMessage = "Hello! I'm interested in booking a room at Sri Janaki Mahal Trust.";
const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
---

<a 
  href={whatsappUrl}
  target="_blank"
  rel="noopener noreferrer"
  class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg animate-pulse animate-glow hover:scale-110 transition-transform"
  aria-label="Contact via WhatsApp"
>
  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.335 1.236-3.356 2.258-1.688 1.694-2.637 3.957-2.637 6.38 0 1.059.135 2.143.395 3.199L2.9 22l3.486-.999c1.091.63 2.215.889 3.383.889 2.225 0 4.335-.787 5.92-2.256 1.584-1.469 2.773-3.44 3.282-5.603.509-2.163.454-4.379-.3-6.467-.75-2.088-2.189-3.882-4.003-5.028-1.815-1.147-3.924-1.77-6.08-1.77z"/>
  </svg>
  <span class="hidden sm:inline">WhatsApp</span>
</a>

<style>
  @keyframes pulse-ring {
    0% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }
  
  .animate-pulse-ring {
    animation: pulse-ring 2s infinite;
  }
</style>
\`\`\`

### Building a Gallery with Scroll:
\`\`\`astro
---
const images = [
  { src: '/images/gallery-1.jpg', alt: 'Gallery 1' },
  { src: '/images/gallery-2.jpg', alt: 'Gallery 2' },
  // ... more images
];
---

<section class="py-12">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-3xl font-bold mb-8">Gallery</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div class="relative overflow-hidden rounded-lg h-64 group">
          <img 
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
        </div>
      ))}
    </div>
  </div>
</section>
\`\`\`

---

## 12. Performance Optimization Tips

### Image Optimization:
\`\`\`
1. Use WebP format with fallbacks
2. Compress images (TinyPNG, ImageOptim)
3. Lazy load images below fold
4. Use srcset for responsive images
5. Specify width/height to prevent layout shift
6. Use CSS background-image for decorative images
\`\`\`

### CSS Optimization:
\`\`\`
1. Use CSS variables (no runtime calculations)
2. Minimize animations on mobile
3. Use transform/opacity for animations (GPU accelerated)
4. Avoid expensive properties (box-shadow, blur)
5. Use will-change sparingly
6. Minify CSS in production
\`\`\`

### JavaScript Optimization:
\`\`\`
1. Minimize JavaScript
2. Defer non-critical scripts
3. Use event delegation
4. Debounce scroll/resize events
5. Cache DOM queries
6. Use requestAnimationFrame for animations
\`\`\`

---

## 13. Accessibility Checklist

### WCAG 2.1 Compliance:
\`\`\`
Color & Contrast:
- [ ] Text contrast ratio 4.5:1 (normal text)
- [ ] Text contrast ratio 3:1 (large text)
- [ ] Color not sole means of conveying information

Keyboard Navigation:
- [ ] All interactive elements keyboard accessible
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] No keyboard traps

Screen Readers:
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Alt text on images
- [ ] Form labels associated
- [ ] Skip links provided

Motion & Animation:
- [ ] Animations can be disabled (prefers-reduced-motion)
- [ ] No auto-playing videos/audio
- [ ] No flashing content (>3 times/second)

Responsive:
- [ ] Mobile-friendly (320px minimum)
- [ ] Touch targets 44px minimum
- [ ] Readable text (16px minimum)
- [ ] Zoom to 200% works
\`\`\`

---

## 14. Common Mistakes to Avoid

\`\`\`
1. ✗ Hardcoding colors instead of using CSS variables
2. ✗ Using more than 2 fonts
3. ✗ Using more than 5 colors
4. ✗ Absolute positioning for layout
5. ✗ Not reading files before editing
6. ✗ Skipping mobile-first design
7. ✗ Animations that distract from content
8. ✗ Missing alt text on images
9. ✗ Insufficient color contrast
10. ✗ Not testing on actual mobile devices
11. ✗ Using arbitrary Tailwind values instead of scale
12. ✗ Mixing margin/padding with gap classes
13. ✗ Not using semantic HTML
14. ✗ Forgetting accessibility considerations
15. ✗ Not optimizing images
\`\`\`

---

## 15. Quick Reference Commands

### Astro Component Template:
\`\`\`astro
---
// Imports
import { Image } from 'astro:assets';

// Props
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<section class="py-12 px-4">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl md:text-4xl font-bold">{title}</h2>
  </div>
</section>

<style>
  /* Scoped styles */
</style>
\`\`\`

### Responsive Grid:
\`\`\`
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  <!-- Content -->
</div>
\`\`\`

### Flexbox Container:
\`\`\`
<div class="flex flex-col md:flex-row items-center justify-between gap-4">
  <!-- Content -->
</div>
\`\`\`

### Button with CTA:
\`\`\`
<button class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded transition-colors">
  Call to Action
</button>
\`\`\`

### Card Component:
\`\`\`
<div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
  <!-- Content -->
</div>
\`\`\`

---

## 16. Design System for Hospitality/Spiritual Brands

### Color Palette:
\`\`\`
Primary: #d4a574 (warm gold)
Primary Dark: #b8935f (deeper gold)
Secondary: #8b6f47 (earthy brown)
Accent: #c9a961 (lighter gold)
Background: #faf8f3 (warm off-white)
Foreground: #1a1a1a (near black)
Success: #22c55e (green for WhatsApp)
\`\`\`

### Typography:
\`\`\`
Headings: Playfair Display (serif, elegant)
Body: Inter (sans-serif, readable)
Sizes: 14px (small), 16px (body), 18px (large), 24px (heading), 32px (large heading)
\`\`\`

### Spacing Scale:
\`\`\`
4px (0.25rem)
8px (0.5rem)
12px (0.75rem)
16px (1rem)
24px (1.5rem)
32px (2rem)
48px (3rem)
64px (4rem)
\`\`\`

### Border Radius:
\`\`\`
Small: 0.25rem (4px)
Medium: 0.5rem (8px)
Large: 1rem (16px)
Full: 9999px (circles)
\`\`\`

### Shadow System:
\`\`\`
Small: 0 2px 8px rgba(0, 0, 0, 0.1)
Medium: 0 4px 12px rgba(0, 0, 0, 0.15)
Large: 0 8px 24px rgba(0, 0, 0, 0.2)
\`\`\`

---

## 17. Final Tips for Success

1. **Always think before coding** - Use <Thinking> tags to plan
2. **Gather context systematically** - Use parallel tool calls
3. **Mobile-first always** - Design for small screens first
4. **Use design tokens** - Never hardcode colors
5. **Keep it simple** - 2 fonts, 3-5 colors, flexbox/grid
6. **Accessibility first** - WCAG compliance is non-negotiable
7. **Test on real devices** - Don't just test in browser
8. **Optimize images** - Compress and use modern formats
9. **Document your code** - Comments for complex logic
10. **Iterate and refine** - Polish makes the difference

---

## Summary

This workflow combines:
- **Strategic thinking** (planning before coding)
- **Systematic context gathering** (understanding the full system)
- **Design discipline** (limited colors, fonts, clear hierarchy)
- **Code organization** (clear structure, reusable components)
- **Responsive design** (mobile-first, accessible)
- **Performance optimization** (fast, efficient)
- **Accessibility** (inclusive for all users)
- **Conversion focus** (clear CTAs, user-friendly)

By following this methodology, you'll create beautiful, functional, accessible, and high-converting web experiences consistently.
