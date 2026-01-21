<template>
  <div ref="wrapperRef" class="polaris-navigation-wrapper">
    <nav class="Polaris-Navigation">
      <div class="Polaris-Navigation__PrimaryNavigation Polaris-Scrollable">
        <!-- Home Route -->
        <ul v-if="homeRoute?.href" class="Polaris-Navigation__Section">
          <li class="Polaris-Navigation__ListItem">
            <div class="Polaris-Navigation__ItemWrapper">
              <div class="Polaris-Navigation__ItemInnerWrapper">
                <a
                  :href="homeRoute.href"
                  class="Polaris-Navigation__Item"
                  @click="handleHomeClick"
                  data-polaris-unstyled="true"
                >
                  <span class="Polaris-Navigation__Text">
                    <span class="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--medium">
                      {{ homeRoute.label || 'Home' }}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </li>
        </ul>

        <!-- Loop through navigation items -->
        <ul class="Polaris-Navigation__Section">
          <li 
            v-for="item in processedItems"
            :key="item.id"
            class="Polaris-Navigation__ListItem"
          >
            <div class="Polaris-Navigation__ItemWrapper">
              <div 
                class="Polaris-Navigation__ItemInnerWrapper"
                :class="{
                  'Polaris-Navigation__ItemInnerWrapper--selected': item.isActive,
                  'Polaris-Navigation__ItemInnerWrapper--open': item.isExpanded
                }"
              >
                <a
                  :href="item.href"
                  class="Polaris-Navigation__Item"
                  :class="{
                    'Polaris-Navigation__Item--selected': item.isActive,
                    'Polaris-Navigation--subNavigationActive': item.hasActiveChild || item.isActive,
                    'Polaris-Navigation--itemChildActive': item.hasActiveChild
                  }"
                  :aria-expanded="item.hasSubItems ? item.isExpanded : undefined"
                  @click="handleItemClick(item, $event)"
                  data-polaris-unstyled="true"
                >
                  <!-- Image (priority) or Icon -->
                  <template v-if="getItemImageSource(item)">
                    <div class="Polaris-Navigation__Image">
                      <img 
                        :src="getItemImageSource(item)" 
                        :alt="item.label || 'Navigation item'"
                        width="20"
                        height="20"
                        loading="lazy"
                        @error="(e) => { 
                          const imgSrc = getItemImageSource(item);
                          console.error('[Navigation] Image failed to load:', {
                            itemId: item.id,
                            itemLabel: item.label,
                            imageSource: imgSrc,
                            error: e,
                            target: e.target
                          }); 
                          e.target.style.display = 'none'; 
                        }"
                        @load="(e) => {
                          const imgSrc = getItemImageSource(item);
                          console.log('[Navigation] Image loaded successfully:', {
                            itemId: item.id,
                            itemLabel: item.label,
                            imageSource: imgSrc,
                            naturalWidth: e.target.naturalWidth,
                            naturalHeight: e.target.naturalHeight
                          });
                        }"
                      />
                    </div>
                  </template>
                  <template v-else-if="showIcons && item.icon">
                    <div class="Polaris-Navigation__Icon">
                      <span class="Polaris-Icon">
                        <span v-html="getItemIconHTML(item)"></span>
                      </span>
                    </div>
                  </template>
                  
                  <!-- Label -->
                  <span class="Polaris-Navigation__Text">
                    <span 
                      class="Polaris-Text--root Polaris-Text--bodyMd"
                      :class="{
                        'Polaris-Text--semibold': item.isActive,
                        'Polaris-Text--medium': !item.isActive
                      }"
                    >
                      {{ item.label }}
                    </span>
                  </span>
                  
                  <!-- Badge -->
                  <div v-if="showBadges && item.badge" class="Polaris-Navigation__Badge">
                    <span class="Polaris-Badge Polaris-Badge--toneNew">
                      <span class="Polaris-Text--root Polaris-Text--bodySm Polaris-Text--medium">
                        {{ item.badge }}
                      </span>
                    </span>
                  </div>
                </a>
              </div>
            </div>
            
            <!-- Sub-navigation (collapsible) -->
            <div 
              v-if="item.hasSubItems"
              class="Polaris-Navigation__SecondaryNavigation"
              :class="{ 'Polaris-Navigation__SecondaryNavigationOpen': item.isExpanded }"
            >
              <div 
                class="Polaris-Collapsible"
                :class="{ 'Polaris-Collapsible--isFullyClosed': !item.isExpanded }"
                :style="{ 
                  maxHeight: item.isExpanded ? 'none' : '0px',
                  overflow: item.isExpanded ? 'visible' : 'hidden'
                }"
                :aria-hidden="!item.isExpanded"
              >
                <ul class="Polaris-Navigation__List">
                  <li 
                    v-for="subItem in item.subItems"
                    :key="subItem.id"
                    class="Polaris-Navigation__ListItem"
                  >
                    <div class="Polaris-Navigation__ItemWrapper">
                      <div 
                        class="Polaris-Navigation__ItemInnerWrapper"
                        :class="{
                          'Polaris-Navigation__ItemInnerWrapper--selected': subItem.isActive
                        }"
                      >
                        <a
                          :href="subItem.href"
                          class="Polaris-Navigation__Item Polaris-Navigation__Item--line"
                          :class="{
                            'Polaris-Navigation__Item--selected': subItem.isActive,
                            'Polaris-Navigation--subNavigationActive': subItem.isActive,
                            'Polaris-Navigation--itemLinePointer': subItem.isActive,
                            'Polaris-Navigation__Item--showLine': item.selectedSubItemIndex !== -1 && subItem.index < item.selectedSubItemIndex,
                            'Polaris-Navigation__Item--hideLineAfterSelected': item.selectedSubItemIndex !== -1 && subItem.index > item.selectedSubItemIndex
                          }"
                          @click="handleSubItemClick(item, subItem, $event)"
                          data-polaris-unstyled="true"
                        >
                          <span class="Polaris-Navigation__Text">
                            <span 
                              class="Polaris-Text--root Polaris-Text--bodyMd"
                              :class="{
                                'Polaris-Text--semibold': subItem.isActive,
                                'Polaris-Text--regular Polaris-Text--subdued': !subItem.isActive
                              }"
                            >
                              {{ subItem.label }}
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>

        <!-- Dynamic Sections -->
        <template v-if="processedSections && processedSections.length > 0">
          <template v-for="section in processedSections" :key="section.id">
            <ul class="Polaris-Navigation__Section">
              <!-- Section Heading -->
              <li class="Polaris-Navigation__SectionHeading">
                <span class="Polaris-Text--root">
                  {{ section.label }}
                </span>
              </li>
              
              <!-- Section Items -->
              <li 
                v-for="item in section.items"
                :key="item.id"
                class="Polaris-Navigation__ListItem"
              >
              <div class="Polaris-Navigation__ItemWrapper">
                <div 
                  class="Polaris-Navigation__ItemInnerWrapper"
                  :class="{
                    'Polaris-Navigation__ItemInnerWrapper--selected': item.isActive
                  }"
                >
                  <a
                    :href="item.href"
                    class="Polaris-Navigation__Item"
                    :class="{
                      'Polaris-Navigation__Item--selected': item.isActive
                    }"
                    @click="handleSectionItemClick(item, $event)"
                    data-polaris-unstyled="true"
                  >
                    <!-- Image (priority) or Icon -->
                    <div v-if="getSectionItemImageSource(item)" class="Polaris-Navigation__Image">
                      <img :src="getSectionItemImageSource(item)" :alt="item.label" width="20" height="20" loading="lazy" />
                    </div>
                    <div v-else-if="showIcons && item.icon" class="Polaris-Navigation__Icon">
                      <span class="Polaris-Icon">
                        <span v-html="getItemIconHTML(item)"></span>
                      </span>
                    </div>
                    
                    <!-- Label -->
                    <span class="Polaris-Navigation__Text">
                      <span 
                        class="Polaris-Text--root Polaris-Text--bodyMd"
                        :class="{
                          'Polaris-Text--semibold': item.isActive,
                          'Polaris-Text--medium': !item.isActive
                        }"
                      >
                        {{ item.label }}
                      </span>
                    </span>
                    
                    <!-- Badge -->
                    <div v-if="showBadges && item.badge" class="Polaris-Navigation__Badge">
                      <span class="Polaris-Badge Polaris-Badge--toneNew">
                        <span class="Polaris-Text--root Polaris-Text--bodySm Polaris-Text--medium">
                          {{ item.badge }}
                        </span>
                      </span>
                    </div>
                  </a>
                </div>
              </div>
              </li>
            </ul>
          </template>
        </template>
      </div>
      
      <!-- Settings Item - Fixed at bottom -->
      <div v-if="settingsItem?.href || settingsItem?.label" class="Polaris-Navigation__Settings">
        <ul class="Polaris-Navigation__Section">
          <li class="Polaris-Navigation__ListItem">
            <div class="Polaris-Navigation__ItemWrapper">
              <div 
                class="Polaris-Navigation__ItemInnerWrapper"
                :class="{
                  'Polaris-Navigation__ItemInnerWrapper--selected': settingsItem.isActive
                }"
              >
                <a
                  :href="settingsItem.href"
                  class="Polaris-Navigation__Item"
                  :class="{
                    'Polaris-Navigation__Item--selected': settingsItem.isActive
                  }"
                  @click="handleSettingsClick"
                  data-polaris-unstyled="true"
                >
                  <!-- Image (priority) or Icon -->
                  <div v-if="getSettingsImageSource()" class="Polaris-Navigation__Image">
                    <img :src="getSettingsImageSource()" :alt="settingsItem.label || 'Settings'" width="20" height="20" loading="lazy" />
                  </div>
                  <div v-else-if="showIcons && settingsItem.icon" class="Polaris-Navigation__Icon">
                    <span class="Polaris-Icon">
                      <span v-html="getSettingsIconHTML()"></span>
                    </span>
                  </div>
                  
                  <!-- Label -->
                  <span class="Polaris-Navigation__Text">
                    <span 
                      class="Polaris-Text--root Polaris-Text--bodyMd"
                      :class="{
                        'Polaris-Text--semibold': settingsItem.isActive,
                        'Polaris-Text--medium': !settingsItem.isActive
                      }"
                    >
                      {{ settingsItem.label || 'Settings' }}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

