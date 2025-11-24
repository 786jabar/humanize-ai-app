# Humanize.AI - Figma Design Guide

## 🎨 Design System

### Color Palette

**Primary Colors:**
- Brand Purple: `#8B5CF6` (RGB: 139, 92, 246)
- Brand Indigo: `#6366F1` (RGB: 99, 102, 241)
- Dark Background: `#0F172A` (RGB: 15, 23, 42)
- Light Background: `#F8FAFC` (RGB: 248, 250, 252)

**Accent Colors:**
- Success Green: `#10B981` (RGB: 16, 185, 145)
- Warning Orange: `#F59E0B` (RGB: 245, 158, 11)
- Danger Red: `#EF4444` (RGB: 239, 68, 68)
- Info Blue: `#3B82F6` (RGB: 59, 130, 246)

**Text Colors:**
- Text Primary: `#1E293B` (light mode) / `#F1F5F9` (dark mode)
- Text Secondary: `#64748B` (light mode) / `#CBD5E1` (dark mode)
- Text Tertiary: `#94A3B8` (light mode) / `#475569` (dark mode)

**Borders:**
- Border Light: `#E2E8F0` (light mode)
- Border Dark: `#334155` (dark mode)

---

## 🔤 Typography

**Font Family:** Inter (fallback: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif)

**Font Sizes & Usage:**
- **H1** (Hero Title): 48px, Font Weight 700, Line Height 1.2
- **H2** (Section Title): 36px, Font Weight 700, Line Height 1.3
- **H3** (Component Title): 24px, Font Weight 700, Line Height 1.3
- **Body Large**: 16px, Font Weight 400, Line Height 1.5
- **Body Regular**: 14px, Font Weight 400, Line Height 1.5
- **Body Small**: 12px, Font Weight 400, Line Height 1.4
- **Label**: 12px, Font Weight 600, Line Height 1.4
- **Caption**: 11px, Font Weight 500, Line Height 1.4

---

## 📏 Spacing & Layout

**Grid System:** 4px base unit

**Common Spacing Values:**
- xs: 4px (2 units)
- sm: 8px (4 units)
- md: 12px (6 units)
- lg: 16px (8 units)
- xl: 24px (12 units)
- 2xl: 32px (16 units)
- 3xl: 48px (24 units)

**Container Widths:**
- Mobile: 320px - 480px
- Tablet: 768px - 1024px
- Desktop: 1440px
- Max Content Width: 1200px

**Padding:**
- Page Padding (Desktop): 32px
- Page Padding (Tablet): 24px
- Page Padding (Mobile): 16px

---

## 🧩 Component Specifications

### Buttons

**Primary Button:**
- Background: Linear gradient (Purple to Indigo)
- Text Color: White
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600
- Font Size: 14px
- States: Normal, Hover (opacity 90%), Active (opacity 80%), Disabled (opacity 50%)

**Secondary Button:**
- Background: Transparent
- Border: 2px solid Brand Purple
- Text Color: Brand Purple
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600

**Ghost Button:**
- Background: Transparent
- Text Color: Brand Purple
- No border
- Padding: 12px 16px
- Hover: Background #F3E8FF (light) / #3E3B52 (dark)

### Input Fields

**Text Input:**
- Height: 40px
- Padding: 12px 16px
- Border: 1px solid Border Light
- Border Radius: 8px
- Font Size: 14px
- Placeholder Color: Text Tertiary
- Focus: Border color changes to Brand Purple, Box shadow: 0 0 0 3px rgba(139, 92, 246, 0.1)

**Textarea:**
- Min Height: 120px
- Padding: 12px 16px
- Border: 1px solid Border Light
- Border Radius: 8px
- Font Size: 14px
- Line Height: 1.5
- Resize: Vertical

### Dropdown/Select

- Height: 40px
- Padding: 12px 16px
- Border: 1px solid Border Light
- Border Radius: 8px
- Arrow Icon: Chevron Down, Brand Purple
- Hover: Background Light Background
- Open: Border color Brand Purple

### Cards

**Standard Card:**
- Background: White (light) / `#1E293B` (dark)
- Border: 1px solid Border Light/Dark
- Border Radius: 12px
- Padding: 24px
- Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

**Elevated Card:**
- Same as above
- Box Shadow: 0 10px 15px rgba(0, 0, 0, 0.1)

### Badge/Tags

