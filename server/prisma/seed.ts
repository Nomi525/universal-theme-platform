import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const catalog = [
  {
    name: "Image Carousel",
    code: "banner_slider",
    defaultSettings: {
      image_upload_size_type: "banner_slider_medium",
      images: [],
      animation_style: "SLIDE",
      slideshow_delay: 3000,
      show_dots: true,
      section_background_color: "#ffffff",
      section_shadow: "drop-shadow-none",
      display_title: true,
      section_title: "Featured products",
      section_title_color: "#111827",
      display_subtitle: true,
      section_subtitle: "Explore the featured products in our collection",
      section_subtitle_color: "#1f2937",
      text_align: "center",
      images_shadow: "drop-shadow-none",
      image_radius: "md",
      section_top_margin: "1.5rem",
      section_bottom_margin: "1.5rem",
      section_top_inner_padding: "1.5rem",
      section_bottom_inner_padding: "1.5rem",
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [
            { path: "section_title", type: "text", label: "Title" },
            { path: "section_subtitle", type: "textarea", label: "Subtitle" },
            { path: "display_title", type: "boolean", label: "Show Title" },
            {
              path: "display_subtitle",
              type: "boolean",
              label: "Show Subtitle",
            },
            {
              path: "images",
              type: "imageList",
              label: "Slides",
              itemLabel: "Image",
              withLink: true,
            },
          ],
        },
        {
          label: "Behavior",
          fields: [
            {
              path: "animation_style",
              type: "select",
              label: "Animation",
              options: ["SLIDE", "FADE"],
            },
            {
              path: "slideshow_delay",
              type: "number",
              label: "Delay (ms)",
              min: 1000,
              step: 500,
            },
            { path: "show_dots", type: "boolean", label: "Show Dots" },
            {
              path: "text_align",
              type: "select",
              label: "Text Align",
              options: ["left", "center", "right"],
            },
          ],
        },
        {
          label: "Style",
          fields: [
            {
              path: "section_background_color",
              type: "color",
              label: "Background",
            },
            {
              path: "section_title_color",
              type: "color",
              label: "Title Color",
              showIf: { display_title: true },
            },
            {
              path: "section_subtitle_color",
              type: "color",
              label: "Subtitle Color",
              showIf: { display_subtitle: true },
            },
            {
              path: "images_shadow",
              type: "select",
              label: "Image Shadow",
              options: [
                "drop-shadow-none",
                "drop-shadow-sm",
                "drop-shadow",
                "drop-shadow-lg",
              ],
            },
            {
              path: "image_radius",
              type: "select",
              label: "Image Radius",
              options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
            },
            {
              path: "section_top_margin",
              type: "spacing",
              label: "Top Margin",
            },
            {
              path: "section_bottom_margin",
              type: "spacing",
              label: "Bottom Margin",
            },
            {
              path: "section_top_inner_padding",
              type: "spacing",
              label: "Top Padding",
            },
            {
              path: "section_bottom_inner_padding",
              type: "spacing",
              label: "Bottom Padding",
            },
          ],
        },
      ],
    },
  },
  {
    name: "Search Bar",
    code: "search_block",
    defaultSettings: {
      outer_background_color: "#ffffff",
      background_color: "#e2e8f0",
      placeholder_text: "Search for products",
      placeholder_text_color: "#6b7280",
      display_search_icon: true,
      search_icon_color: "#6b7280",
      border: false,
      border_size: "1px",
      border_color: "#111827",
      radius: "md",
      section_top_margin: "1.5rem",
      section_bottom_margin: "1.5rem",
      sticky_search_bar: true,
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Basics",
          fields: [
            { path: "placeholder_text", type: "text", label: "Placeholder" },
            {
              path: "display_search_icon",
              type: "boolean",
              label: "Show Icon",
            },
            {
              path: "sticky_search_bar",
              type: "boolean",
              label: "Sticky (mobile)",
            },
          ],
        },
        {
          label: "Colors",
          fields: [
            {
              path: "outer_background_color",
              type: "color",
              label: "Outer Background",
            },
            {
              path: "background_color",
              type: "color",
              label: "Input Background",
            },
            {
              path: "placeholder_text_color",
              type: "color",
              label: "Placeholder Color",
            },
            {
              path: "search_icon_color",
              type: "color",
              label: "Icon Color",
              showIf: { display_search_icon: true },
            },
          ],
        },
        {
          label: "Borders & Radius",
          fields: [
            { path: "border", type: "boolean", label: "Show Border" },
            {
              path: "border_size",
              type: "select",
              label: "Border Size",
              options: ["0px", "1px", "2px"],
              showIf: { border: true },
            },
            {
              path: "border_color",
              type: "color",
              label: "Border Color",
              showIf: { border: true },
            },
            {
              path: "radius",
              type: "select",
              label: "Corner Radius",
              options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
            },
          ],
        },
        {
          label: "Spacing",
          fields: [
            {
              path: "section_top_margin",
              type: "spacing",
              label: "Top Margin",
            },
            {
              path: "section_bottom_margin",
              type: "spacing",
              label: "Bottom Margin",
            },
          ],
        },
      ],
    },
  },
  {
    name: "Categories Grid",
    code: "categories_grid",
    defaultSettings: {
      display_title: true,
      section_title: "Shop by Category",
      section_title_color: "#111827",
      display_subtitle: false,
      section_subtitle: "Explore products from your favorites",
      section_subtitle_color: "#1f2937",
      categories_to_show: "ALL",
      custom_category_list: [],
      grid_column_count: 4,
      image_radius: "none",
      automatic_image_background_color: true,
      image_custom_background_color: "#ffffff",
      category_image_inner_padding: "0rem",
      image_border: false,
      image_border_size: "2px",
      image_border_color: "#111827",
      section_background_color: "#ffffff",
      category_display_order: "DEFAULT",
      category_name_font_size: "text-sm",
      category_name_top_margin: "0rem",
      category_name_color: "#4b5563",
      display_view_all_button: true,
      section_top_margin: "0rem",
      section_bottom_margin: "1.5rem",
      categories_page_style: "vertical",
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Header",
          fields: [
            { path: "display_title", type: "boolean", label: "Show Title" },
            {
              path: "section_title",
              type: "text",
              label: "Title",
              showIf: { display_title: true },
            },
            {
              path: "section_title_color",
              type: "color",
              label: "Title Color",
              showIf: { display_title: true },
            },
          ],
        },
        {
          label: "Grid",
          fields: [
            {
              path: "grid_column_count",
              type: "number",
              label: "Columns",
              min: 2,
              max: 6,
            },
            {
              path: "category_display_order",
              type: "select",
              label: "Order",
              options: ["DEFAULT", "ALPHABETICAL"],
            },
            {
              path: "categories_to_show",
              type: "select",
              label: "Source",
              options: ["ALL", "CUSTOM"],
            },
            {
              path: "custom_category_list",
              type: "idList",
              label: "Custom Categories",
              showIf: { categories_to_show: "CUSTOM" },
            },
          ],
        },
        {
          label: "Images",
          fields: [
            {
              path: "image_radius",
              type: "select",
              label: "Image Radius",
              options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
            },
            {
              path: "automatic_image_background_color",
              type: "boolean",
              label: "Auto Image BG",
            },
            {
              path: "image_custom_background_color",
              type: "color",
              label: "Custom Image BG",
              showIf: { automatic_image_background_color: false },
            },
            {
              path: "category_image_inner_padding",
              type: "spacing",
              label: "Image Padding",
            },
            { path: "image_border", type: "boolean", label: "Image Border" },
            {
              path: "image_border_size",
              type: "select",
              label: "Border Size",
              options: ["1px", "2px", "3px", "4px"],
              showIf: { image_border: true },
            },
            {
              path: "image_border_color",
              type: "color",
              label: "Border Color",
              showIf: { image_border: true },
            },
          ],
        },
        {
          label: "Text",
          fields: [
            {
              path: "category_name_font_size",
              type: "select",
              label: "Font Size",
              options: ["text-xs", "text-sm", "text-base", "text-lg"],
            },
            {
              path: "category_name_top_margin",
              type: "spacing",
              label: "Top Margin",
            },
            { path: "category_name_color", type: "color", label: "Text Color" },
          ],
        },
        {
          label: "Section",
          fields: [
            {
              path: "section_background_color",
              type: "color",
              label: "Section Background",
            },
            {
              path: "display_view_all_button",
              type: "boolean",
              label: "Show View All",
            },
            {
              path: "section_top_margin",
              type: "spacing",
              label: "Top Margin",
            },
            {
              path: "section_bottom_margin",
              type: "spacing",
              label: "Bottom Margin",
            },
          ],
        },
      ],
    },
  },
  {
    name: "Categories Strip",
    code: "categories_horizontal_strip",
    defaultSettings: {
      display_title: true,
      section_title: "Shop by Category",
      section_title_color: "#111827",
      display_subtitle: false,
      section_subtitle: "Explore products from your favorites",
      section_subtitle_color: "#1f2937",
      categories_to_show: "ALL",
      custom_category_list: [],
      image_size: 2,
      image_radius: "none",
      automatic_image_background_color: true,
      image_custom_background_color: "#ffffff",
      category_image_inner_padding: "0rem",
      image_border: false,
      image_border_size: "2px",
      image_border_color: "#111827",
      section_background_color: "#ffffff",
      category_display_order: "DEFAULT",
      category_name_font_size: "text-sm",
      category_name_top_margin: "0rem",
      category_name_color: "#4b5563",
      display_view_all_button: true,
      section_top_margin: "0rem",
      section_bottom_margin: "1.5rem",
      categories_page_style: "vertical",
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      fields: [
        { path: "display_title", type: "boolean", label: "Show Title" },
        {
          path: "section_title",
          type: "text",
          label: "Title",
          showIf: { display_title: true },
        },
        {
          path: "section_title_color",
          type: "color",
          label: "Title Color",
          showIf: { display_title: true },
        },
        {
          path: "image_size",
          type: "range",
          label: "Image Size",
          min: 1,
          max: 5,
          step: 1,
        },
        {
          path: "image_radius",
          type: "select",
          label: "Image Radius",
          options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
        },
        {
          path: "category_name_font_size",
          type: "select",
          label: "Name Size",
          options: ["text-xs", "text-sm", "text-base"],
        },
        { path: "category_name_color", type: "color", label: "Name Color" },
        {
          path: "section_background_color",
          type: "color",
          label: "Section Background",
        },
        {
          path: "display_view_all_button",
          type: "boolean",
          label: "Show View All",
        },
        { path: "section_top_margin", type: "spacing", label: "Top Margin" },
        {
          path: "section_bottom_margin",
          type: "spacing",
          label: "Bottom Margin",
        },
      ],
    },
  },
  {
    name: "Showcase Products",
    code: "products_display",
    defaultSettings: {
      product_layout_type: "3",
      section_background_color: "#ffffff",
      display_title: true,
      title: "Picks for you",
      title_color: "#111827",
      display_subtitle: true,
      subtitle: "Discover your next favorite ❤️",
      subtitle_color: "#1f2937",
      products_to_show: "CATEGORIZED",
      custom_product_list: [],
      custom_category_list: [1],
      max_products: 12,
      product_display_order: "ALPHABETICAL",
      display_view_all_button: true,
      image_slideshow: true,
      animation_style: "FADE",
      slideshow_delay: 2000,
      section_top_margin: "0rem",
      section_bottom_margin: "1.5rem",
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Header",
          fields: [
            { path: "display_title", type: "boolean", label: "Show Title" },
            {
              path: "title",
              type: "text",
              label: "Title",
              showIf: { display_title: true },
            },
            {
              path: "title_color",
              type: "color",
              label: "Title Color",
              showIf: { display_title: true },
            },
            {
              path: "display_subtitle",
              type: "boolean",
              label: "Show Subtitle",
            },
            {
              path: "subtitle",
              type: "text",
              label: "Subtitle",
              showIf: { display_subtitle: true },
            },
            {
              path: "subtitle_color",
              type: "color",
              label: "Subtitle Color",
              showIf: { display_subtitle: true },
            },
          ],
        },
        {
          label: "Products",
          fields: [
            {
              path: "products_to_show",
              type: "select",
              label: "Source",
              options: ["ALL", "CATEGORIZED", "CUSTOM"],
            },
            {
              path: "custom_product_list",
              type: "idList",
              label: "Custom Products",
              showIf: { products_to_show: "CUSTOM" },
            },
            {
              path: "custom_category_list",
              type: "idList",
              label: "Categories",
              showIf: { products_to_show: "CATEGORIZED" },
            },
            {
              path: "max_products",
              type: "number",
              label: "Max Products",
              min: 1,
              max: 50,
            },
            {
              path: "product_display_order",
              type: "select",
              label: "Order",
              options: ["ALPHABETICAL", "NEWEST", "POPULAR"],
            },
          ],
        },
        {
          label: "Carousel",
          fields: [
            {
              path: "image_slideshow",
              type: "boolean",
              label: "Enable Carousel",
            },
            {
              path: "animation_style",
              type: "select",
              label: "Animation",
              options: ["SLIDE", "FADE"],
              showIf: { image_slideshow: true },
            },
            {
              path: "slideshow_delay",
              type: "number",
              label: "Delay (ms)",
              min: 1000,
              step: 500,
              showIf: { image_slideshow: true },
            },
          ],
        },
        {
          label: "Section",
          fields: [
            {
              path: "section_background_color",
              type: "color",
              label: "Background",
            },
            {
              path: "display_view_all_button",
              type: "boolean",
              label: "Show View All",
            },
            {
              path: "section_top_margin",
              type: "spacing",
              label: "Top Margin",
            },
            {
              path: "section_bottom_margin",
              type: "spacing",
              label: "Bottom Margin",
            },
          ],
        },
      ],
    },
  },
  {
    name: "Products Strip",
    code: "product_horizontal_strip",
    defaultSettings: {
      section_background_color: "#ffffff",
      display_title: true,
      section_title: "Shop by Category",
      section_title_color: "#111827",
      display_subtitle: false,
      section_subtitle: "Explore products from your favorites",
      section_subtitle_color: "#1f2937",
      products_to_show: "CATEGORIZED",
      custom_product_list: [],
      custom_category_list: [1],
      max_products: 12,
      product_display_order: "ALPHABETICAL",
      display_view_all_button: true,
      image_slideshow: true,
      animation_style: "FADE",
      slideshow_delay: 2000,
      section_top_margin: "0rem",
      section_bottom_margin: "1.5rem",
      hero_image: "",
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Header",
          fields: [
            { path: "display_title", type: "boolean", label: "Show Title" },
            {
              path: "section_title",
              type: "text",
              label: "Title",
              showIf: { display_title: true },
            },
            {
              path: "section_title_color",
              type: "color",
              label: "Title Color",
              showIf: { display_title: true },
            },
          ],
        },
        {
          label: "Products",
          fields: [
            {
              path: "products_to_show",
              type: "select",
              label: "Source",
              options: ["ALL", "CATEGORIZED", "CUSTOM"],
            },
            {
              path: "custom_product_list",
              type: "idList",
              label: "Custom Products",
              showIf: { products_to_show: "CUSTOM" },
            },
            {
              path: "custom_category_list",
              type: "idList",
              label: "Categories",
              showIf: { products_to_show: "CATEGORIZED" },
            },
            {
              path: "max_products",
              type: "number",
              label: "Max Products",
              min: 1,
              max: 50,
            },
            {
              path: "product_display_order",
              type: "select",
              label: "Order",
              options: ["ALPHABETICAL", "NEWEST", "POPULAR"],
            },
          ],
        },
        {
          label: "Hero",
          fields: [{ path: "hero_image", type: "image", label: "Hero Image" }],
        },
        {
          label: "Carousel",
          fields: [
            {
              path: "image_slideshow",
              type: "boolean",
              label: "Enable Carousel",
            },
            {
              path: "animation_style",
              type: "select",
              label: "Animation",
              options: ["SLIDE", "FADE"],
              showIf: { image_slideshow: true },
            },
            {
              path: "slideshow_delay",
              type: "number",
              label: "Delay (ms)",
              min: 1000,
              step: 500,
              showIf: { image_slideshow: true },
            },
          ],
        },
        {
          label: "Section",
          fields: [
            {
              path: "section_background_color",
              type: "color",
              label: "Background",
            },
            {
              path: "display_view_all_button",
              type: "boolean",
              label: "Show View All",
            },
            {
              path: "section_top_margin",
              type: "spacing",
              label: "Top Margin",
            },
            {
              path: "section_bottom_margin",
              type: "spacing",
              label: "Bottom Margin",
            },
          ],
        },
      ],
    },
  },
  {
    name: "Products Infinite Scroll",
    code: "products_infinite_scroll",
    defaultSettings: {
      // LAYOUT
      product_layout_type: "CARD", // CARD | LIST | COMPACT
      // CARD LOOK & FEEL
      card_style: "ELEVATED", // MINIMAL | ELEVATED | OUTLINE | GLASS | BORDERLESS
      card_radius: "lg", // none | sm | md | lg | xl | 2xl | full
      card_shadow: "none", // none | sm | md | lg
      hover_effect: "lift", // none | lift | glow
      // MEDIA
      image_aspect: "4/3", // 4/3 | 1/1 | 3/4 | 16/9
      image_hover: "zoom", // none | zoom
      media_radius_sync: true,
      // BADGES
      badge_mode: "NONE", // NONE | NEW | POPULAR | BOTH
      popular_threshold: 60,
      // TEXT
      section_background_color: "#ffffff",
      display_title: true,
      title: "Explore all",
      title_color: "#111827",
      display_subtitle: true,
      subtitle: "Discover our full collection, just for you.",
      subtitle_color: "#1f2937",
      // PRODUCTS
      product_display_order: "ALPHABETICAL",
      load_more_text: "Show More Products",
      // ACTIONS
      show_add_to_cart: true,
      add_to_cart_text: "Add to cart",
      show_buy_now: true,
      buy_now_text: "Buy now",
      actions_layout: "inline", // inline | stacked
      actions_variant: "outline", // outline | subtle | ghost | primary
      actions_variant_primary: "primary", // primary variant for buy-now
      actions_size: "sm", // xs | sm | md
      actions_shape: "rounded", // rounded | pill
      // MISC
      section_top_margin: "0rem",
      section_bottom_margin: "1.5rem",
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Choose style",
          fields: [
            {
              path: "product_layout_type",
              type: "select",
              label: "Layout",
              options: ["CARD", "LIST", "COMPACT"],
            },
            {
              path: "card_style",
              type: "select",
              label: "Card style",
              options: [
                "MINIMAL",
                "ELEVATED",
                "OUTLINE",
                "GLASS",
                "BORDERLESS",
              ],
            },
            {
              path: "card_radius",
              type: "select",
              label: "Corner radius",
              options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
            },
            {
              path: "card_shadow",
              type: "select",
              label: "Shadow",
              options: ["none", "sm", "md", "lg"],
            },
            {
              path: "hover_effect",
              type: "select",
              label: "Hover effect",
              options: ["none", "lift", "glow"],
            },
          ],
        },
        {
          label: "Image & media",
          fields: [
            {
              path: "image_aspect",
              type: "select",
              label: "Aspect ratio",
              options: ["4/3", "1/1", "3/4", "16/9"],
            },
            {
              path: "image_hover",
              type: "select",
              label: "Image hover",
              options: ["none", "zoom"],
            },
            {
              path: "media_radius_sync",
              type: "boolean",
              label: "Sync media radius with card",
            },
          ],
        },
        {
          label: "Appearance",
          fields: [
            {
              path: "section_background_color",
              type: "color",
              label: "Section background",
            },
          ],
        },
        {
          label: "Text settings",
          fields: [
            { path: "display_title", type: "boolean", label: "Title display" },
            {
              path: "title",
              type: "text",
              label: "Title",
              showIf: { display_title: true },
            },
            {
              path: "title_color",
              type: "color",
              label: "Title color",
              showIf: { display_title: true },
            },
            {
              path: "display_subtitle",
              type: "boolean",
              label: "Subtitle display",
            },
            {
              path: "subtitle",
              type: "text",
              label: "Subtitle",
              showIf: { display_subtitle: true },
            },
            {
              path: "subtitle_color",
              type: "color",
              label: "Subtitle color",
              showIf: { display_subtitle: true },
            },
          ],
        },
        {
          label: "Products",
          fields: [
            {
              path: "product_display_order",
              type: "select",
              label: "Order",
              options: ["ALPHABETICAL", "NEWEST", "POPULAR"],
            },
            { path: "load_more_text", type: "text", label: "Load more text" },
          ],
        },
        {
          label: "Badges",
          fields: [
            {
              path: "badge_mode",
              type: "select",
              label: "Show badges",
              options: ["NONE", "NEW", "POPULAR", "BOTH"],
            },
            {
              path: "popular_threshold",
              type: "number",
              label: "Popular if score >=",
              min: 0,
              max: 100,
              step: 5,
              showIf: { badge_mode: ["POPULAR", "BOTH"] },
            },
          ],
        },
        {
          label: "Actions",
          fields: [
            {
              path: "show_add_to_cart",
              type: "boolean",
              label: "Show “Add to cart”",
            },
            {
              path: "add_to_cart_text",
              type: "text",
              label: "Add to cart text",
              showIf: { show_add_to_cart: true },
            },
            { path: "show_buy_now", type: "boolean", label: "Show “Buy now”" },
            {
              path: "buy_now_text",
              type: "text",
              label: "Buy now text",
              showIf: { show_buy_now: true },
            },
            {
              path: "actions_layout",
              type: "select",
              label: "Buttons layout",
              options: ["inline", "stacked"],
            },
            {
              path: "actions_variant",
              type: "select",
              label: "Secondary variant",
              options: ["outline", "subtle", "ghost", "primary"],
            },
            {
              path: "actions_variant_primary",
              type: "select",
              label: "Primary variant",
              options: ["primary", "outline", "subtle", "ghost"],
            },
            {
              path: "actions_size",
              type: "select",
              label: "Buttons size",
              options: ["xs", "sm", "md"],
            },
            {
              path: "actions_shape",
              type: "select",
              label: "Buttons shape",
              options: ["rounded", "pill"],
            },
          ],
        },
        {
          label: "Advanced",
          fields: [
            {
              path: "section_top_margin",
              type: "spacing",
              label: "Top margin",
            },
            {
              path: "section_bottom_margin",
              type: "spacing",
              label: "Bottom margin",
            },
            { path: "custom_css", type: "textarea", label: "Add custom css" },
            {
              path: "visibility",
              type: "select",
              label: "Visibility",
              options: ["all", "desktop", "mobile"],
            },
          ],
        },
      ],
    },
  },
  {
    name: "Centered Image Slide",
    code: "slider_centered",
    defaultSettings: {
      images: [],
      animation_style: "SLIDE",
      slideshow_delay: 3000,
      show_dots: true,
      section_background_color: "#ffffff",
      section_shadow: "drop-shadow-none",
      display_title: true,
      section_title: "Featured products",
      section_title_color: "#111827",
      display_subtitle: true,
      section_subtitle: "Explore the featured products in our collection",
      section_subtitle_color: "#1f2937",
      text_align: "center",
      images_shadow: "drop-shadow-none",
      image_radius: "md",
      section_top_margin: "1.5rem",
      section_bottom_margin: "1.5rem",
      section_top_inner_padding: "1.5rem",
      section_bottom_inner_padding: "1.5rem",
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      fields: [
        {
          path: "images",
          type: "imageList",
          label: "Slides",
          itemLabel: "Image",
          withLink: true,
        },
        {
          path: "animation_style",
          type: "select",
          label: "Animation",
          options: ["SLIDE", "FADE"],
        },
        {
          path: "slideshow_delay",
          type: "number",
          label: "Delay (ms)",
          min: 1000,
          step: 500,
        },
        { path: "show_dots", type: "boolean", label: "Show Dots" },
        { path: "section_title", type: "text", label: "Title" },
        { path: "section_title_color", type: "color", label: "Title Color" },
        { path: "section_subtitle", type: "text", label: "Subtitle" },
        {
          path: "section_subtitle_color",
          type: "color",
          label: "Subtitle Color",
        },
        {
          path: "text_align",
          type: "select",
          label: "Text Align",
          options: ["left", "center", "right"],
        },
        {
          path: "image_radius",
          type: "select",
          label: "Image Radius",
          options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
        },
      ],
    },
  },
  {
    name: "Banner",
    code: "static_banner",
    defaultSettings: {
      banner_style: "2",
      section_background_color: "#ffffff",
      section_display_type: "mx-0",
      section_shadow: "drop-shadow-none",
      display_title: true,
      title: "Fresh Fruits & Vegetables",
      title_color: "#111827",
      title_size: "text-lg",
      title_has_background: false,
      title_backgound_color: "#111827",
      title_padding: "0.25rem",
      display_subtitle: true,
      subtitle: "Get handpicked fresh fruits and vegetables",
      subtitle_color: "#374151",
      subtitle_size: "text-sm",
      subtitle_has_background: false,
      subtitle_backgound_color: "#111827",
      subtitle_padding: "0.25rem",
      subtitle_top_margin: "0rem",
      display_button: true,
      button: "Get Now",
      button_color: "#ffffff",
      button_background_color: "#111827",
      button_width: "w-full",
      button_radius: "md",
      button_shine_animation: true,
      button_padding: "0.75rem",
      button_top_margin: "0.75rem",
      display_image: false,
      image: "",
      image_size: "32",
      image_radius: "xl",
      image_has_background: false,
      image_custom_background_color: "#ffffff",
      image_background_color_transparancy: "20%",
      image_animation: "custom-floating",
      link_to: "NO_LINK",
      product_id: "",
      category_id: "",
      custom_url: "",
      section_top_margin: "0rem",
      section_bottom_margin: "1.5rem",
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Text",
          fields: [
            { path: "display_title", type: "boolean", label: "Show Title" },
            {
              path: "title",
              type: "text",
              label: "Title",
              showIf: { display_title: true },
            },
            {
              path: "title_color",
              type: "color",
              label: "Title Color",
              showIf: { display_title: true },
            },
            {
              path: "title_size",
              type: "select",
              label: "Title Size",
              options: [
                "text-sm",
                "text-base",
                "text-lg",
                "text-xl",
                "text-2xl",
              ],
            },
            {
              path: "display_subtitle",
              type: "boolean",
              label: "Show Subtitle",
            },
            {
              path: "subtitle",
              type: "text",
              label: "Subtitle",
              showIf: { display_subtitle: true },
            },
            {
              path: "subtitle_color",
              type: "color",
              label: "Subtitle Color",
              showIf: { display_subtitle: true },
            },
            {
              path: "subtitle_size",
              type: "select",
              label: "Subtitle Size",
              options: ["text-xs", "text-sm", "text-base"],
            },
          ],
        },
        {
          label: "Button",
          fields: [
            { path: "display_button", type: "boolean", label: "Show Button" },
            {
              path: "button",
              type: "text",
              label: "Button Text",
              showIf: { display_button: true },
            },
            {
              path: "button_background_color",
              type: "color",
              label: "Button BG",
              showIf: { display_button: true },
            },
            {
              path: "button_color",
              type: "color",
              label: "Button Text Color",
              showIf: { display_button: true },
            },
            {
              path: "button_radius",
              type: "select",
              label: "Button Radius",
              options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
              showIf: { display_button: true },
            },
            {
              path: "button_width",
              type: "select",
              label: "Button Width",
              options: ["w-auto", "w-full"],
              showIf: { display_button: true },
            },
          ],
        },
        {
          label: "Image",
          fields: [
            { path: "display_image", type: "boolean", label: "Show Image" },
            {
              path: "image",
              type: "image",
              label: "Image",
              showIf: { display_image: true },
            },
            {
              path: "image_radius",
              type: "select",
              label: "Image Radius",
              options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
              showIf: { display_image: true },
            },
          ],
        },
        {
          label: "Section",
          fields: [
            {
              path: "section_background_color",
              type: "color",
              label: "Background",
            },
            {
              path: "section_shadow",
              type: "select",
              label: "Shadow",
              options: [
                "drop-shadow-none",
                "drop-shadow-sm",
                "drop-shadow",
                "drop-shadow-lg",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: "Custom Design",
    code: "custom_html_block",
    defaultSettings: {
      html: "",
      css: "",
      generate_css: true,
      visibility: "all",
    },
    settingsSchema: {
      fields: [
        { path: "html", type: "code", label: "HTML", language: "html" },
        { path: "css", type: "code", label: "CSS", language: "css" },
        { path: "generate_css", type: "boolean", label: "Generate Scoped CSS" },
      ],
    },
  },
  {
    name: "Header",
    code: "top_nav",
    defaultSettings: {
      background_color: "#ffffff",
      text_color: "#111827",
      border: true,
      logo_placement: "left",
      logo_type: "default",
      logo_url: "",
      left_button: "MENU",
      right_button: "SEARCH",
      menu_items: [],
      display_categories_on_menu: true,
      sticky_header: true,
      custom_css: null,
      desktop_search_bar_background_color: "#e2e8f0",
      desktop_search_bar_placeholder_text: "Search for products",
      desktop_search_bar_placeholder_text_color: "#6b7280",
      desktop_search_bar_display_search_icon: true,
      desktop_search_bar_search_icon_color: "#6b7280",
      desktop_search_bar_border: false,
      desktop_search_bar_border_size: "1px",
      desktop_search_bar_border_color: "#111827",
      desktop_search_bar_radius: "md",
      visibility: "all",
    },
    // in seed.ts, when creating/upserting the catalog row for code: "top_nav"
    settingsSchema: {
      groups: [
        {
          label: "Appearance",
          fields: [
            {
              path: "background_color",
              type: "color",
              label: "Background color",
            },
            { path: "text_color", type: "color", label: "Icon & label color" },

            {
              path: "logo_placement",
              type: "select",
              label: "Logo placement",
              options: ["left", "center"],
            },

            // map your existing logo types: default→Colored, white→White, none→No Logo, custom→Custom
            {
              path: "logo_type",
              type: "select",
              label: "Logo type",
              options: ["default", "white", "none", "custom"],
            },

            { path: "border", type: "boolean", label: "Bottom border" },
            { path: "sticky_header", type: "boolean", label: "Sticky header" },
          ],
        },

        {
          label: "Button settings",
          fields: [
            // expand choices to match your screenshot
            {
              path: "left_button",
              type: "select",
              label: "Left button",
              options: ["NONE", "BRANCH", "SEARCH", "ACCOUNT", "CART", "MENU"],
            },
            {
              path: "right_button",
              type: "select",
              label: "Right button",
              options: ["NONE", "BRANCH", "SEARCH", "ACCOUNT", "CART", "MENU"],
            },
          ],
        },

        {
          label: "Menu settings",
          fields: [
            {
              path: "display_categories_on_menu",
              type: "boolean",
              label: "Show categories in menu",
            },
            // new: array of {label, href} objects
            { path: "menu_items", type: "linkList", label: "Custom links" },
          ],
        },

        {
          label: "Desktop mode search bar",
          fields: [
            {
              path: "desktop_search_bar_background_color",
              type: "color",
              label: "Search bar background color",
            },
            {
              path: "desktop_search_bar_placeholder_text",
              type: "text",
              label: "Search bar placeholder text",
            },
            {
              path: "desktop_search_bar_placeholder_text_color",
              type: "color",
              label: "Search bar placeholder color",
            },

            {
              path: "desktop_search_bar_display_search_icon",
              type: "boolean",
              label: "Search icon display",
            },
            {
              path: "desktop_search_bar_search_icon_color",
              type: "color",
              label: "Search icon color",
              showIf: { desktop_search_bar_display_search_icon: true },
            },

            {
              path: "desktop_search_bar_border",
              type: "boolean",
              label: "Search bar border",
            },
            {
              path: "desktop_search_bar_border_size",
              type: "select",
              label: "Search bar border size",
              options: ["0px", "1px", "2px", "3px", "4px", "6px"],
              showIf: { desktop_search_bar_border: true },
            },
            {
              path: "desktop_search_bar_border_color",
              type: "color",
              label: "Search bar border color",
              showIf: { desktop_search_bar_border: true },
            },

            // map nicely to Tailwind radii
            {
              path: "desktop_search_bar_radius",
              type: "select",
              label: "Search bar curve style",
              options: ["none", "sm", "md", "lg", "xl", "full"],
            },
          ],
        },

        {
          label: "Custom CSS",
          fields: [
            {
              path: "custom_css",
              type: "textarea",
              label: "Your custom CSS code",
            },
          ],
        },

        {
          label: "Visibility",
          fields: [
            {
              path: "visibility",
              type: "select",
              label: "Visibility",
              options: ["all", "desktop", "mobile"],
            },
          ],
        },
      ],
    },
  },
  {
    name: "Footer",
    code: "bottom_nav",
    defaultSettings: {
      // Mobile (sticky) nav
      footer_type: "blur_float", // blur_float | blur_bottom | solid
      footer_background_color: "#ffffff",
      footer_text_color: "#4b5563",
      footer_text_active_color: "#030712",
      show_discount_banner: false,
      selected_discount_id: null,

      // Icons (Remix)
      home_icon: "ri-home-5-line",
      search_icon: "ri-search-line",
      cart_icon: "ri-shopping-cart-line",
      account_icon: "ri-user-line",

      // Desktop footer WITH LINKS (panel)
      show_desktop_footer: true,
      show_desktop_footer_in_mobile_too: false,
      desktop_footer_background_color: "#f3f4f6",
      desktop_footer_title_color: "#111827",
      desktop_footer_text_color: "#6b7280",
      desktop_footer_link_color: "#111827",
      desktop_footer_about_us_title: "About Us",
      desktop_footer_about_us_content:
        "Welcome to our store! We're here to bring you quality products and services with convenience, care, and trust.",
      desktop_footer_links_title: "Links",
      desktop_footer_links: [], // [{label:'Contact', href:'/contact'}]

      // Optional
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Mobile Footer",
          fields: [
            {
              path: "footer_type",
              type: "select",
              label: "Footer style",
              options: ["blur_float", "blur_bottom", "solid"],
            },
            {
              path: "footer_background_color",
              type: "color",
              label: "Background color",
            },
            {
              path: "footer_text_color",
              type: "color",
              label: "Icon & label color",
            },
            {
              path: "footer_text_active_color",
              type: "color",
              label: "Icon & label active color",
            },
            {
              path: "show_discount_banner",
              type: "boolean",
              label: "Show Discount Banner",
            },
          ],
        },

        {
          label: "Icons",
          fields: [
            { path: "home_icon", type: "text", label: "Home icon" },
            { path: "search_icon", type: "text", label: "Search icon" },
            { path: "cart_icon", type: "text", label: "Cart icon" },
            { path: "account_icon", type: "text", label: "Account icon" },
          ],
        },

        {
          label: "Desktop Footer with Links",
          fields: [
            {
              path: "show_desktop_footer",
              type: "boolean",
              label: "Show desktop footer",
            },
            {
              path: "show_desktop_footer_in_mobile_too",
              type: "boolean",
              label: "Show desktop footer in mobile",
              showIf: { show_desktop_footer: true },
            },
            {
              path: "desktop_footer_background_color",
              type: "color",
              label: "Background color",
              showIf: { show_desktop_footer: true },
            },
            {
              path: "desktop_footer_title_color",
              type: "color",
              label: "Title color",
              showIf: { show_desktop_footer: true },
            },
            {
              path: "desktop_footer_text_color",
              type: "color",
              label: "Text color",
              showIf: { show_desktop_footer: true },
            },
            {
              path: "desktop_footer_link_color",
              type: "color",
              label: "Link color",
              showIf: { show_desktop_footer: true },
            },
            {
              path: "desktop_footer_about_us_title",
              type: "text",
              label: "About us title",
              showIf: { show_desktop_footer: true },
            },
            {
              path: "desktop_footer_about_us_content",
              type: "textarea",
              label: "About us content",
              showIf: { show_desktop_footer: true },
            },
            {
              path: "desktop_footer_links_title",
              type: "text",
              label: "Links title",
              showIf: { show_desktop_footer: true },
            },
            {
              path: "desktop_footer_links",
              type: "linkList",
              label: "Custom links",
              showIf: { show_desktop_footer: true },
            },
          ],
        },

        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Add custom css" },
            {
              path: "visibility",
              type: "select",
              label: "Visibility",
              options: ["all", "desktop", "mobile"],
            },
          ],
        },
      ],
    },
  },
];

