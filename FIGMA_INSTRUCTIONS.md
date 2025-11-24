# How to Build Your Humanize.AI Design in Figma - Step by Step

## 🎯 Goal
Create a professional Figma design for your Humanize.AI app using the design guide.

---

## Step 1: Create a New Figma Project (5 minutes)

1. Go to **figma.com** and log in (or create account)
2. Click **"+ New Design file"**
3. Name it: **"Humanize.AI Design"**
4. You're ready to start!

---

## Step 2: Set Up Design Grid & Artboards (5 minutes)

1. Right-click canvas → **"Add Frame"**
2. Set width: **1440px** (Desktop)
3. Set height: **900px** (Viewport height)
4. Rename frame: **"Home - Desktop"**

**Add more frames for responsive:**
- Add frame: 768px × 1024px → Name: **"Home - Tablet"**
- Add frame: 375px × 812px → Name: **"Home - Mobile"**

---

## Step 3: Create Color Styles (10 minutes)

1. Open **Assets panel** (left sidebar)
2. Click **"Colors"** icon
3. Create each color from DESIGN_GUIDE.md:

**Add Colors:**
- Brand Purple: `#8B5CF6`
- Brand Indigo: `#6366F1`
- Dark Background: `#0F172A`
- Light Background: `#F8FAFC`
- Success Green: `#10B981`
- Warning Orange: `#F59E0B`
- Danger Red: `#EF4444`
- Info Blue: `#3B82F6`

**For each color:**
1. Create a rectangle
2. Fill with the color
3. Right-click fill → **"Create color style"**
4. Name it (e.g., "Brand/Purple")
5. Delete the rectangle

---

## Step 4: Add Typography Styles (10 minutes)

1. **Add text layer** (T icon in toolbar)
2. Type some text
3. Set font: **Inter** (Google Fonts - Figma will suggest)
4. Set size & weight according to DESIGN_GUIDE.md
5. Right-click text → **"Create text style"**
6. Name it (e.g., "Heading 1 - 48px/700")
7. Repeat for each text size

**Create these styles:**
- H1: 48px, weight 700
- H2: 36px, weight 700
- H3: 24px, weight 700
- Body Large: 16px, weight 400
- Body Regular: 14px, weight 400
- Body Small: 12px, weight 400

---

## Step 5: Create Button Component (10 minutes)

1. **Rectangle tool** (R key)
2. Draw button: 120px wide × 44px tall
3. Fill: Brand Purple
4. Border Radius: 8px
5. Add text inside: "Button"
   - Font: Inter, 14px, weight 600
   - Color: White
6. **Right-click** → **"Create component"**
7. Name: **"Button/Primary"**

**Create button variants:**
- **Hover state:** Duplicate, reduce opacity to 90%
- **Active state:** Duplicate, reduce opacity to 80%
- **Disabled state:** Duplicate, reduce opacity to 50%

---

## Step 6: Create Input Field Component (8 minutes)

1. **Rectangle tool**
2. Draw: 300px wide × 40px tall
3. Fill: White
4. Border: 1px solid `#E2E8F0`
5. Border Radius: 8px
6. Padding: 12px all sides
7. Add placeholder text inside
8. **Right-click** → **"Create component"**
9. Name: **"Input/Text"**

**Create variants:**
- **Focus state:** Border color to Brand Purple, add shadow

---

## Step 7: Create Card Component (8 minutes)

1. **Rectangle tool**
2. Draw: 400px wide × 300px tall
3. Fill: White
4. Border: 1px solid `#E2E8F0`
5. Border Radius: 12px
6. Padding: 24px
7. Add shadow: `0 1px 3px rgba(0, 0, 0, 0.1)`
8. **Right-click** → **"Create component"**
9. Name: **"Card"**

---

## Step 8: Design the Header (15 minutes)

**In your "Home - Desktop" frame:**

1. Add rectangle: Full width (1440px) × 64px tall
2. Fill: White
3. Border bottom: 1px solid `#E2E8F0`
4. Add shadow

**Left side (Logo):**
1. Add text: "Humanize.AI"
2. Font: Inter 24px, weight 700
3. Color: Brand Purple
4. Position: 32px from left, centered vertically

**Right side (Navigation):**
1. Add buttons: "Home", "Academic", "Settings"
2. Spacing: 16px between buttons
3. Position: 32px from right

**Theme toggle:**
1. Create small circle
2. Half fill Brand Purple, half white
3. Add near profile icon

---

## Step 9: Design Main Content Area (30 minutes)

**Input Section (Left - 60% width):**