- Padding: 6px 12px
- Border Radius: 20px
- Font Size: 12px
- Font Weight: 600
- Background: Accent color (20% opacity)
- Text: Accent color (full opacity)

---

## 📱 Page Layouts

### Home Page (Main)

**Header Section (Desktop: 1440px)**
- Logo (left): Humanize.AI text with gradient
- Navigation (right): Links, Theme Toggle, Profile
- Height: 64px
- Sticky to top

**Main Content Area:**
- Two Column Layout
  - **Left Column (60%):** Input text area
    - Title: "Enter Your Text"
    - Textarea with placeholder
    - Character count below
  - **Right Column (40%):** Settings & Output
    - Settings card with dropdowns
    - Output display area

**Sidebar/Advanced Tools:**
- Tabs: Transform, Summarize, Score, Citations
- Icon + Label for each tab

**Footer:**
- Small text: Copyright, Links
- Sticky to bottom or after content

### Mobile Layout (375px)

- Single column layout
- Header simplified
- Stack input on top of output
- Settings as collapsible drawer
- Full-width buttons

### Tablet Layout (768px)

- Slightly adjusted spacing
- Sidebar collapses to hamburger menu
- Cards stack vertically

---

## ✨ Key Design Elements

### Gradients

**Primary Gradient (Left to Right):**
- Start: `#8B5CF6` (Purple)
- End: `#6366F1` (Indigo)
- Used for: Primary buttons, headers, accents

**Subtle Background Gradient:**
- Start: `#F8FAFC` with slight purple tint
- End: `#F1F5F9`
- Used for: Page background

### Shadows

**Elevation 1:** `0 1px 3px rgba(0, 0, 0, 0.1)`
**Elevation 2:** `0 4px 6px rgba(0, 0, 0, 0.1)`
**Elevation 3:** `0 10px 15px rgba(0, 0, 0, 0.1)`
**Elevation 4:** `0 20px 25px rgba(0, 0, 0, 0.15)`

### Border Radius

- Small: 4px (inputs, small components)
- Medium: 8px (buttons, cards)
- Large: 12px (larger cards)
- Full: 9999px (badges, pills)

### Transitions

- Default: `all 0.2s ease-in-out`
- Used for: Hover states, color changes
- Avoid long animations (keep under 300ms)

---

## 🎯 Responsive Breakpoints

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| Mobile | 320px - 479px | Phones |
| Tablet | 480px - 1023px | Tablets |
| Desktop | 1024px+ | Laptops/Monitors |

---

## 🖼️ Page Flow

1. **Landing/Home** - Main text transformation interface
2. **Academic Assistant** - Pre-built templates and guides
3. **Settings** - User preferences and theme
4. **Profile** - User account information
5. **Logout** - Exit and return to login

---

## 📋 Design Checklist for Figma

- [ ] Create color styles for all colors
- [ ] Create typography styles for all text sizes
- [ ] Create component variants for buttons
- [ ] Create component variants for input fields
- [ ] Create card component with variations
- [ ] Design header component (responsive)
- [ ] Design home page layout (desktop)
- [ ] Design home page layout (mobile)
- [ ] Design home page layout (tablet)
- [ ] Design settings panel
- [ ] Design output display area
- [ ] Design theme toggle switch
- [ ] Add hover/active states to all interactive elements
- [ ] Create prototypes showing page transitions
- [ ] Export design as Figma public link for development handoff

---

## 🚀 Quick Figma Setup Steps

1. **Create new file:** Humanize.AI Design
2. **Set artboard:** 1440px (desktop) as main
3. **Import colors:** Create color library
4. **Import fonts:** Add Inter font from Google Fonts
5. **Build components:** Buttons, inputs, cards first
6. **Design pages:** Home, Settings, Profile
7. **Add variants:** Create interactive states
8. **Prototype:** Link pages together
9. **Share:** Export for development team

---

## 💡 Design Tips

- Always use the gradient for primary CTAs (Call-to-Action buttons)
- Maintain at least 12px spacing between elements
- Use consistent padding on all cards (24px)
- Keep font hierarchy clear (H1 should be 2-3x H3)
- Test dark mode for all colors (use the dark palette above)
- Use icons consistently (lucide-react icons as reference)
- Ensure touch targets are at least 44px for mobile
- Test color contrast for accessibility (WCAG AA minimum)

