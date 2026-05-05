# SAMVĀDA - Responsive Design Guide

## Overview

SAMVĀDA is fully responsive and works seamlessly across all device sizes:
- **Mobile**: 320px - 767px (hamburger menu)
- **Tablet**: 768px - 1023px (collapsible sidebar)
- **Desktop**: 1024px+ (persistent sidebar)

---

## Breakpoints (Tailwind)

```css
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
```

---

## Navigation

### Desktop (≥1024px)
- Persistent 240px sidebar on left
- Always visible
- Full navigation menu
- Retrain status widget at bottom

### Mobile (<1024px)
- Hamburger menu button (top-left)
- Sidebar slides in from left
- Dark overlay when open
- Tap outside to close
- Tap nav item to close and navigate

---

## Page-Specific Responsive Features

### Dashboard
- **4-column grid** (desktop) → **2-column** (tablet) → **1-column** (mobile)
- Summary cards stack vertically on mobile
- Charts maintain aspect ratio
- Activity feed scrolls on small screens
- Buttons stack vertically on mobile

### Candidates
- **Table scrolls horizontally** on mobile (min-width: 800px)
- Filter dropdowns stack on mobile
- Candidate detail drawer:
  - Full screen on mobile
  - Centered modal on desktop
  - 3-column metrics → 1-column on mobile

### New Query
- Form fields stack on mobile
- 2-column grid → 1-column on mobile
- Full-width button on mobile
- Generated candidates cards stack

### Log Outcome
- 3-column metrics → 1-column on mobile
- Dropdowns full-width on mobile
- Predicted performance card stacks
- Success message full-width

### Residual Analysis
- 2-column charts → 1-column on mobile
- Scatter plot maintains readability
- Underperformers list:
  - Horizontal layout (desktop)
  - Vertical stack (mobile)
- SHAP chart adjusts width
- Smaller font sizes on mobile (10px)

### Retrain
- 3-column grid → 2-column → 1-column
- Checkpoint table scrolls horizontally
- Buttons stack on mobile
- Confirmation dialog full-width

### Supplier Registry
- Header stacks on mobile
- Add button full-width on mobile
- Form 2-column → 1-column
- Table scrolls horizontally (min-width: 600px)

### Settings
- All sections stack vertically
- API key input + button stack on mobile
- Export button full-width on mobile
- Text wraps on small screens

---

## Mobile-Specific Optimizations

### Typography
- Headings: `text-2xl sm:text-3xl` (smaller on mobile)
- Body: `text-sm sm:text-base`
- Chart labels: `fontSize: 10` on mobile

### Spacing
- Padding: `p-4 sm:p-6 lg:p-8` (less on mobile)
- Gaps: `gap-3 sm:gap-4` (tighter on mobile)
- Margins: `mb-6 lg:mb-8` (less on mobile)

### Buttons
- Full-width on mobile: `w-full sm:w-auto`
- Centered content: `justify-center`
- Stack in columns: `flex-col sm:flex-row`

### Tables
- Horizontal scroll: `overflow-x-auto`
- Minimum width: `min-w-[600px]` or `min-w-[800px]`
- Smaller font: `text-xs sm:text-sm`

### Grids
- Responsive columns:
  - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
  - `grid-cols-1 lg:grid-cols-2`
  - `grid-cols-1 sm:grid-cols-3`

---

## Touch Targets

All interactive elements meet minimum touch target size:
- Buttons: 44px × 44px minimum
- Nav items: 48px height
- Form inputs: 40px height
- Table rows: 48px height

---

## Performance

### Mobile Optimizations
- Smaller chart heights (200-250px vs 300px)
- Lazy loading for heavy components
- Optimized font sizes
- Reduced animations

### Loading States
- Skeleton screens on all pages
- Loading spinner for async operations
- Disabled states for buttons

---

## Testing Checklist

### Mobile (375px - iPhone SE)
- [ ] Hamburger menu opens/closes
- [ ] All text readable
- [ ] No horizontal scroll (except tables)
- [ ] Buttons full-width
- [ ] Forms usable
- [ ] Charts visible

### Tablet (768px - iPad)
- [ ] Sidebar toggles
- [ ] 2-column grids work
- [ ] Tables readable
- [ ] Modals centered

### Desktop (1440px)
- [ ] Sidebar persistent
- [ ] 4-column grids
- [ ] Full table width
- [ ] Optimal spacing

---

## Browser Support

- **Chrome**: ✅ Full support
- **Safari**: ✅ Full support (iOS + macOS)
- **Firefox**: ✅ Full support
- **Edge**: ✅ Full support

---

## Accessibility

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation
- Focus states visible
- Color contrast WCAG AA compliant

---

## Common Patterns

### Responsive Container
```tsx
<div className="p-4 sm:p-6 lg:p-8">
  {/* Content */}
</div>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
  {/* Items */}
</div>
```

### Responsive Button
```tsx
<button className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto">
  {/* Content */}
</button>
```

### Responsive Table
```tsx
<div className="overflow-x-auto">
  <table className="w-full min-w-[600px]">
    {/* Rows */}
  </table>
</div>
```

### Responsive Text
```tsx
<h1 className="text-2xl sm:text-3xl font-bold">
  {/* Heading */}
</h1>
<p className="text-sm sm:text-base text-foreground/60">
  {/* Body */}
</p>
```

---

## Mobile Menu Implementation

```tsx
// State
const [isOpen, setIsOpen] = useState(false);

// Button
<button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
  {isOpen ? <X /> : <Menu />}
</button>

// Overlay
{isOpen && <div onClick={() => setIsOpen(false)} />}

// Sidebar
<aside className={cn(
  "fixed lg:static",
  isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
)}>
```

---

## Future Enhancements

- [ ] PWA support (installable on mobile)
- [ ] Offline mode
- [ ] Touch gestures (swipe to open menu)
- [ ] Dark mode toggle
- [ ] Font size preferences

---

**All pages are now fully responsive and mobile-ready!** 📱