async function main() {
  // Branch
  const branch = await prisma.branch.upsert({
    where: { id: 1 },
    create: { id: 1, name: "Ahmadabad", isMain: true },
    update: {},
  });

  // Settings (short list – extend as you like)
  const settings = [
    ["storeName", "My Online Store"],
    ["storeUrl", "https://techcronet.zepio.io"],
    ["currencyCode", "INR"],
    ["currencySymbol", "₹"],
    ["locale", "en-IN"],
    ["logo", "https://cdn.zepio.io/techcronet/site-data/logo.webp"],
  ];
  for (const [key, value] of settings) {
    await prisma.storeSetting.upsert({
      where: { branchId_key: { branchId: branch.id, key } },
      create: { branchId: branch.id, key, value },
      update: { value },
    });
  }

  // Catalog
  for (const c of catalog) {
    // Normalize settingsSchema for Prisma
    // - undefined  -> don't send the key at all
    // - null       -> set DB NULL (column becomes NULL)
    // - object     -> send as JSON value
    const normalizedSettingsSchema:
      | Prisma.InputJsonValue
      | typeof Prisma.DbNull
      | undefined =
      typeof c.settingsSchema === "undefined"
        ? undefined
        : c.settingsSchema === null
        ? Prisma.DbNull
        : (c.settingsSchema as Prisma.InputJsonValue);

    await prisma.designElementCatalog.upsert({
      where: { code: c.code },
      update: {
        name: c.name,
        defaultSettings: c.defaultSettings as Prisma.InputJsonValue,
        ...(normalizedSettingsSchema !== undefined
          ? { settingsSchema: normalizedSettingsSchema }
          : {}), // only include when defined
      },
      create: {
        name: c.name,
        code: c.code,
        defaultSettings: c.defaultSettings as Prisma.InputJsonValue,
        ...(normalizedSettingsSchema !== undefined
          ? { settingsSchema: normalizedSettingsSchema }
          : {}),
      },
    });
  }

  // Theme 1: Default (current)
  const defaultTheme = await prisma.theme.create({
    data: {
      branchId: branch.id,
      name: "Default",
      shortDesc: "Default theme",
      author: "Zepio",
      version: "1.0.0",
      image: "/assets/admin/images/placeholders/theme_placeholder.webp",
      isCurrent: true,
    },
  });

  // Add three default blocks to Default theme (Header, Footer, Infinite Scroll)
  const topNav = await prisma.designElementCatalog.findUnique({
    where: { code: "top_nav" },
  });
  const bottomNav = await prisma.designElementCatalog.findUnique({
    where: { code: "bottom_nav" },
  });
  const infinite = await prisma.designElementCatalog.findUnique({
    where: { code: "products_infinite_scroll" },
  });

  if (topNav && bottomNav && infinite) {
    await prisma.themeDesignElement.createMany({
      data: [
        {
          themeId: defaultTheme.id,
          designElementId: topNav.id,
          name: "Header",
          code: "top_nav",
          position: 6,
          settings:
            topNav.defaultSettings as import("@prisma/client").Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: bottomNav.id,
          name: "Footer",
          code: "bottom_nav",
          position: 8,
          settings:
            bottomNav.defaultSettings as import("@prisma/client").Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: infinite.id,
          name: "Products Infinite Scroll",
          code: "products_infinite_scroll",
          position: 9,
          settings: {
            ...(typeof infinite.defaultSettings === "object" &&
            infinite.defaultSettings !== null
              ? infinite.defaultSettings
              : {}),
            title: "Explore all",
            subtitle: "Discover our full collection, just for you.",
          },
        },
      ],
    });
  }

  // Theme 2: Volt (not current)
  const volt = await prisma.theme.create({
    data: {
      branchId: branch.id,
      name: "Volt",
      shortDesc: "For gadgets and electronics stores",
      author: "Zepio",
      version: "1.0.0",
      image: "https://cdn.zepio.io/website/images/themes/zepio-volt.webp",
      isCurrent: false,
    },
  });

  // Volt sample blocks (custom_html_block + etc.)
  const custom = await prisma.designElementCatalog.findUnique({
    where: { code: "custom_html_block" },
  });
  const categoriesGrid = await prisma.designElementCatalog.findUnique({
    where: { code: "categories_grid" },
  });
  const productStrip = await prisma.designElementCatalog.findUnique({
    where: { code: "product_horizontal_strip" },
  });

  if (custom && categoriesGrid && productStrip && topNav && bottomNav) {
    await prisma.themeDesignElement.createMany({
      data: [
        {
          themeId: volt.id,
          designElementId: custom.id,
          name: "Custom Design",
          customName: "New Launch banner",
          code: "custom_html_block",
          position: 2,
          settings: {
            html: `<div class="mx-4 sm:mx-0 mt-4 sm:mt-8">
  <picture>
    <source srcset="https://foodomaa.sgp1.cdn.digitaloceanspaces.com/demo_electronics/other/9f43321f-9576-4f42-a885-335d44e5711e.gif" media="(min-width: 576px)">
    <img src="https://foodomaa.sgp1.cdn.digitaloceanspaces.com/demo_electronics/other/b5ad3228-10d7-4c3b-8a47-b9f32ce94e21.gif" class="rounded-lg">
  </picture>
</div>`,
            css: `#custom_html_block_129 .rounded-lg{border-radius:0.5rem}`,
            generate_css: true,
            visibility: "all",
          },
        },
        {
          themeId: volt.id,
          designElementId: categoriesGrid.id,
          name: "Categories Grid",
          code: "categories_grid",
          position: 4,
          settings: {
            ...(typeof categoriesGrid.defaultSettings === "object" &&
            categoriesGrid.defaultSettings !== null
              ? categoriesGrid.defaultSettings
              : {}),
            display_title: false,
            image_radius: "lg",
            category_name_font_size: "text-xs",
            section_top_margin: "0rem",
            section_bottom_margin: "0rem",
          },
        },
        {
          themeId: volt.id,
          designElementId: custom.id,
          name: "Custom Design",
          customName: "New headphones",
          code: "custom_html_block",
          position: 5,
          settings: {
            html: `<div class="flex space-x-4 px-4 pb-6 sm:grid sm:mx-auto sm:max-w-7xl sm:grid-cols-4 sm:gap-y-6 sm:gap-x-8">
  <img src="https://foodomaa.sgp1.cdn.digitaloceanspaces.com/demo_electronics/other/688ed9ca-16ec-4003-82ed-e94bbcd92a41.png" class="w-1/2 h-auto sm:w-full object-cover rounded-lg">
  <img src="https://foodomaa.sgp1.cdn.digitaloceanspaces.com/demo_electronics/other/875c0b89-706f-4b4d-840e-381e97df1351.png" class="w-1/2 h-auto sm:w-full object-cover rounded-lg">
  <img src="https://foodomaa.sgp1.cdn.digitaloceanspaces.com/demo_electronics/other/08cc668e-dc69-4dcb-ba80-362ee49e5b84.png" class="w-1/2 h-auto sm:w-full object-cover rounded-lg">
  <img src="https://foodomaa.sgp1.cdn.digitaloceanspaces.com/demo_electronics/other/0f96dd56-8748-4bb7-8ca2-23d9776e60b4.png" class="w-1/2 h-auto sm:w-full object-cover rounded-lg">
</div>`,
            css: `#custom_html_block_132 .rounded-lg{border-radius:0.5rem}`,
            generate_css: true,
            visibility: "all",
          },
        },
        {
          themeId: volt.id,
          designElementId: productStrip.id,
          name: "Products Strip",
          code: "product_horizontal_strip",
          position: 8,
          settings: {
            ...(typeof productStrip.defaultSettings === "object" &&
            productStrip.defaultSettings !== null
              ? productStrip.defaultSettings
              : {}),
            section_title: "Best deals, going out soon 🚀",
            custom_category_list: [1, 6, 4, 10],
            hero_image:
              "https://foodomaa.sgp1.cdn.digitaloceanspaces.com/fourth/product_horizontal_strip/54f6f64c-e879-4069-9291-408b57c8730d.gif",
          },
        },
        {
          themeId: volt.id,
          designElementId: topNav.id,
          name: "Header",
          customName: "Header",
          code: "top_nav",
          position: 9,
          settings: {
            ...(typeof topNav.defaultSettings === "object" &&
            topNav.defaultSettings !== null
              ? topNav.defaultSettings
              : {}),
            background_color: "rgb(255, 255, 255)",
            text_color: "rgb(15,23,42)",
            left_button: "NONE",
            right_button: "CART",
            border: false,
          },
        },
        {
          themeId: volt.id,
          designElementId: bottomNav.id,
          name: "Footer",
          customName: "Footer",
          code: "bottom_nav",
          position: 10,
          settings: {
            ...(typeof bottomNav.defaultSettings === "object" &&
            bottomNav.defaultSettings !== null
              ? bottomNav.defaultSettings
              : {}),
            footer_type: "blur_bottom",
            footer_background_color: "rgb(30,41,59)",
            footer_text_color: "rgb(248,250,252)",
            footer_text_active_color: "rgb(255,255,255)",
          },
          isActive: false,
        },
      ],
    });
  }

  // --- (2) Seed 6 demo products ---------------------------------------------
  const demoProducts = [
    {
      name: "Wireless Headphones Z1",
      slug: "wireless-headphones-z1",
      price: 499900,
      popularity: 50,
      images: [
        "https://images.unsplash.com/photo-1518443895914-7bdc83ed5ebb?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518441902113-c1f6d43d3297?q=80&w=900&auto=format&fit=crop",
      ],
    },
    {
      name: "Smartwatch Neo",
      slug: "smartwatch-neo",
      price: 699900,
      popularity: 70,
      images: [
        "https://images.unsplash.com/photo-1516264664731-7e19d01f6b3b?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?q=80&w=900&auto=format&fit=crop",
      ],
    },
    {
      name: "Bluetooth Speaker Mini",
      slug: "bluetooth-speaker-mini",
      price: 259900,
      popularity: 65,
      images: [
        "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490376840453-5f616fbebe5b?q=80&w=900&auto=format&fit=crop",
      ],
    },
    {
      name: "4K Action Camera Pro",
      slug: "action-cam-pro-4k",
      price: 1299900,
      popularity: 80,
      images: [
        "https://images.unsplash.com/photo-1526178615232-43418984e93b?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1549921296-3ecf0f3d5a49?q=80&w=900&auto=format&fit=crop",
      ],
    },
    {
      name: "Mechanical Keyboard 87",
      slug: "mech-keyboard-87",
      price: 749900,
      popularity: 55,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=900&auto=format&fit=crop",
      ],
    },
    {
      name: "USB-C Hub 7-in-1",
      slug: "usb-c-hub-7in1",
      price: 199900,
      popularity: 40,
      images: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=900&auto=format&fit=crop",
      ],
    },
  ];

  for (const p of demoProducts) {
    const up = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        price: p.price,
        popularity: p.popularity,
        isActive: true,
      },
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        popularity: p.popularity,
        currency: "INR",
        isActive: true,
      },
    });

    // replace images each run
    await prisma.productImage.deleteMany({ where: { productId: up.id } });
    await prisma.productImage.createMany({
      data: p.images.map((url, i) => ({
        productId: up.id,
        url,
        position: i,
      })),
    });
  }

  console.log("Seed completed.");
}

main().finally(() => prisma.$disconnect());