export default {
  components: {},
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    wwElementState: { type: Object, required: true },
    wwFrontState: { type: Object, required: true },
    wwEditorState: { type: Object, required: true },
  },
  emits: [
    'trigger-event',
    'element-event',
    'add-state',
    'remove-state',
    'update:content:effect',
    'update:sidepanel-content',
  ],
  setup(props, { emit }) {
    const wwLib = window.wwLib;
    if (!wwLib) {
      console.error('wwLib not available');
    }

    // Refs
    const wrapperRef = ref(null);
    
    // State
    const currentActiveHref = ref('');
    const isMobile = ref(false);
    const expandedItems = ref(new Set());  // Track expanded parent items

    // Internal variables
    const { value: internalActiveHref, setValue: setInternalActiveHref } = wwLib?.wwVariable?.useComponentVariable({
      uid: props.uid,
      name: 'currentActiveHref',
      type: 'string',
      defaultValue: '',
    }) || { value: ref(''), setValue: () => {} };

    const { value: expandedItemIds, setValue: setExpandedItemIds } = wwLib?.wwVariable?.useComponentVariable({
      uid: props.uid,
      name: 'expandedItemIds',
      type: 'array',
      defaultValue: [],
    }) || { value: ref([]), setValue: () => {} };

    const { value: activeParentHref, setValue: setActiveParentHref } = wwLib?.wwVariable?.useComponentVariable({
      uid: props.uid,
      name: 'activeParentHref',
      type: 'string',
      defaultValue: '',
    }) || { value: ref(''), setValue: () => {} };

    const { value: navigationState, setValue: setNavigationState } = wwLib?.wwVariable?.useComponentVariable({
      uid: props.uid,
      name: 'navigationState',
      type: 'object',
      defaultValue: { activeHref: '', activeLabel: '', totalItems: 0 },
    }) || { value: ref({}), setValue: () => {} };

    // Track manually selected item by ID
    const manuallySelectedId = ref('');

    // Active state detection logic
    const determineActive = (id, href, manualActive) => {
      const mode = props.content?.activeDetection || 'both';
      let currentPath = props.content?.currentPath;

      // If currentPath is not provided, try to get it from window
      if (!currentPath && typeof window !== 'undefined') {
        currentPath = window.location.pathname;
      }

      // Check if this item was manually selected by ID
      const isManuallySelected = manuallySelectedId.value === id;

      if (mode === 'manual') {
        return isManuallySelected || manualActive || false;
      }
      if (mode === 'auto') {
        return currentPath === href || isManuallySelected;
      }
      // 'both': manual selection takes highest precedence, then manualActive prop, then auto
      if (isManuallySelected) return true;
      if (manualActive !== undefined) return manualActive;
      return currentPath === href;
    };

    // Computed: Process navigation items
    const processedItems = computed(() => {
      const items = props.content?.navigationItems || [];
      
      return items.map((item, itemIndex) => {
        const itemId = item.id || `item-${itemIndex}`;
        
        // Process sub-items
        const processedSubItems = (item.subItems || []).map((subItem, subIndex) => {
          const subItemId = subItem.id || `sub-${itemId}-${subIndex}`;
          return {
            id: subItemId,
            label: subItem.label || 'Untitled',
            href: subItem.href || '#',
            isActive: determineActive(subItemId, subItem.href, subItem.active),
            index: subIndex,
            originalItem: subItem,
          };
        });

        const hasSubItems = processedSubItems.length > 0;
        const hasActiveChild = processedSubItems.some(sub => sub.isActive);
        const selectedSubItemIndex = processedSubItems.findIndex(sub => sub.isActive);
        const isExpanded = expandedItems.value.has(itemId);
        const isActive = determineActive(itemId, item.href, item.active);

        // Support both 'imageSource'/'activeImageSource' AND 'image'/'activeImage' property names
        const resolvedImageSource = item.imageSource || item.image || '';
        const resolvedActiveImageSource = item.activeImageSource || item.activeImage || '';

        const processedItem = {
          id: itemId,
          label: item.label || 'Untitled',
          href: item.href || '#',
          icon: item.icon,
          activeIcon: item.activeIcon,
          imageSource: resolvedImageSource,
          activeImageSource: resolvedActiveImageSource,
          badge: item.badge,
          isActive,
          hasSubItems,
          hasActiveChild,
          selectedSubItemIndex,
          isExpanded,
          subItems: processedSubItems,
          originalItem: item,
        };
        
        console.log('[Navigation] Processed item:', {
          id: processedItem.id,
          label: processedItem.label,
          isActive: processedItem.isActive,
          imageSource: processedItem.imageSource,
          activeImageSource: processedItem.activeImageSource,
          imageSourceType: typeof processedItem.imageSource,
          activeImageSourceType: typeof processedItem.activeImageSource
        });
        
        return processedItem;
      });
    });

    // Computed: Home route
    const homeRoute = computed(() => {
      return props.content?.homeRoute || null;
    });

    // Computed: Settings item
    const settingsItem = computed(() => {
      const settings = props.content?.settingsItem || null;
      if (!settings) return null;
      
      const settingsId = settings.id || 'settings';
      const settingsHref = settings.href || '#';
      // Only determine active if href is not just '#'
      const isActive = settingsHref !== '#' ? determineActive(settingsId, settingsHref, settings.active) : (settings.active || false);
      
      return {
        id: settingsId,
        label: settings.label || 'Settings',
        href: settingsHref,
        icon: settings.icon || '',
        activeIcon: settings.activeIcon || '',
        imageSource: settings.imageSource || settings.image || '',
        activeImageSource: settings.activeImageSource || settings.activeImage || '',
        isActive: isActive,
      };
    });

    // Computed: Process sections
    const processedSections = computed(() => {
      const sections = props.content?.sections || [];
      
      if (!Array.isArray(sections) || sections.length === 0) {
        return [];
      }
      
      return sections.map((section, sectionIndex) => {
        if (!section) return null;
        
        const sectionId = section.id || `section-${sectionIndex}`;
        
        // Process section items (simple items, no sub-items)
        const sectionItems = Array.isArray(section.items) ? section.items : [];
        const processedSectionItems = sectionItems.map((item, itemIndex) => {
          if (!item) return null;
          
          const itemId = item.id || `section-${sectionId}-item-${itemIndex}`;
          // Support both 'imageSource'/'activeImageSource' AND 'image'/'activeImage' property names
          const resolvedImageSource = item.imageSource || item.image || '';
          const resolvedActiveImageSource = item.activeImageSource || item.activeImage || '';
          
          return {
            id: itemId,
            label: item.label || 'Untitled',
            href: item.href || '#',
            icon: item.icon || '',
            activeIcon: item.activeIcon || '',
            imageSource: resolvedImageSource,
            activeImageSource: resolvedActiveImageSource,
            badge: item.badge || '',
            isActive: determineActive(itemId, item.href || '#', item.active),
            originalItem: item,
          };
        }).filter(item => item !== null);

        return {
          id: sectionId,
          label: section.label || 'Section',
          items: processedSectionItems,
          originalSection: section,
        };
      }).filter(section => section !== null);
    });

    // Computed: Display options
    const showIcons = computed(() => {
      return props.content?.showIcons !== false;
    });

    const showBadges = computed(() => {
      return props.content?.showBadges !== false;
    });

    // Icon handling
    const iconCache = ref(new Map());
    const { getIcon } = wwLib?.useIcons?.() || { getIcon: async () => null };

    // Reactive icon HTML function for each item
    const getItemIconHTML = (item) => {
      if (!showIcons.value) return '';
      
      const iconName = item.isActive && item.activeIcon ? item.activeIcon : item.icon;
      if (!iconName) return '';

      // Return cached icon if available
      return iconCache.value.get(iconName) || '';
    };

    // Get settings icon HTML
    const getSettingsIconHTML = () => {
      if (!showIcons.value) return '';
      
      const settings = settingsItem.value;
      if (!settings) return '';
      
      const iconName = settings.isActive && settings.activeIcon ? settings.activeIcon : settings.icon;
      if (!iconName) return '';

      // Return cached icon if available
      return iconCache.value.get(iconName) || '';
    };

    // Get image source for navigation item
    const getItemImageSource = (item) => {
      if (!item) {
        console.log('[Navigation] getItemImageSource: item is null/undefined');
        return null;
      }
      
      console.log('[Navigation] getItemImageSource for item:', {
        id: item.id,
        label: item.label,
        isActive: item.isActive,
        hasImageSource: !!item.imageSource,
        hasActiveImageSource: !!item.activeImageSource,
        imageSource: item.imageSource,
        activeImageSource: item.activeImageSource
      });
      
      // Get the appropriate image based on active state
      let imageSource = null;
      
      // If item is active, prefer activeImageSource
      if (item.isActive && item.activeImageSource) {
        const activeImg = String(item.activeImageSource).trim();
        if (activeImg && activeImg !== '') {
          imageSource = activeImg;
          console.log('[Navigation] Using activeImageSource:', imageSource);
        }
      }
      
      // If no activeImageSource or item is not active, use regular imageSource
      if (!imageSource && item.imageSource) {
        const regularImg = String(item.imageSource).trim();
        if (regularImg && regularImg !== '') {
          imageSource = regularImg;
          console.log('[Navigation] Using regular imageSource:', imageSource);
        }
      }
      
      // If no valid image source, return null
      if (!imageSource) {
        console.log('[Navigation] No valid image source found for item:', item.id);
        return null;
      }

      // Process and return (handles WeWeb design paths)
      const processed = processImageSource(imageSource);
      console.log('[Navigation] Processed image source:', processed, 'from original:', imageSource);
      return processed;
    };

    // Get image source for section item
    const getSectionItemImageSource = (item) => {
      if (!item) return null;
      
      // Get image source - prefer activeImage if item is active, otherwise use image
      let imageSource = null;
      
      // Check activeImageSource first if item is active and activeImageSource exists and is not empty
      if (item.isActive && item.activeImageSource && String(item.activeImageSource).trim()) {
        imageSource = String(item.activeImageSource).trim();
      } 
      // Fallback to regular imageSource if it exists and is not empty
      else if (item.imageSource && String(item.imageSource).trim()) {
        imageSource = String(item.imageSource).trim();
      }
      
      // If no valid image source, return null
      if (!imageSource) {
        return null;
      }

      // Process and return (handles WeWeb design paths)
      return processImageSource(imageSource);
    };

    // Get image source for settings item
    const getSettingsImageSource = () => {
      const settings = settingsItem.value;
      if (!settings) return null;
      
      // Get image source - prefer activeImage if item is active, otherwise use image
      let imageSource = null;
      
      // Check activeImageSource first if item is active and activeImageSource exists and is not empty
      if (settings.isActive && settings.activeImageSource && String(settings.activeImageSource).trim()) {
        imageSource = String(settings.activeImageSource).trim();
      } 
      // Fallback to regular imageSource if it exists and is not empty
      else if (settings.imageSource && String(settings.imageSource).trim()) {
        imageSource = String(settings.imageSource).trim();
      }
      
      // If no valid image source, return null
      if (!imageSource) {
        return null;
      }

      // Process and return (handles WeWeb design paths)
      return processImageSource(imageSource);
    };

    // Preload icons
    const preloadIcons = async () => {
      const items = processedItems.value;
      const iconNames = new Set();
      
      items.forEach(item => {
        if (item.icon) iconNames.add(item.icon);
        if (item.activeIcon) iconNames.add(item.activeIcon);
      });

      // Add section items icons
      const sections = processedSections.value;
      sections.forEach(section => {
        section.items.forEach(item => {
          if (item.icon) iconNames.add(item.icon);
          if (item.activeIcon) iconNames.add(item.activeIcon);
        });
      });

      // Add settings icon
      const settings = settingsItem.value;
      if (settings) {
        if (settings.icon) iconNames.add(settings.icon);
        if (settings.activeIcon) iconNames.add(settings.activeIcon);
      }

      for (const iconName of iconNames) {
        if (!iconCache.value.has(iconName)) {
          try {
            const iconHTML = await getIcon(iconName);
            if (iconHTML) {
              iconCache.value.set(iconName, iconHTML);
            }
          } catch (error) {
            // Icon not found, skip
          }
        }
      }
      
      // Force reactivity update
      iconCache.value = new Map(iconCache.value);
    };

    // Image handling
    const processImageSource = (imageSource) => {
      console.log('[Navigation] processImageSource called with:', imageSource, 'type:', typeof imageSource);
      
      if (!imageSource) {
        console.log('[Navigation] processImageSource: imageSource is falsy, returning null');
        return null;
      }
      
      // Treat default placeholder as empty
      if (imageSource === 'https://cdn.weweb.app/public/images/no_image_selected.png') {
        console.log('[Navigation] processImageSource: detected placeholder image, returning null');
        return null;
      }
      
      // Handle WeWeb design paths (similar to image component)
      if (typeof imageSource === 'string' && imageSource.startsWith('designs/')) {
        const cdnPrefix = wwLib?.wwUtils?.getCdnPrefix() || '';
        const result = `${cdnPrefix}${imageSource}`;
        console.log('[Navigation] processImageSource: WeWeb design path, returning:', result);
        return result;
      }
      
      console.log('[Navigation] processImageSource: returning original imageSource:', imageSource);
      return imageSource;
    };

    // Collapse inactive items helper
    const collapseInactiveItems = () => {
      const itemsToCollapse = [];
      
      // Find all items that are expanded but no longer active
      processedItems.value.forEach(item => {
        if (item.hasSubItems && expandedItems.value.has(item.id)) {
          // Check if this item or any of its sub-items is active
          const isItemActive = item.isActive || item.hasActiveChild;
          
          // Collapse if item is not active (unselected)
          if (!isItemActive) {
            itemsToCollapse.push(item.id);
          }
        }
      });
      
      // Collapse all inactive items
      if (itemsToCollapse.length > 0) {
        itemsToCollapse.forEach(itemId => {
          expandedItems.value.delete(itemId);
        });
        setExpandedItemIds(Array.from(expandedItems.value));
        // Force reactivity update
        expandedItems.value = new Set(expandedItems.value);
      }
    };

    // Toggle expansion
    const toggleExpansion = (itemId, accordionMode = true) => {
      const wasExpanded = expandedItems.value.has(itemId);
      
      // Accordion mode: close all other items
      if (accordionMode && !wasExpanded) {
        expandedItems.value.clear();
      }
      
      // Toggle the clicked item
      if (wasExpanded) {
        expandedItems.value.delete(itemId);
      } else {
        expandedItems.value.add(itemId);
      }
      
      // Update internal variable
      setExpandedItemIds(Array.from(expandedItems.value));
      
      emit('trigger-event', {
        name: 'expansion-toggle',
        event: { itemId, isExpanded: expandedItems.value.has(itemId) }
      });
      
      // Force reactivity update
      expandedItems.value = new Set(expandedItems.value);
    };

    // Handle item click (with sub-items)
    const handleItemClick = (item, event) => {
      // Detect editor mode (stays in production)
      const isEditMode = props.wwEditorState?.isEditing;
      
      /* wwEditor:start */
      // Only prevent in editor
      if (isEditMode) {
        event.preventDefault();
        event.stopPropagation();
      }
      /* wwEditor:end */

      const behavior = props.content?.expansionBehavior || 'both';
      const accordionMode = props.content?.accordionMode !== false;
      const previousHref = currentActiveHref.value;
      
      // Collapse previous item if it had sub-items and is different from current
      if (previousHref && previousHref !== item.href) {
        const previousItem = processedItems.value.find(i => i.href === previousHref);
        if (previousItem && previousItem.hasSubItems && expandedItems.value.has(previousItem.id)) {
          // Only collapse if the new item doesn't have sub-items or is different
          if (!item.hasSubItems || item.href !== previousHref) {
            expandedItems.value.delete(previousItem.id);
            setExpandedItemIds(Array.from(expandedItems.value));
            expandedItems.value = new Set(expandedItems.value);
          }
        }
      }
      
      // Handle expansion
      if (item.hasSubItems) {
        if (behavior === 'manual' || behavior === 'both') {
          toggleExpansion(item.id, accordionMode);
        }
        
        if (behavior === 'auto' || behavior === 'both') {
          // Auto-expand on navigation
          if (!expandedItems.value.has(item.id)) {
            // If accordion mode, close all other items first
            if (accordionMode) {
              expandedItems.value.clear();
            }
            expandedItems.value.add(item.id);
            setExpandedItemIds(Array.from(expandedItems.value));
          }
        }
      } else {
        // If clicking an item without sub-items, collapse all expanded items
        if (accordionMode) {
          expandedItems.value.clear();
          setExpandedItemIds(Array.from(expandedItems.value));
          expandedItems.value = new Set(expandedItems.value);
        }
      }
      
      // Update manually selected id
      manuallySelectedId.value = item.id;
      currentActiveHref.value = item.href;
      setInternalActiveHref(item.href);
      
      if (item.hasSubItems) {
        setActiveParentHref(item.href);
      }

      // Update navigation state
      const totalItems = processedItems.value.length;
      setNavigationState({
        activeHref: item.href,
        activeLabel: item.label,
        totalItems,
      });

      // Emit events
      emit('trigger-event', {
        name: 'navigation-click',
        event: {
          href: item.href,
          label: item.label,
          domEvent: event,
        },
      });

      if (previousHref !== item.href) {
        emit('trigger-event', {
          name: 'active-change',
          event: {
            previousHref: previousHref,
            currentHref: item.href,
          },
        });
      }

      // Navigation logic MUST be outside wwEditor blocks
      if (!isEditMode && wwLib?.goTo && item.href) {
        event.preventDefault();
        wwLib.goTo(item.href);
      }
      // Let <a> tag navigate naturally if wwLib.goTo unavailable
    };

    // Handle sub-item click
    const handleSubItemClick = (parentItem, subItem, event) => {
      // Detect editor mode (stays in production)
      const isEditMode = props.wwEditorState?.isEditing;
      
      /* wwEditor:start */
      // Only prevent in editor
      if (isEditMode) {
        event.preventDefault();
        event.stopPropagation();
      }
      /* wwEditor:end */
      
      const previousHref = currentActiveHref.value;
      
      // Update active state
      manuallySelectedId.value = subItem.id;
      currentActiveHref.value = subItem.href;
      setInternalActiveHref(subItem.href);
      setActiveParentHref(parentItem.href);
      
      // Update navigation state
      const totalItems = processedItems.value.length;
      setNavigationState({
        activeHref: subItem.href,
        activeLabel: subItem.label,
        totalItems,
      });
      
      emit('trigger-event', {
        name: 'sub-navigation-click',
        event: { 
          parentHref: parentItem.href,
          parentLabel: parentItem.label,
          href: subItem.href, 
          label: subItem.label 
        }
      });
      
      emit('trigger-event', {
        name: 'navigation-click',
        event: {
          href: subItem.href,
          label: subItem.label,
          domEvent: event,
        },
      });

      if (previousHref !== subItem.href) {
        emit('trigger-event', {
          name: 'active-change',
          event: {
            previousHref: previousHref,
            currentHref: subItem.href,
          },
        });
      }

      // Navigation logic MUST be outside wwEditor blocks
      if (!isEditMode && wwLib?.goTo && subItem.href) {
        event.preventDefault();
        wwLib.goTo(subItem.href);
      }
      // Let <a> tag navigate naturally if wwLib.goTo unavailable
    };

    // Handle section item click
    const handleSectionItemClick = (item, event) => {
      // Detect editor mode (stays in production)
      const isEditMode = props.wwEditorState?.isEditing;
      
      /* wwEditor:start */
      // Only prevent in editor
      if (isEditMode) {
        event.preventDefault();
        event.stopPropagation();
      }
      /* wwEditor:end */

      const previousHref = currentActiveHref.value;
      
      // Update active state
      manuallySelectedId.value = item.id;
      currentActiveHref.value = item.href;
      setInternalActiveHref(item.href);

      // Update navigation state
      const totalItems = processedItems.value.length;
      setNavigationState({
        activeHref: item.href,
        activeLabel: item.label,
        totalItems,
      });

      emit('trigger-event', {
        name: 'section-item-click',
        event: {
          href: item.href,
          label: item.label,
          domEvent: event,
        },
      });

      emit('trigger-event', {
        name: 'navigation-click',
        event: {
          href: item.href,
          label: item.label,
          domEvent: event,
        },
      });

      if (previousHref !== item.href) {
        emit('trigger-event', {
          name: 'active-change',
          event: {
            previousHref: previousHref,
            currentHref: item.href,
          },
        });
      }

      // Navigation logic MUST be outside wwEditor blocks
      if (!isEditMode && wwLib?.goTo && item.href) {
        event.preventDefault();
        wwLib.goTo(item.href);
      }
      // Let <a> tag navigate naturally if wwLib.goTo unavailable
    };

    // Handle home click
    const handleHomeClick = (event) => {
      // Detect editor mode (stays in production)
      const isEditMode = props.wwEditorState?.isEditing;
      
      /* wwEditor:start */
      // Only prevent in editor
      if (isEditMode) {
        event.preventDefault();
        event.stopPropagation();
      }
      /* wwEditor:end */

      const href = homeRoute.value?.href || '/';
      const label = homeRoute.value?.label || 'Home';

      // Clear manual selection when clicking home
      manuallySelectedId.value = '';
      setActiveParentHref('');
      
      // Collapse all expanded items when clicking home
      if (expandedItems.value.size > 0) {
        expandedItems.value.clear();
        setExpandedItemIds(Array.from(expandedItems.value));
        expandedItems.value = new Set(expandedItems.value);
      }

      emit('trigger-event', {
        name: 'home-click',
        event: {
          href: href,
          label: label,
        },
      });

      emit('trigger-event', {
        name: 'navigation-click',
        event: {
          href: href,
          label: label,
          domEvent: event,
        },
      });

      // Navigation logic MUST be outside wwEditor blocks
      if (!isEditMode && wwLib?.goTo && href) {
        event.preventDefault();
        wwLib.goTo(href);
      }
      // Let <a> tag navigate naturally if wwLib.goTo unavailable
    };

    // Handle settings click
    const handleSettingsClick = (event) => {
      // Detect editor mode (stays in production)
      const isEditMode = props.wwEditorState?.isEditing;
      
      /* wwEditor:start */
      // Only prevent in editor
      if (isEditMode) {
        event.preventDefault();
        event.stopPropagation();
      }
      /* wwEditor:end */

      const settings = settingsItem.value;
      if (!settings) return;

      const href = settings.href || '#';
      const label = settings.label || 'Settings';
      const previousHref = currentActiveHref.value;

      // Collapse all expanded items when clicking settings
      if (expandedItems.value.size > 0) {
        expandedItems.value.clear();
        setExpandedItemIds(Array.from(expandedItems.value));
        expandedItems.value = new Set(expandedItems.value);
      }

      // Update active state
      manuallySelectedId.value = settingsItem.value?.id || 'settings';
      currentActiveHref.value = href;
      setInternalActiveHref(href);

      // Update navigation state
      const totalItems = processedItems.value.length;
      setNavigationState({
        activeHref: href,
        activeLabel: label,
        totalItems,
      });

      emit('trigger-event', {
        name: 'settings-click',
        event: {
          href: href,
          label: label,
          domEvent: event,
        },
      });

      emit('trigger-event', {
        name: 'navigation-click',
        event: {
          href: href,
          label: label,
          domEvent: event,
        },
      });

      if (previousHref !== href) {
        emit('trigger-event', {
          name: 'active-change',
          event: {
            previousHref: previousHref,
            currentHref: href,
          },
        });
      }

      // Navigation logic MUST be outside wwEditor blocks
      if (!isEditMode && wwLib?.goTo && href) {
        event.preventDefault();
        wwLib.goTo(href);
      }
      // Let <a> tag navigate naturally if wwLib.goTo unavailable
    };

    // Check if mobile based on viewport width
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      const breakpoint = props.content?.mobileBreakpoint || 768;
      isMobile.value = window.innerWidth < breakpoint;
    };

    // Auto-expand items with active children
    const autoExpandActiveItems = () => {
      const behavior = props.content?.expansionBehavior || 'both';
      if (behavior !== 'auto' && behavior !== 'both') return;
      
      processedItems.value.forEach(item => {
        if (item.hasActiveChild && !expandedItems.value.has(item.id)) {
          expandedItems.value.add(item.id);
        }
      });
      
      setExpandedItemIds(Array.from(expandedItems.value));
    };

    // Watch for property changes
    watch(
      () => [
        props.content?.navigationItems,
        props.content?.sections,
        props.content?.activeDetection,
        props.content?.currentPath,
        props.content?.showIcons,
        props.content?.showBadges,
        props.content?.homeRoute,
        props.content?.settingsItem,
        props.content?.expansionBehavior,
      ],
      () => {
        // Preload icons when items change
        preloadIcons();
        // Auto-expand active items
        autoExpandActiveItems();
      },
      { deep: true }
    );

    // Watch for processed items changes
    watch(processedItems, () => {
      preloadIcons();
      autoExpandActiveItems();
    }, { immediate: true, deep: true });

    // Watch for processed sections changes
    watch(processedSections, () => {
      preloadIcons();
    }, { immediate: true, deep: true });

    // Watch for active href changes to collapse inactive items
    watch(currentActiveHref, (newHref, oldHref) => {
      // Collapse items that are no longer active
      if (oldHref && newHref !== oldHref) {
        nextTick(() => {
          collapseInactiveItems();
        });
      }
    });

    // Watch for processed items changes to collapse unselected items
    watch(processedItems, (newItems, oldItems) => {
      if (!oldItems || oldItems.length === 0) return;
      
      nextTick(() => {
        const itemsToCollapse = [];
        
        newItems.forEach(item => {
          if (item.hasSubItems && expandedItems.value.has(item.id)) {
            // Check if this item or any of its sub-items is still active
            const isItemActive = item.isActive || item.hasActiveChild;
            
            // If item is no longer active, collapse it
            if (!isItemActive) {
              itemsToCollapse.push(item.id);
            }
          }
        });
        
        // Collapse all unselected items
        if (itemsToCollapse.length > 0) {
          itemsToCollapse.forEach(itemId => {
            expandedItems.value.delete(itemId);
          });
          setExpandedItemIds(Array.from(expandedItems.value));
          expandedItems.value = new Set(expandedItems.value);
        }
      });
    }, { deep: true });

    // Lifecycle
    onMounted(() => {
      checkMobile();

      if (typeof window !== 'undefined') {
        window.addEventListener('resize', checkMobile);
      }

      // Preload all icons
      preloadIcons();
      
      // Auto-expand active items
      autoExpandActiveItems();
    });

    onUnmounted(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkMobile);
      }
    });

    return {
      // Refs
      wrapperRef,
      
      // State
      isMobile,
      
      // Computed
      processedItems,
      processedSections,
      homeRoute,
      settingsItem,
      showIcons,
      showBadges,
      
      // Methods
      handleItemClick,
      handleSubItemClick,
      handleSectionItemClick,
      handleHomeClick,
      handleSettingsClick,
      getItemIconHTML,
      getSettingsIconHTML,
      getItemImageSource,
      getSectionItemImageSource,
      getSettingsImageSource,
    };
  },
};
</script>

