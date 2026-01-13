export default {
  editor: {
    name: 'polaris-navigation',
    label: {
      en: 'Polaris Navigation',
    },
    icon: 'menu',
  },
  triggerEvents: [
    {
      name: 'navigation-click',
      label: { en: 'On navigation click' },
      event: { href: '', label: '', domEvent: null },
      default: true,
    },
    {
      name: 'sub-navigation-click',
      label: { en: 'On sub-navigation click' },
      event: { parentHref: '', parentLabel: '', href: '', label: '' },
    },
    {
      name: 'expansion-toggle',
      label: { en: 'On expansion toggle' },
      event: { itemId: '', isExpanded: false },
    },
    {
      name: 'home-click',
      label: { en: 'On home click' },
      event: { href: '', label: '' },
    },
    {
      name: 'active-change',
      label: { en: 'On active change' },
      event: { previousHref: '', currentHref: '' },
    },
    {
      name: 'settings-click',
      label: { en: 'On settings click' },
      event: { href: '', label: '', domEvent: null },
    },
    {
      name: 'section-item-click',
      label: { en: 'On section item click' },
      event: { href: '', label: '', domEvent: null },
    },
  ],
  properties: {
    // Navigation Items Array
    navigationItems: {
      label: { en: 'Navigation Items' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        { 
          id: 'item1', 
          label: 'Home', 
          href: '/', 
          active: false,
          icon: '',
          activeIcon: '',
          imageSource: '',
          activeImageSource: '',
          badge: '',
          subItems: []
        },
        { 
          id: 'item2', 
          label: 'Orders', 
          href: '/orders', 
          active: false,
          icon: '',
          activeIcon: '',
          imageSource: '',
          activeImageSource: '',
          badge: '15',
          subItems: []
        },
        { 
          id: 'item3', 
          label: 'Products', 
          href: '/products', 
          active: false,
          icon: '',
          activeIcon: '',
          imageSource: '',
          activeImageSource: '',
          badge: '',
          subItems: [
            { id: 'sub1', label: 'Collections', href: '/products/collections', active: false },
            { id: 'sub2', label: 'Inventory', href: '/products/inventory', active: false }
          ]
        }
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item.label || item.href || 'Navigation Item';
        },
        item: {
          type: 'Object',
          defaultValue: { 
            id: 'item1', 
            label: 'New Item', 
            href: '#', 
            active: false, 
            icon: '', 
            activeIcon: '', 
            imageSource: '', 
            activeImageSource: '', 
            badge: '',
            subItems: []
          },
          options: {
            item: {
              id: { 
                label: { en: 'ID' }, 
                type: 'Text',
                section: 'settings'
              },
              label: { 
                label: { en: 'Label' }, 
                type: 'Text',
                section: 'settings'
              },
              href: { 
                label: { en: 'Link (href)' }, 
                type: 'Text',
                section: 'settings'
              },
              active: { 
                label: { en: 'Active' }, 
                type: 'OnOff',
                section: 'settings'
              },
              icon: { 
                label: { en: 'Icon' }, 
                type: 'SystemIcon',
                section: 'settings'
              },
              activeIcon: { 
                label: { en: 'Active Icon' }, 
                type: 'SystemIcon',
                section: 'settings'
              },
              imageSource: { 
                label: { en: 'Image URL' }, 
                type: 'Text',
                section: 'settings',
                defaultValue: '',
                bindable: true
              },
              activeImageSource: { 
                label: { en: 'Active Image URL' }, 
                type: 'Text',
                section: 'settings',
                defaultValue: '',
                bindable: true
              },
              badge: { 
                label: { en: 'Badge Text' }, 
                type: 'Text',
                section: 'settings'
              },
              subItems: {
                label: { en: 'Sub Items' },
                type: 'Array',
                section: 'settings',
                options: {
                  expandable: true,
                  getItemLabel(subItem) {
                    return subItem.label || subItem.href || 'Sub Item';
                  },
                  item: {
                    type: 'Object',
                    defaultValue: {
                      id: 'sub1',
                      label: 'Sub Item',
                      href: '#',
                      active: false
                    },
                    options: {
                      item: {
                        id: { 
                          label: { en: 'Sub Item ID' }, 
                          type: 'Text',
                          section: 'settings',
                          bindable: true,
                        },
                        label: { 
                          label: { en: 'Sub Item Label' }, 
                          type: 'Text',
                          section: 'settings',
                          bindable: true,
                        },
                        href: { 
                          label: { en: 'Sub Item Link' }, 
                          type: 'Text',
                          section: 'settings',
                          bindable: true,
                        },
                        active: { 
                          label: { en: 'Sub Item Active' }, 
                          type: 'OnOff',
                          section: 'settings',
                          bindable: true,
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of navigation items with optional sub-items',
      },
      /* wwEditor:end */
    },
    
    // Sections (Dynamic sections like "Sales Channels", "Apps")
    sections: {
      label: { en: 'Sections' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      options: {
        expandable: true,
        getItemLabel(section) {
          return section.label || 'Section';
        },
        item: {
          type: 'Object',
          defaultValue: {
            id: 'section1',
            label: 'Sales Channels',
            items: []
          },
          options: {
            item: {
              id: {
                label: { en: 'Section ID' },
                type: 'Text',
                section: 'settings'
              },
              label: {
                label: { en: 'Section Label' },
                type: 'Text',
                section: 'settings'
              },
              items: {
                label: { en: 'Section Items' },
                type: 'Array',
                section: 'settings',
                options: {
                  expandable: true,
                  getItemLabel(item) {
                    return item.label || item.href || 'Section Item';
                  },
                  item: {
                    type: 'Object',
                    defaultValue: {
                      id: 'section-item1',
                      label: 'Online Store',
                      href: '/online-store',
                      active: false,
                      icon: '',
                      activeIcon: '',
                      imageSource: '',
                      activeImageSource: '',
                      badge: ''
                    },
                    options: {
                      item: {
                        id: {
                          label: { en: 'Item ID' },
                          type: 'Text',
                          section: 'settings'
                        },
                        label: {
                          label: { en: 'Label' },
                          type: 'Text',
                          section: 'settings'
                        },
                        href: {
                          label: { en: 'Link (href)' },
                          type: 'Text',
                          section: 'settings'
                        },
                        active: {
                          label: { en: 'Active' },
                          type: 'OnOff',
                          section: 'settings'
                        },
                        icon: {
                          label: { en: 'Icon' },
                          type: 'SystemIcon',
                          section: 'settings'
                        },
                        activeIcon: {
                          label: { en: 'Active Icon' },
                          type: 'SystemIcon',
                          section: 'settings'
                        },
                        imageSource: {
                          label: { en: 'Image URL' },
                          type: 'Text',
                          section: 'settings',
                          defaultValue: '',
                          bindable: true
                        },
                        activeImageSource: {
                          label: { en: 'Active Image URL' },
                          type: 'Text',
                          section: 'settings',
                          defaultValue: '',
                          bindable: true
                        },
                        badge: {
                          label: { en: 'Badge Text' },
                          type: 'Text',
                          section: 'settings'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of sections with their navigation items',
      },
      /* wwEditor:end */
    },
    
    // Expansion Behavior
    expansionBehavior: {
      label: { en: 'Expansion Behavior' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'both', label: 'Both (auto + manual)' },
          { value: 'auto', label: 'Auto (expand when active)' },
          { value: 'manual', label: 'Manual (click to toggle)' }
        ]
      },
      defaultValue: 'both',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Valid values: both | auto | manual',
      },
      propertyHelp: 'Controls how sub-navigation expands: auto (expand when child active), manual (click parent to toggle), or both',
      /* wwEditor:end */
    },
    
    // Accordion Mode
    accordionMode: {
      label: { en: 'Accordion Mode' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'When enabled, only one sub-section can be open at a time',
      },
      propertyHelp: 'Enable to close other sub-sections when opening a new one (accordion behavior)',
      /* wwEditor:end */
    },
    
    // Home Route
    homeRoute: {
      label: { en: 'Home Route' },
      type: 'Object',
      section: 'settings',
      bindable: true,
      defaultValue: null,
      options: {
        item: {
          label: { label: { en: 'Label' }, type: 'Text', defaultValue: 'Home' },
          href: { label: { en: 'Link (href)' }, type: 'Text', defaultValue: '/' },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        tooltip: 'Home route configuration with label and href',
      },
      propertyHelp: 'Optional home route that will be rendered with rel="home" attribute',
      /* wwEditor:end */
    },
    
    // Active Detection Mode
    activeDetection: {
      label: { en: 'Active Detection' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'both', label: 'Both (Manual + Auto)' },
          { value: 'manual', label: 'Manual Only' },
          { value: 'auto', label: 'Auto Detect' },
        ],
      },
      defaultValue: 'both',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Valid values: both | manual | auto',
      },
      propertyHelp: 'How to determine active navigation item: manual (use active property), auto (match current URL), or both (manual takes precedence)',
      /* wwEditor:end */
    },
    
    // Current Path for Active Detection
    currentPath: {
      label: { en: 'Current Path' },
      type: 'Text',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
      },
      propertyHelp: 'Current URL path for auto-detection. Leave empty to use window.location.pathname',
      /* wwEditor:end */
    },
    
    // Display Options
    showIcons: {
      label: { en: 'Show Icons' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
      },
      /* wwEditor:end */
    },
    
    showBadges: {
      label: { en: 'Show Badges' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
      },
      /* wwEditor:end */
    },
    
    // Mobile Behavior
    mobileBreakpoint: {
      label: { en: 'Mobile Breakpoint (px)' },
      type: 'Number',
      section: 'settings',
      defaultValue: 768,
      bindable: true,
      options: {
        min: 320,
        max: 1200,
        step: 1,
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
      },
      propertyHelp: 'Screen width (in pixels) below which mobile navigation is used',
      /* wwEditor:end */
    },
    
    // Style Properties
    navBackgroundColor: {
      label: { en: 'Background Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
      },
      /* wwEditor:end */
    },
    
    navTextColor: {
      label: { en: 'Text Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#202223',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
      },
      propertyHelp: 'Shopify Polaris text color by default (#202223)',
      /* wwEditor:end */
    },
    
    navActiveColor: {
      label: { en: 'Active Item Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#005BD3',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
      },
      propertyHelp: 'Shopify Polaris blue by default (#005BD3)',
      /* wwEditor:end */
    },
    
    navHoverColor: {
      label: { en: 'Hover Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#f6f6f7',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
      },
      propertyHelp: 'Shopify Polaris hover color by default (#f6f6f7)',
      /* wwEditor:end */
    },
    
    navPadding: {
      label: { en: 'Padding' },
      type: 'Length',
      section: 'style',
      defaultValue: '16px',
      bindable: true,
      options: {
        unitChoices: [
          { value: 'px', label: 'px', min: 0, max: 50 },
          { value: 'rem', label: 'rem', min: 0, max: 5, step: 0.1 },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
      },
      /* wwEditor:end */
    },
    
    // Settings Item (Fixed at bottom)
    settingsItem: {
      label: { en: 'Settings Item' },
      type: 'Object',
      section: 'settings',
      bindable: true,
      defaultValue: null,
      options: {
        item: {
          label: { label: { en: 'Label' }, type: 'Text', defaultValue: 'Settings' },
          href: { label: { en: 'Link (href)' }, type: 'Text', defaultValue: '/settings' },
          active: { label: { en: 'Active' }, type: 'OnOff', defaultValue: false },
          icon: { label: { en: 'Icon' }, type: 'SystemIcon', defaultValue: '' },
          activeIcon: { label: { en: 'Active Icon' }, type: 'SystemIcon', defaultValue: '' },
          imageSource: { label: { en: 'Image URL' }, type: 'Text', defaultValue: '', bindable: true },
          activeImageSource: { label: { en: 'Active Image URL' }, type: 'Text', defaultValue: '', bindable: true },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        tooltip: 'Settings item configuration with label, href, and icon',
      },
      propertyHelp: 'Settings item that will be fixed at the bottom of the navigation',
      /* wwEditor:end */
    },
  },
};

