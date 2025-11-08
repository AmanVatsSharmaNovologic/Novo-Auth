# GenerateDesignInspiration Equivalent for Cursor AI

## What GenerateDesignInspiration Does (v0 Tool)
- Takes vague design requests → generates detailed design briefs
- Provides: color palettes, typography, layout suggestions, creative direction
- Prevents building ugly/boring designs by adding creative specifications
- Saves time by clarifying design vision before coding

---

## CURSOR AI EQUIVALENT: Design Brief Generator

### Method 1: Use This Prompt Template in Cursor

**Save this as `.cursorrules` or use in chat:**

\`\`\`
## DESIGN INSPIRATION GENERATOR

When user asks for design without specific visual requirements:

1. ANALYZE REQUEST
   - Extract: purpose, audience, mood, industry
   - Identify: vague vs specific requirements

2. GENERATE DESIGN BRIEF (output this structure):
   
   ### Visual Direction
   - Aesthetic: [style name]
   - Mood: [emotional tone]
   - Inspiration: [reference style]
   
   ### Color Palette (3-5 colors max)
   - Primary: [color + hex + usage]
   - Secondary: [color + hex + usage]
   - Accent: [color + hex + usage]
   - Neutral: [color + hex + usage]
   
   ### Typography
   - Heading Font: [font name + why]
   - Body Font: [font name + why]
   - Size Scale: [hierarchy]
   
   ### Layout Strategy
   - Primary Method: [flexbox/grid/float]
   - Spacing: [scale system]
   - Breakpoints: [mobile/tablet/desktop]
   
   ### Key Design Elements
   - Hero: [description]
   - Cards/Components: [style]
   - Buttons: [style + hover states]
   - Animations: [subtle/moderate/bold]
   
   ### Conversion Focus
   - Primary CTA: [placement + style]
   - Secondary CTA: [placement + style]
   - Trust Elements: [testimonials/badges/etc]

3. THEN BUILD based on this brief
\`\`\`

---

### Method 2: Quick Design Brief Prompt

**Copy-paste this into Cursor when you need design inspiration:**

\`\`\`
Generate a design brief for: [YOUR REQUEST]

Output format:
AESTHETIC: [style]
COLORS: [5 colors with hex codes]
FONTS: [heading font, body font]
LAYOUT: [primary method]
MOOD: [emotional tone]
KEY ELEMENTS: [3-5 main design features]
ANIMATIONS: [yes/no, what type]
CTA STRATEGY: [how to drive conversions]

Then build the design following this brief.
\`\`\`

---

### Method 3: Integrated Cursor Workflow

**Add to your `.cursorrules` file:**

\`\`\`
## DESIGN WORKFLOW

STEP 1: Clarify Design Intent
- If request is vague, ask: "What's the mood? Who's the audience? What action should users take?"

STEP 2: Generate Design Brief
- Create visual specifications before coding
- Include: colors, fonts, layout, animations, CTAs

STEP 3: Build with Brief
- Reference brief throughout development
- Maintain consistency across components

STEP 4: Polish & Iterate
- Check: contrast, spacing, animations, mobile responsiveness
- Verify: all CTAs visible, conversion paths clear
\`\`\`

---

## PRACTICAL EXAMPLES

### Example 1: Landing Page Request
**User says:** "Build me a landing page for an email AI app"

**Cursor generates brief:**
\`\`\`
AESTHETIC: Modern, tech-forward, trustworthy
COLORS: 
  - Primary: #2563EB (blue - trust)
  - Secondary: #10B981 (green - growth)
  - Accent: #F59E0B (amber - energy)
  - Neutral: #1F2937, #F3F4F6
FONTS: Inter (heading), Poppins (body)
LAYOUT: Hero → Features → Testimonials → CTA
MOOD: Professional yet approachable
KEY ELEMENTS: 
  - Bold hero with gradient
  - Feature cards with icons
  - Social proof section
  - Email input form
ANIMATIONS: Subtle fade-ins, hover lift effects
CTA: "Start Free Trial" (green, sticky header + hero + footer)
\`\`\`

**Then builds based on this brief**

---

### Example 2: Hospitality Site (Like Sri Janaki Mahal)
**User says:** "Build a landing page for a spiritual accommodation trust"

**Cursor generates brief:**
\`\`\`
AESTHETIC: Spiritual, luxurious, warm, welcoming
COLORS:
  - Primary: #D97706 (amber/gold - spirituality)
  - Secondary: #DC2626 (deep red - tradition)
  - Accent: #059669 (green - nature/peace)
  - Neutral: #FEF3C7, #1F2937
FONTS: Playfair Display (heading - elegant), Lato (body - readable)
LAYOUT: Hero → Rooms Grid → Gallery → Testimonials → Contact
MOOD: Serene, premium, trustworthy
KEY ELEMENTS:
  - Temple/spiritual imagery
  - Room cards with prices
  - Floating WhatsApp button
  - Guest testimonials
  - Location map
ANIMATIONS: Pulsing WhatsApp button, smooth scrolls, fade-ins
CTA: WhatsApp booking (visible on every room card + floating button)
\`\`\`

---

## HOW TO USE IN CURSOR

### Option A: System Prompt
1. Go to Cursor Settings → Rules
2. Add the Design Brief Generator prompt
3. Cursor will auto-generate briefs for vague requests

### Option B: Chat Command
1. Type: `/design [your request]`
2. Cursor generates brief
3. Then builds it

### Option C: Manual Workflow
1. Paste the brief template in chat
2. Fill it out for your design
3. Tell Cursor: "Build this design brief"

---

## DESIGN BRIEF CHECKLIST

Before building ANY design, ensure you have:

- [ ] Aesthetic/Style defined
- [ ] 3-5 colors with hex codes
- [ ] 2 fonts (heading + body)
- [ ] Primary layout method (flexbox/grid)
- [ ] Mood/emotional tone
- [ ] Key design elements listed
- [ ] Animation strategy
- [ ] Primary CTA placement
- [ ] Mobile-first approach confirmed
- [ ] Conversion goals clear

---

## QUICK REFERENCE: Design Brief Template

\`\`\`
PROJECT: [name]
AESTHETIC: [style]
COLORS: [primary, secondary, accent, neutral]
FONTS: [heading], [body]
LAYOUT: [method]
MOOD: [tone]
ELEMENTS: [key features]
ANIMATIONS: [yes/no]
PRIMARY CTA: [action + placement]
MOBILE FIRST: [yes]
CONVERSION GOAL: [what should users do]
\`\`\`

---

## INTEGRATION WITH CURSOR AI

### In `.cursorrules`:
\`\`\`
## DESIGN PROCESS

1. For vague design requests:
   - Generate design brief first
   - Include: colors, fonts, layout, mood, CTAs
   - Show brief to user before building

2. For specific requests:
   - Extract visual requirements
   - Build immediately

3. Always ensure:
   - Mobile-first responsive
   - Clear CTAs
   - Accessible contrast
   - Smooth animations
\`\`\`

### In Chat:
\`\`\`
@design Generate a brief for: [request]

Then build it following the brief exactly.
\`\`\`

---

## WHEN TO USE DESIGN INSPIRATION

✓ User request is vague ("make a nice landing page")
✓ No specific visual requirements given
✓ Complex multi-section design
✓ Need creative direction
✓ Want to avoid boring/ugly designs

✗ User provides exact mockups
✗ User specifies exact colors/fonts
✗ Simple single-component request
✗ Copying existing design

---

## EXAMPLE CURSOR WORKFLOW

**User:** "Build a landing page for a coffee shop"

**Cursor (auto-generates):**
\`\`\`
AESTHETIC: Warm, artisanal, inviting
COLORS: #8B4513 (brown), #D2691E (tan), #2F1B0C (dark), #F5DEB3 (cream)
FONTS: Merriweather (heading), Open Sans (body)
LAYOUT: Hero → About → Menu → Testimonials → Contact
MOOD: Cozy, premium, community-focused
KEY ELEMENTS: Coffee imagery, menu showcase, location map, booking CTA
ANIMATIONS: Subtle fade-ins, hover effects on menu items
CTA: "Reserve Table" (brown button, sticky + hero + footer)
\`\`\`

**Then builds:** Hero with coffee image → About section → Menu grid → Testimonials carousel → Contact form → Footer

---

## SUMMARY

| Tool | What It Does | Cursor Equivalent |
|------|-------------|------------------|
| GenerateDesignInspiration | Generates design briefs | Use prompt template + brief generator |
| Input | Vague design request | Paste request into Cursor |
| Output | Detailed visual specs | Color palette, fonts, layout, mood |
| Result | Beautiful, consistent design | Build following the brief |

**Key Difference:** v0's tool is automated; Cursor's is manual but equally effective when you use the template.

---

## FINAL TIP

**Save this as a Cursor snippet:**
\`\`\`
Design Brief for: [PROJECT]
Aesthetic: 
Colors: 
Fonts: 
Layout: 
Mood: 
Elements: 
CTAs: 
\`\`\`

Type `@brief` in Cursor to auto-fill this template!