1. Add text: "Enter Your Text"
   - Style: H3 (24px, 700)
   - Margin bottom: 16px

2. Add textarea component from earlier
   - Width: Stretch
   - Height: 300px
   - Placeholder: "Paste your AI-generated text here..."

3. Add character counter below
   - Text: "0 / 5000"
   - Style: Body Small, Text Secondary
   - Margin top: 8px

**Settings Section (Right - 40% width):**

1. Card component (use what you created)
2. Inside add dropdowns for:
   - Style (Academic, Formal, Casual, etc.)
   - Emotion (Neutral, Confident, Persuasive)
   - Tone
   - Vocabulary Level

3. Add sliders for:
   - Formality (0-100)
   - Complexity (0-100)

4. Add "Humanize" button below
   - Primary button, full width
   - Margin top: 16px

**Output Section:**

1. Card component
2. Add title: "Output"
3. Add output text area (read-only look)
4. Copy button (top right)
5. Export dropdown (top right)

---

## Step 10: Design Advanced Tools Section (20 minutes)

**Tabbed Interface:**

1. Add rectangle container
2. Add tabs at top:
   - Transform (selected - Brand Purple underline)
   - Summarize
   - Score Text
   - Citations

3. **For each tab content:**
   - Add input fields
   - Add preview area
   - Add action button

**Example - Citations Tab:**
1. Dropdown: Select citation format (APA, MLA, Chicago, Harvard)
2. Input area for citations
3. Output preview
4. Copy button

---

## Step 11: Design Mobile Layout (20 minutes)

**For "Home - Mobile" frame (375px × 812px):**

1. Stack everything vertically
2. Remove sidebar navigation - use hamburger menu
3. Full-width input textarea
4. Settings in collapsible drawer below
5. Output below settings
6. All buttons: 100% width

**Key changes from desktop:**
- Remove two-column layout
- Single column instead
- Larger touch targets (44px minimum)
- Bigger padding/margins for readability

---

## Step 12: Design Tablet Layout (15 minutes)

**For "Home - Tablet" frame (768px × 1024px):**

1. Similar to desktop but:
   - Adjust column widths
   - Reduce padding slightly
   - Keep all components visible
   - Adjust text sizes if needed

---

## Step 13: Add Interactive States (15 minutes)

**For each interactive component, create variants:**

1. **Button:**
   - Normal
   - Hover
   - Active
   - Disabled

2. **Input:**
   - Default
   - Focus
   - Disabled
   - Error (red border)

3. **Dropdown:**
   - Closed
   - Open
   - Disabled

---

## Step 14: Create Prototypes (15 minutes)

1. Click **"Prototype"** tab (right panel)
2. Click "+" to create interaction
3. Set up page transitions:
   - Home → Academic Assistant
   - Home → Settings
   - Settings → Home

**Example:**
- Trigger: On click
- Action: Navigate to frame
- Destination: "Academic Assistant - Desktop"
- Animation: Instant or Dissolve

---

## Step 15: Add Dark Mode Variant (20 minutes)

1. **Duplicate entire desktop frame**
2. Rename: "Home - Desktop - Dark"
3. Change colors:
   - Background: `#0F172A`
   - Cards: `#1E293B`
   - Text: `#F1F5F9`
   - Borders: `#334155`

---

## Step 16: Export & Share (5 minutes)

1. Top right corner: **"Share"**
2. Click **"Create link"**
3. Share with your team/developers
4. Set permissions: "Can view" (design reference)

**Or export:**
1. Select frame
2. Right-click → **"Export"**
3. Format: PDF or PNG

---

## 🎉 You're Done!

**Final Figma File includes:**
- ✅ Color system
- ✅ Typography styles
- ✅ Button components
- ✅ Input components
- ✅ Card components
- ✅ Desktop layout
- ✅ Tablet layout
- ✅ Mobile layout
- ✅ Dark mode
- ✅ Interactive prototypes

---

## 💡 Pro Tips

1. **Use Components:** Save time by reusing components instead of duplicating
2. **Maintain Consistency:** Use color and text styles everywhere
3. **Test Responsiveness:** Preview each breakpoint before finalizing
4. **Document everything:** Add notes/comments for developers
5. **Version Control:** Regularly save versions (File → "Save as version")
6. **Get Feedback:** Share link with team for comments
7. **Use Plugins:** Install "Unsplash" plugin for placeholder images if needed

---

## Next Steps

After completing Figma design:
1. Share with development team
2. Create design spec document
3. Build components in code
4. Implement responsive designs
5. Test across devices

**Good luck! Your Figma design will be amazing!** 🚀