<style lang="scss" scoped>
/* Polaris Design Tokens - Defined directly for standalone component */
:root {
  /* Color tokens - Background */
  --p-color-bg: #ffffff;
  --p-color-nav-bg: #f1f1f1;
  --p-color-bg-inverse: #202223;
  --p-color-bg-surface-hover: #F6F6F7;
  --p-color-bg-surface-active: #E5E5E5;
  --p-color-bg-surface-selected: #F0F0F0;
  --p-color-bg-fill-transparent-hover: rgba(0, 0, 0, 0.05);
  --p-color-nav-bg-surface-hover: #F6F6F7;
  --p-color-nav-bg-surface-active: #E5E5E5;
  --p-color-nav-bg-surface-selected: #F0F0F0;
  --p-color-bg-fill-info: #E0E3E7;
  
  /* Color tokens - Text */
  --p-color-text: #202223;
  --p-color-text-secondary: #6D7175;
  --p-color-text-subdued: #6D7175;
  --p-color-text-disabled: #A3A7AA;
  --p-color-text-brand: #005BD3;
  --p-color-text-brand-hover: #004A9C;
  
  /* Color tokens - Icons */
  --p-color-icon: #5C5F62;
  --p-color-icon-hover: #303235;
  --p-color-icon-active: #202223;
  --p-color-icon-brand: #005BD3;
  
  /* Color tokens - Borders */
  --p-color-border: #C9CCCF;
  --p-color-border-subdued: #E1E3E5;
  --p-color-border-secondary: #E1E3E5;
  --p-color-border-brand: #005BD3;
  --p-color-border-focus: #005BD3;
  
  /* Color tokens - Scrollbar */
  --p-color-scrollbar-thumb-bg-hover: #C9CCCF;
  
  /* Spacing tokens */
  --p-space-050: 2px;
  --p-space-100: 4px;
  --p-space-150: 6px;
  --p-space-200: 8px;
  --p-space-300: 12px;
  --p-space-400: 16px;
  --p-space-500: 20px;
  --p-space-600: 24px;
  --p-space-800: 32px;
  
  /* Border radius tokens */
  --p-border-radius-100: 4px;
  --p-border-radius-200: 8px;
  --p-border-radius-300: 6px;
  
  /* Border width tokens */
  --p-border-width-025: 1px;
  --p-border-width-050: 1px;
  
  /* Font tokens */
  --p-font-line-height-500: 20px;
  --p-font-line-height-600: 24px;
  
  /* Motion/Animation tokens */
  --p-motion-duration-100: 100ms;
  --p-motion-duration-150: 150ms;
  --p-motion-ease-in: cubic-bezier(0.5, 0.1, 1, 1);
  --p-motion-ease-out: cubic-bezier(0, 0, 0.3, 1);
  
  /* Z-index tokens */
  --p-z-index-1: 1;
  
  /* Component-specific Navigation tokens */
  --pc-navigation-mobile-height: 40px;
  --pc-navigation-desktop-height: 28px;
  --pc-navigation-icon-size: 20px;
  --pc-navigation-item-line-height: 40px;
  --pc-navigation-letter-spacing-medium: -0.005rem;
}

