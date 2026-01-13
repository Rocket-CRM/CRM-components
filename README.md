# Polaris Navigation - WeWeb Custom Component

A WeWeb custom component that implements Shopify Polaris navigation with parent items and optional sub-navigation.

## Features

- ✅ Simple navigation with parent and sub-items
- ✅ Expandable sub-navigation
- ✅ Configurable expansion behavior (auto, manual, both)
- ✅ Home route with special handling
- ✅ Active state detection (manual, auto, or both)
- ✅ Icon and badge support with active/inactive states
- ✅ Mobile responsive design
- ✅ Full WeWeb integration with triggers and internal variables
- ✅ Exact Polaris Navigation styling and structure
- ✅ Professional UX with smooth transitions

## Installation

```bash
npm install
npm run serve --port=3000
```

Then add the custom element in WeWeb editor developer popup.

## Configuration Properties

### Navigation Items
- **navigationItems**: Array of parent navigation items
  - Structure: `[{id, label, href, active, icon, activeIcon, badge, subItems: [...]}]`

Each navigation item can have:
- `id`: Unique item identifier
- `label`: Display text
- `href`: Link URL
- `active`: Manual active state (boolean)
- `icon`: Icon identifier (SystemIcon)
- `activeIcon`: Icon when active (optional, SystemIcon)
- `badge`: Badge text (e.g., "15")
- `subItems`: Array of sub-navigation items

### Sub-Navigation Items
Each sub-item has:
- `id`: Unique identifier
- `label`: Display text
- `href`: Link URL
- `active`: Manual active state (boolean)

### Expansion Behavior
- **expansionBehavior**: Controls how sub-navigation expands
  - Options: 'both' (default), 'auto', 'manual'
  - 'auto': Expand when child is active
  - 'manual': Click parent to toggle
  - 'both': Auto-expand active + manual toggle

### Home Route
- **homeRoute**: Optional home route configuration
  - Structure: `{label, href}`
  - Rendered at the top of navigation

### Active Detection
- **activeDetection**: How to determine active item
  - Options: 'both' (default), 'manual', 'auto'
  - 'manual': Use the `active` property from items
  - 'auto': Match against current URL path
  - 'both': Manual takes precedence, fallback to auto

- **currentPath**: Current URL path for auto-detection
  - Leave empty to use `window.location.pathname`

### Display Options
- **showIcons**: Toggle icon display (default: true)
- **showBadges**: Toggle badge display (default: true)
- **mobileBreakpoint**: Screen width for mobile behavior (default: 768px)

### Styling
- **navBackgroundColor**: Background color (default: #ffffff)
- **navTextColor**: Text color (default: #202223)
- **navActiveColor**: Active item color (default: #005BD3)
- **navHoverColor**: Hover color (default: #f6f6f7)
- **navPadding**: Padding around navigation (default: 16px)

## Trigger Events

### navigation-click
Fired when any navigation item is clicked (including parent items with sub-items).
```javascript
{
  href: string,
  label: string,
  domEvent: Event
}
```

### sub-navigation-click
Fired when a sub-item is clicked.
```javascript
{
  parentHref: string,
  parentLabel: string,
  href: string,
  label: string
}
```

### expansion-toggle
Fired when a parent item with sub-items is expanded or collapsed.
```javascript
{
  itemId: string,
  isExpanded: boolean
}
```

### home-click
Fired when home route is clicked.
```javascript
{
  href: string,
  label: string
}
```

### active-change
Fired when active item changes.
```javascript
{
  previousHref: string,
  currentHref: string
}
```

## Internal Variables

### currentActiveHref
- Type: `string`
- Current active navigation item's href (including sub-items)

### expandedItemIds
- Type: `array`
- Array of currently expanded parent item IDs

### activeParentHref
- Type: `string`
- Href of parent item containing active sub-item

### navigationState
- Type: `object`
- Structure: `{activeHref, activeLabel, totalItems}`
- Complete navigation state for workflows

## Usage Examples

### Basic Sectioned Navigation
```javascript
sections: [
  {
    id: 'section1',
    title: '',  // No section title
    items: [
      { id: 'home', label: 'Home', href: '/', icon: 'home', subItems: [] },
      { id: 'orders', label: 'Orders', href: '/orders', badge: '15', subItems: [] }
    ]
  }
]
```

### With Sub-Navigation
```javascript
sections: [
  {
    id: 'section1',
    title: '',
    items: [
      { 
        id: 'products', 
        label: 'Products', 
        href: '/products',
        icon: 'products',
        subItems: [
          { id: 'collections', label: 'Collections', href: '/products/collections' },
          { id: 'inventory', label: 'Inventory', href: '/products/inventory' }
        ]
      }
    ]
  }
]
```

### Multiple Sections with Titles
```javascript
sections: [
  {
    id: 'main',
    title: 'Main Navigation',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard' }
    ]
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      { id: 'profile', label: 'Profile', href: '/settings/profile' },
      { id: 'billing', label: 'Billing', href: '/settings/billing' }
    ]
  }
]
```

### With Home Route
```javascript
homeRoute: {
  label: 'Home',
  href: '/'
}
```

### Expansion Behavior Examples

#### Auto-Expand (expand when child is active)
```javascript
expansionBehavior: 'auto'
```

#### Manual Toggle (click parent to expand/collapse)
```javascript
expansionBehavior: 'manual'
```

#### Both (auto-expand + manual toggle)
```javascript
expansionBehavior: 'both'  // Default
```

### Auto Active Detection
Set `activeDetection: 'auto'` and provide `currentPath` to automatically highlight the current page, including sub-items.

## Technical Details

- Built with Vue 3 Composition API
- Uses Polaris Vue Link components
- Matches exact Shopify Polaris Navigation HTML structure
- Uses Polaris CSS variables for consistent styling
- Follows WeWeb component standards
- Fully reactive properties using computed values
- Smooth expand/collapse transitions
- Mobile-responsive with configurable breakpoint
- Accessibility-friendly with proper ARIA attributes

## Component Architecture

### Sections Processing
- Each section is processed independently
- Items within sections support nesting (sub-items)
- Active state detection works across all levels

### Expansion Logic
- Parent items with sub-items can expand/collapse
- Expansion state tracked per item ID
- Auto-expand based on active children
- Manual toggle via click

### Active State Detection
- Works for both main items and sub-items
- Supports manual, auto (URL-based), or both modes
- Parent items show active state when child is active
- Visual indicators for active items and expanded parents

## Development

```bash
# Serve locally
npm run serve --port=3000

# Build for production
npm run build --name=polaris-navigation
```

## Dependencies

- `@ownego/polaris-vue`: ^2.1.33
- `vue`: ^3.3.0
- `@weweb/cli`: latest (devDependency)

## Browser Support

Same as WeWeb and Vue 3 browser support.

## Polaris Design System

This component follows Shopify's Polaris design system for navigation, ensuring a professional and familiar experience for Shopify app users.

## Migration from v1 (flat items)

If upgrading from the previous flat `navigationItems` structure:

**Old format:**
```javascript
navigationItems: [
  { id: 'item1', label: 'Dashboard', href: '/dashboard' }
]
```

**New format:**
```javascript
sections: [
  {
    id: 'section1',
    title: '',
    items: [
      { id: 'item1', label: 'Dashboard', href: '/dashboard', subItems: [] }
    ]
  }
]
```

Wrap your items in a section and add an empty `subItems` array to each item.