/* Base Polaris typography and reset styles */
.Polaris-Navigation * {
  box-sizing: border-box;
}

.Polaris-Text--root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.Polaris-Text--bodyMd {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.Polaris-Text--bodySm {
  font-size: 13px;
  line-height: 16px;
  font-weight: 400;
}

.Polaris-Text--regular {
  font-weight: 400;
}

.Polaris-Text--medium {
  font-weight: 500;
}

.Polaris-Text--semibold {
  font-weight: 600;
}

.Polaris-Text--subdued {
  color: var(--p-color-text-subdued);
}

.Polaris-Text--visuallyHidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.polaris-navigation-wrapper {
  width: 100%;
  position: relative;

  &:focus,
  &:focus-visible {
    outline: none;
  }
}

/* Match exact Polaris Navigation styles from React implementation */
.Polaris-Navigation {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  background-color: #ebebeb;
  overflow: hidden; /* Prevent container from scrolling */

  &:focus,
  &:focus-visible {
    outline: none;
    background-color: #ebebeb;
  }
}

.Polaris-Navigation__PrimaryNavigation {
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 1 0; /* Take available space, allow shrinking */
  flex-direction: column;
  align-items: stretch;
  max-width: 100%;
  min-height: 0; /* Critical for flex scrolling */
  padding-top: var(--p-space-100, 4px);
  padding-bottom: var(--p-space-400, 16px);

  @media (min-width: 768px) {
    padding-top: var(--p-space-400, 16px);
  }

  &:focus,
  &:focus-visible {
    outline: none;
    background-color: #ebebeb;
  }

  /* Safari scrollbar styles */
  &::-webkit-scrollbar {
    width: 11px;
    opacity: 0;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--p-color-scrollbar-thumb-bg-hover, var(--p-color-border, #C9CCCF));
    border: var(--p-border-width-050, 1px) solid transparent;
    border-radius: var(--p-border-radius-300, 6px);
    background-clip: content-box;
  }
  
  scrollbar-width: thin;
  scrollbar-gutter: stable;
  scrollbar-color: #ebebeb transparent;
  transition: scrollbar-color 0.1s ease-in;

  &:hover {
    scrollbar-color: var(--p-color-scrollbar-thumb-bg-hover, var(--p-color-border, #C9CCCF)) transparent;
    background-color: #ebebeb;

    &::-webkit-scrollbar {
      opacity: 1;
    }
  }
}

.Polaris-Navigation__Settings {
  flex-shrink: 0;
  flex-grow: 0;
  border-top: var(--p-border-width-025, 1px) solid var(--p-color-border-secondary, var(--p-color-border-subdued, #E1E3E5));
  background-color: #ebebeb;
  padding-top: var(--p-space-200, 8px);
  padding-bottom: var(--p-space-200, 8px);
  margin-top: auto; /* Push to bottom */
}

.Polaris-Navigation__Section {
  flex: 0 0 auto;
  margin: 0;
  padding: var(--p-space-400, 16px) 0;
  padding-top: 0;
  list-style: none;

  + .Polaris-Navigation__Section {
    padding-top: var(--p-space-200, 8px);
    padding-bottom: var(--p-space-400, 16px);
    border-top: var(--p-border-width-025, 1px) solid var(--p-color-border-secondary, var(--p-color-border-subdued, #E1E3E5));
  }
}

.Polaris-Navigation__SectionHeading {
  display: flex;
  align-items: center;
  padding-left: var(--p-space-500, 20px);
  padding-right: var(--p-space-100, 4px);

  > :first-child {
    flex: 1 1 auto;
    margin-top: calc(var(--p-space-200, 8px) + var(--p-space-050, 2px));
    margin-bottom: var(--p-space-200, 8px);

    @media (min-width: 768px) {
      margin-top: var(--p-space-100, 4px);
      margin-bottom: var(--p-space-200, 8px);
    }
  }

  .Polaris-Text--root {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--p-color-text-subdued, #6D7175);
  }
}

.Polaris-Navigation__ListItem {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  &:not(:first-child) {
    .Polaris-Navigation__ItemInnerWrapper {
      border-top: 0;
    }
  }
}

.Polaris-Navigation__ItemWrapper {
  width: 100%;
  padding: 0 var(--p-space-300, 12px);
}

.Polaris-Navigation__ItemInnerWrapper {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  border-radius: var(--p-border-radius-200, 8px);
  transition: background-color 0.15s ease-out;

  &:is(:hover, :focus-visible) {
    background: var(--p-color-nav-bg-surface-hover, var(--p-color-bg-surface-hover, #F6F6F7));
  }

  &:active {
    background-color: var(--p-color-nav-bg-surface-active, var(--p-color-bg-surface-active, #E5E5E5));
  }

  &--selected {
    background-color: #ffffff;

    .Polaris-Navigation__Text {
      color: var(--p-color-text, #202223);
    }

    &:is(:hover, :focus-visible) {
      background: #ffffff;
    }

    &:active {
      background: var(--p-color-nav-bg-surface-active, var(--p-color-bg-surface-active, #E5E5E5));
    }
  }

  &--open {
    background-color: transparent;

    &:active {
      background: var(--p-color-nav-bg-surface-active, var(--p-color-bg-surface-active, #E5E5E5));
    }
  }
}

.Polaris-Navigation__Item {
  display: flex;
  flex-grow: 1;
  align-items: flex-start;
  max-width: 100%;
  padding: 0 var(--p-space-100, 4px) 0 var(--p-space-200, 8px);
  margin: 0;
  color: var(--p-color-text, #202223);
  text-decoration: none;
  text-align: left;
  border-radius: var(--p-border-radius-200, 8px);
  transition: background-color 0.15s ease-out;
  position: relative;

  &:focus-visible {
    background: var(--p-color-bg-surface-hover, #F6F6F7);
    color: var(--p-color-text, #202223);
    text-decoration: none;
    outline: var(--p-border-width-050, 1px) solid var(--p-color-border-focus, #005BD3);
  }

  &:focus-visible:not(:active) {
    z-index: var(--p-z-index-1, 1);
  }

  &:active,
  &:active:hover {
    color: var(--p-color-text, #202223);
    background-color: var(--p-color-nav-bg-surface-selected, var(--p-color-bg-surface-selected, #F0F0F0));
  }

  &:is(:hover, :focus-visible) {
    background-color: transparent;
    color: var(--p-color-text, #202223);
    text-decoration: none;
  }

  &--selected {
    color: var(--p-color-text, #202223);
    outline: var(--p-border-width-025, 1px) solid transparent;



    &:hover,
    &:focus-visible {
      color: var(--p-color-text, #202223);
    }

    &:active,
    &:active:hover {
      color: var(--p-color-text, #202223);
      background-color: var(--p-color-nav-bg-surface-active, var(--p-color-bg-surface-active, #E5E5E5));
    }
  }

  &--line {
    position: relative;
    padding-left: calc(var(--p-space-800, 32px) + var(--p-space-100, 4px));

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: var(--p-space-200, 8px);
      width: 21px;
      height: 32px;
      border-radius: 0;
      opacity: 0;
      transition: opacity 0.15s ease-out;

      @media (min-width: 768px) {
        height: 28px;
      }
    }
  }
}

.Polaris-Navigation__Icon {
  flex-shrink: 0;
  align-self: flex-start;
  width: 20px;
  height: 20px;
  margin-top: var(--p-space-200, 8px);
  margin-right: var(--p-space-200, 8px);
  margin-bottom: var(--p-space-200, 8px);

  @media (min-width: 768px) {
    margin-top: var(--p-space-100, 4px);
    margin-right: var(--p-space-200, 8px);
    margin-bottom: var(--p-space-100, 4px);
  }

  .Polaris-Icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    :deep(svg) {
      display: block;
      fill: var(--p-color-icon, #5C5F62);
      width: 100%;
      height: 100%;
    }
  }

  .Polaris-Navigation__Item:hover &,
  .Polaris-Navigation__Item:focus-visible & {
    .Polaris-Icon :deep(svg) {
      fill: var(--p-color-icon, #5C5F62);
    }
  }

  .Polaris-Navigation__Item--selected &,
  .Polaris-Navigation--subNavigationActive &,
  .Polaris-Navigation--itemChildActive & {
    .Polaris-Icon :deep(svg) {
      fill: var(--p-color-icon, #5C5F62);
    }
  }
}

.Polaris-Navigation__Image {
  flex-shrink: 0;
  align-self: flex-start;
  width: 20px;
  height: 20px;
  margin-top: var(--p-space-200, 8px);
  margin-right: var(--p-space-200, 8px);
  margin-bottom: var(--p-space-200, 8px);

  @media (min-width: 768px) {
    margin-top: var(--p-space-100, 4px);
    margin-right: var(--p-space-200, 8px);
    margin-bottom: var(--p-space-100, 4px);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: var(--p-border-radius-100, 4px);
    /* Ensure SVG icons with currentColor are visible */
    filter: brightness(0) saturate(100%);
  }
}

.Polaris-Navigation__Text {
  flex: 1 1 auto;
  margin-top: var(--p-space-150, 6px);
  margin-bottom: var(--p-space-150, 6px);

  @media (min-width: 768px) {
    margin-top: var(--p-space-100, 4px);
    margin-bottom: var(--p-space-100, 4px);
  }

  .Polaris-Text--root {
    color: inherit;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  .Polaris-Text--semibold {
    font-weight: 600;
  }

  .Polaris-Text--medium {
    font-weight: 500;
  }

  .Polaris-Text--regular {
    font-weight: 400;
  }

  .Polaris-Text--subdued {
    color: var(--p-color-text-subdued, #6D7175);
  }
}

.Polaris-Navigation__Badge {
  margin-left: var(--p-space-200, 8px);
  display: inline-flex;
  height: var(--p-font-line-height-500, 20px);
  margin-top: var(--p-space-200, 8px);
  margin-right: var(--p-space-100, 4px);

  @media (min-width: 768px) {
    margin: var(--p-space-100, 4px);
    margin-right: var(--p-space-100, 4px);
    margin-top: var(--p-space-100, 4px);
  }

  .Polaris-Badge {
    padding: 0.125rem 0.375rem;
    min-width: 20px;
    background-color: var(--p-color-bg-fill-info, #E0E3E7);
    color: var(--p-color-text, #202223);
    font-size: 11px;
    font-weight: 600;
    border-radius: 10px;
    line-height: 16px;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &--toneNew {
      background-color: var(--p-color-bg-fill-info, #E0E3E7);
    }
  }
}

.Polaris-Navigation__SecondaryNavigation {
  flex-basis: 100%;
  margin-left: 0;
  overflow-x: visible;

  &Open {
    animation: snappy-grow 0.15s ease-out;
  }

  .Polaris-Navigation__List {
    margin: 0;
    padding: 0;
    list-style: none;
    margin-bottom: var(--p-space-200, 8px);
  }

  .Polaris-Navigation__Item {
    position: relative;
    padding-left: calc(var(--p-space-800, 32px) + var(--p-space-100, 4px));

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: var(--p-space-200, 8px);
      width: 21px;
      height: 32px;
      border-radius: 0;
      opacity: 0;
      transition: opacity 0.15s ease-out;

      @media (min-width: 768px) {
        height: 28px;
      }
    }

    &:is(:hover, :focus-visible) {
      background: var(--p-color-nav-bg-surface-hover, var(--p-color-bg-surface-hover, #F6F6F7));
      color: var(--p-color-text, #202223);
    }

    &:hover {
      color: var(--p-color-text, #202223);
      background: var(--p-color-nav-bg-surface-hover, var(--p-color-bg-surface-hover, #F6F6F7));
    }

    &:focus-visible {
      outline: var(--p-border-width-050, 1px) solid var(--p-color-border-focus, #005BD3);
    }

    &:active,
    &:active:hover {
      background-color: var(--p-color-nav-bg-surface-active, var(--p-color-bg-surface-active, #E5E5E5));
    }

    &:active {
      color: var(--p-color-text-brand, #005BD3);
    }

    &--selected {
      border-radius: var(--p-border-radius-200, 8px);
      color: var(--p-color-text, #202223);
      background-color: #ffffff;

      &:is(:hover, :focus-visible) {
        background: #ffffff;
        color: var(--p-color-text, #202223);
      }

      &:active,
      &:active:hover {
        background: var(--p-color-nav-bg-surface-active, var(--p-color-bg-surface-active, #E5E5E5));
        color: var(--p-color-text, #202223);
      }

      &:hover {
        color: var(--p-color-text, #202223);
      }

      &:focus-visible {
        color: var(--p-color-text, #202223);
      }

      &:active {
        color: var(--p-color-text, #202223);
      }
    }
  }

  .Polaris-Navigation__Text {
    margin-top: var(--p-space-100, 4px);
    margin-bottom: var(--p-space-100, 4px);
  }

  /* Line indicator for sub-items - hidden by default */
  .Polaris-Navigation__Item--line::before {
    display: none;
    background: url('data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2228%22%20viewBox%3D%220%200%2021%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20x%3D%229%22%20width%3D%221.5%22%20height%3D%2228%22%20fill%3D%22%23B5B5B5%22%2F%3E%3C%2Fsvg%3E');
  }

  /* Show line only for items before the selected one */
  .Polaris-Navigation__Item--line.Polaris-Navigation__Item--showLine::before {
    display: block;
    opacity: 1;
  }

  /* Pointer indicator for active/selected sub-items - darker color */
  .Polaris-Navigation__Item--line.Polaris-Navigation--itemLinePointer::before,
  .Polaris-Navigation__Item--line.Polaris-Navigation__Item--selected::before {
    display: block;
    opacity: 1;
    background: url("data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2228%22%20viewBox%3D%220%200%2021%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M19%2014.25H19.75V15.75H19V14.25ZM10.077%2013.362L10.7452%2013.0215V13.0215L10.077%2013.362ZM11.388%2014.673L11.7285%2014.0048H11.7285L11.388%2014.673ZM10.5%200V10.2H9V0H10.5ZM14.55%2014.25H19V15.75H14.55V14.25ZM10.5%2010.2C10.5%2011.0525%2010.5006%2011.6467%2010.5384%2012.1093C10.5755%2012.5632%2010.6446%2012.824%2010.7452%2013.0215L9.40873%2013.7025C9.18239%2013.2582%209.08803%2012.7781%209.04336%2012.2315C8.99942%2011.6936%209%2011.0277%209%2010.2H10.5ZM14.55%2015.75C13.7223%2015.75%2013.0564%2015.7506%2012.5185%2015.7066C11.9719%2015.662%2011.4918%2015.5676%2011.0475%2015.3413L11.7285%2014.0048C11.926%2014.1054%2012.1868%2014.1745%2012.6407%2014.2116C13.1033%2014.2494%2013.6975%2014.25%2014.55%2014.25V15.75ZM10.7452%2013.0215C10.9609%2013.4448%2011.3052%2013.7891%2011.7285%2014.0048L11.0475%2015.3413C10.3419%2014.9817%209.76825%2014.4081%209.40873%2013.7025L10.7452%2013.0215Z%22%20fill%3D%22%23B5B5B5%22%2F%3E%3Cpath%20d%3D%22M17%2012L20%2015L17%2018%22%20stroke%3D%22%23B5B5B5%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
  }

  /* Pointer indicator on hover for ALL sub-items (except selected) - show arrow with lighter color */
  /* This should work regardless of whether another sub-item is selected */
  .Polaris-Navigation__Item--line:hover::before {
    display: block !important;
    opacity: 1;
    background: url("data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2228%22%20viewBox%3D%220%200%2021%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M19%2014.25H19.75V15.75H19V14.25ZM10.077%2013.362L10.7452%2013.0215V13.0215L10.077%2013.362ZM11.388%2014.673L11.7285%2014.0048H11.7285L11.388%2014.673ZM10.5%200V10.2H9V0H10.5ZM14.55%2014.25H19V15.75H14.55V14.25ZM10.5%2010.2C10.5%2011.0525%2010.5006%2011.6467%2010.5384%2012.1093C10.5755%2012.5632%2010.6446%2012.824%2010.7452%2013.0215L9.40873%2013.7025C9.18239%2013.2582%209.08803%2012.7781%209.04336%2012.2315C8.99942%2011.6936%209%2011.0277%209%2010.2H10.5ZM14.55%2015.75C13.7223%2015.75%2013.0564%2015.7506%2012.5185%2015.7066C11.9719%2015.662%2011.4918%2015.5676%2011.0475%2015.3413L11.7285%2014.0048C11.926%2014.1054%2012.1868%2014.1745%2012.6407%2014.2116C13.1033%2014.2494%2013.6975%2014.25%2014.55%2014.25V15.75ZM10.7452%2013.0215C10.9609%2013.4448%2011.3052%2013.7891%2011.7285%2014.0048L11.0475%2015.3413C10.3419%2014.9817%209.76825%2014.4081%209.40873%2013.7025L10.7452%2013.0215Z%22%20fill%3D%22%23D0D0D0%22%2F%3E%3Cpath%20d%3D%22M17%2012L20%2015L17%2018%22%20stroke%3D%22%23D0D0D0%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
  }

  /* Override hover for selected item - keep darker color */
  .Polaris-Navigation__Item--line.Polaris-Navigation__Item--selected:hover::before {
    background: url("data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2228%22%20viewBox%3D%220%200%2021%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M19%2014.25H19.75V15.75H19V14.25ZM10.077%2013.362L10.7452%2013.0215V13.0215L10.077%2013.362ZM11.388%2014.673L11.7285%2014.0048H11.7285L11.388%2014.673ZM10.5%200V10.2H9V0H10.5ZM14.55%2014.25H19V15.75H14.55V14.25ZM10.5%2010.2C10.5%2011.0525%2010.5006%2011.6467%2010.5384%2012.1093C10.5755%2012.5632%2010.6446%2012.824%2010.7452%2013.0215L9.40873%2013.7025C9.18239%2013.2582%209.08803%2012.7781%209.04336%2012.2315C8.99942%2011.6936%209%2011.0277%209%2010.2H10.5ZM14.55%2015.75C13.7223%2015.75%2013.0564%2015.7506%2012.5185%2015.7066C11.9719%2015.662%2011.4918%2015.5676%2011.0475%2015.3413L11.7285%2014.0048C11.926%2014.1054%2012.1868%2014.1745%2012.6407%2014.2116C13.1033%2014.2494%2013.6975%2014.25%2014.55%2014.25V15.75ZM10.7452%2013.0215C10.9609%2013.4448%2011.3052%2013.7891%2011.7285%2014.0048L11.0475%2015.3413C10.3419%2014.9817%209.76825%2014.4081%209.40873%2013.7025L10.7452%2013.0215Z%22%20fill%3D%22%23B5B5B5%22%2F%3E%3Cpath%20d%3D%22M17%2012L20%2015L17%2018%22%20stroke%3D%22%23B5B5B5%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
  }

  /* Pointer indicator on focus for sub-items */
  .Polaris-Navigation__Item--line:focus-visible::before {
    display: block;
    opacity: 1;
    background: url("data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2228%22%20viewBox%3D%220%200%2021%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M19%2014.25H19.75V15.75H19V14.25ZM10.077%2013.362L10.7452%2013.0215V13.0215L10.077%2013.362ZM11.388%2014.673L11.7285%2014.0048H11.7285L11.388%2014.673ZM10.5%200V10.2H9V0H10.5ZM14.55%2014.25H19V15.75H14.55V14.25ZM10.5%2010.2C10.5%2011.0525%2010.5006%2011.6467%2010.5384%2012.1093C10.5755%2012.5632%2010.6446%2012.824%2010.7452%2013.0215L9.40873%2013.7025C9.18239%2013.2582%209.08803%2012.7781%209.04336%2012.2315C8.99942%2011.6936%209%2011.0277%209%2010.2H10.5ZM14.55%2015.75C13.7223%2015.75%2013.0564%2015.7506%2012.5185%2015.7066C11.9719%2015.662%2011.4918%2015.5676%2011.0475%2015.3413L11.7285%2014.0048C11.926%2014.1054%2012.1868%2014.1745%2012.6407%2014.2116C13.1033%2014.2494%2013.6975%2014.25%2014.55%2014.25V15.75ZM10.7452%2013.0215C10.9609%2013.4448%2011.3052%2013.7891%2011.7285%2014.0048L11.0475%2015.3413C10.3419%2014.9817%209.76825%2014.4081%209.40873%2013.7025L10.7452%2013.0215Z%22%20fill%3D%22%23D0D0D0%22%2F%3E%3Cpath%20d%3D%22M17%2012L20%2015L17%2018%22%20stroke%3D%22%23D0D0D0%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E");
  }

  /* Hide line for sub-items that come after the selected item */
  .Polaris-Navigation__Item--hideLineAfterSelected::before {
    display: none !important;
  }
}

.Polaris-Collapsible {
  transition: max-height 0.3s ease-in-out, overflow 0.3s ease-in-out;

  &--isFullyClosed {
    max-height: 0;
    overflow: hidden;
  }
}

.Polaris-Navigation__List {
  margin: 0;
  padding: 0;
  list-style: none;
}

.Polaris-Navigation--subNavigationActive {
  font-weight: 600;
}

.Polaris-Navigation--itemChildActive {
  &::before {
    content: url('data:image/svg+xml,%3Csvg%20width%3D%2221%22%20height%3D%2228%22%20viewBox%3D%220%200%2021%2028%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M9%2024.75C9%2024.3358%209.33579%2024%209.75%2024V24C10.1642%2024%2010.5%2024.3358%2010.5%2024.75V28H9V24.75Z%22%20fill%3D%22%23B5B5B5%22%2F%3E%0A%3C%2Fsvg%3E');
    position: absolute;
    top: var(--p-space-200, 8px);
    left: var(--p-space-200, 8px);
    width: 21px;
    height: 32px;
    border-radius: 0;
    opacity: 1;
    transition: opacity 0.15s ease-out;

    @media (min-width: 768px) {
      top: 0;
      height: 28px;
    }
  }
}

.Polaris-Navigation--itemLinePointer {
  &::before {
    opacity: 1;
  }
}

@keyframes snappy-grow {
  from {
    margin-bottom: -10%;
    opacity: 0;
  }

  to {
    margin-bottom: 0%;
    opacity: 1;
  }
}
</style>


