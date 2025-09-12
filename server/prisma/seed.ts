// seed.ts

import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const catalog = [
  {
    name: "Announcement Bar",
    code: "announcement_bar",
    defaultSettings: {
      // ON/OFF
      enabled: true,

      // Layout / style (simple, calm defaults)
      align: "center", // left | center | right
      height: "3rem",
      padding_x: "1rem",
      section_background_color: "#ffffff",
      text_color: "#111827",

      // Content
      message: "Your announcement here",

      // Marquee (off by default)
      marquee_enabled: false,
      marquee_speed: 40, // px/s
      marquee_direction: "left", // left | right

      // Left pill/button (off by default)
      left_button_show: false,
      left_button_label: "FREE SHIPPING",
      left_button_href: "",
      left_button_text_color: "#111827",
      left_button_bg_color: "#ffffff",
      left_button_border: true,
      left_button_border_color: "#111827",
      left_button_radius: "full", // none | sm | md | lg | xl | 2xl | full
      left_button_padding_x: "0.75rem",
      left_button_padding_y: "0.25rem",

      // Right CTA (off by default)
      right_button_show: false,
      right_button_label: "Shop Now",
      right_button_href: "/collections/all",
      right_button_text_color: "#ffffff",
      right_button_bg_color: "#111827",
      right_button_radius: "md",
      right_button_padding_x: "0.75rem",
      right_button_padding_y: "0.5rem",

      // Visibility
      visibility: "all",
      // NOTE: removed sticky_top / dismissible / shadow / session key to keep UX clean
      custom_css: null,
    },
    settingsSchema: {
      // super lean, “one-click smart”
      groups: [
        {
          label: "Basics",
          fields: [
            { path: "enabled", type: "boolean", label: "Enabled" },
            { path: "message", type: "text", label: "Center text" },
            {
              path: "align",
              type: "select",
              label: "Alignment",
              options: ["left", "center", "right"],
            },
          ],
        },
        {
          label: "Buttons",
          fields: [
            {
              path: "left_button_show",
              type: "boolean",
              label: "Show left pill",
            },
            {
              path: "left_button_label",
              type: "text",
              label: "Left label",
              showIf: { left_button_show: true },
            },
            {
              path: "left_button_href",
              type: "text",
              label: "Left URL",
              showIf: { left_button_show: true },
            },

            {
              path: "right_button_show",
              type: "boolean",
              label: "Show right button",
            },
            {
              path: "right_button_label",
              type: "text",
              label: "Right label",
              showIf: { right_button_show: true },
            },
            {
              path: "right_button_href",
              type: "text",
              label: "Right URL",
              showIf: { right_button_show: true },
            },
          ],
        },
        {
          label: "Marquee",
          fields: [
            {
              path: "marquee_enabled",
              type: "boolean",
              label: "Enable marquee",
            },
            {
              path: "marquee_speed",
              type: "number",
              label: "Speed (px/s)",
              min: 10,
              max: 200,
              step: 5,
              showIf: { marquee_enabled: true },
            },
            {
              path: "marquee_direction",
              type: "select",
              label: "Direction",
              options: ["left", "right"],
              showIf: { marquee_enabled: true },
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
            { path: "text_color", type: "color", label: "Font color" },
            { path: "height", type: "spacing", label: "Height" },
            { path: "padding_x", type: "spacing", label: "Horizontal padding" },
          ],
        },
        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
  // {
  //   name: "Showcase Products",
  //   code: "products_display",
  //   defaultSettings: {
  //     product_layout_type: "3",
  //     section_background_color: "#ffffff",
  //     display_title: true,
  //     title: "Picks for you",
  //     title_color: "#111827",
  //     display_subtitle: true,
  //     subtitle: "Discover your next favorite ❤️",
  //     subtitle_color: "#1f2937",
  //     products_to_show: "CATEGORIZED",
  //     custom_product_list: [],
  //     custom_category_list: [1],
  //     max_products: 12,
  //     product_display_order: "ALPHABETICAL",
  //     display_view_all_button: true,
  //     image_slideshow: true,
  //     animation_style: "FADE",
  //     slideshow_delay: 2000,
  //     section_top_margin: "0rem",
  //     section_bottom_margin: "1.5rem",
  //     custom_css: null,
  //     visibility: "all",
  //   },
  //   settingsSchema: {
  //     groups: [
  //       {
  //         label: "Header",
  //         fields: [
  //           { path: "display_title", type: "boolean", label: "Show Title" },
  //           {
  //             path: "title",
  //             type: "text",
  //             label: "Title",
  //             showIf: { display_title: true },
  //           },
  //           {
  //             path: "title_color",
  //             type: "color",
  //             label: "Title Color",
  //             showIf: { display_title: true },
  //           },
  //           {
  //             path: "display_subtitle",
  //             type: "boolean",
  //             label: "Show Subtitle",
  //           },
  //           {
  //             path: "subtitle",
  //             type: "text",
  //             label: "Subtitle",
  //             showIf: { display_subtitle: true },
  //           },
  //           {
  //             path: "subtitle_color",
  //             type: "color",
  //             label: "Subtitle Color",
  //             showIf: { display_subtitle: true },
  //           },
  //         ],
  //       },
  //       {
  //         label: "Products",
  //         fields: [
  //           {
  //             path: "products_to_show",
  //             type: "select",
  //             label: "Source",
  //             options: ["ALL", "CATEGORIZED", "CUSTOM"],
  //           },
  //           {
  //             path: "custom_product_list",
  //             type: "idList",
  //             label: "Custom Products",
  //             showIf: { products_to_show: "CUSTOM" },
  //           },
  //           {
  //             path: "custom_category_list",
  //             type: "idList",
  //             label: "Categories",
  //             showIf: { products_to_show: "CATEGORIZED" },
  //           },
  //           {
  //             path: "max_products",
  //             type: "number",
  //             label: "Max Products",
  //             min: 1,
  //             max: 50,
  //           },
  //           {
  //             path: "product_display_order",
  //             type: "select",
  //             label: "Order",
  //             options: ["ALPHABETICAL", "NEWEST", "POPULAR"],
  //           },
  //         ],
  //       },
  //       {
  //         label: "Carousel",
  //         fields: [
  //           {
  //             path: "image_slideshow",
  //             type: "boolean",
  //             label: "Enable Carousel",
  //           },
  //           {
  //             path: "animation_style",
  //             type: "select",
  //             label: "Animation",
  //             options: ["SLIDE", "FADE"],
  //             showIf: { image_slideshow: true },
  //           },
  //           {
  //             path: "slideshow_delay",
  //             type: "number",
  //             label: "Delay (ms)",
  //             min: 1000,
  //             step: 500,
  //             showIf: { image_slideshow: true },
  //           },
  //         ],
  //       },
  //       {
  //         label: "Section",
  //         fields: [
  //           {
  //             path: "section_background_color",
  //             type: "color",
  //             label: "Background",
  //           },
  //           {
  //             path: "display_view_all_button",
  //             type: "boolean",
  //             label: "Show View All",
  //           },
  //           {
  //             path: "section_top_margin",
  //             type: "spacing",
  //             label: "Top Margin",
  //           },
  //           {
  //             path: "section_bottom_margin",
  //             type: "spacing",
  //             label: "Bottom Margin",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // },
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
      product_display_order: "ALPHABETICAL", // ALPHABETICAL | NEWEST | POPULAR
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

      // CATEGORIES (fallback for frontend; used if /categories API is absent)
      // Accepts: [{id:'perfume', name:'Perfume'}, ...] OR ["perfume","makeup"]
      custom_category_list: [],

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
            },
          ],
        },
        {
          label: "Categories (fallback)",
          fields: [
            {
              path: "custom_category_list",
              type: "idList",
              label: "Categories list",
              help: "Used if /categories API is not available. Accepts IDs or {id,name} objects.",
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
    name: "Menu",
    code: "top_nav",
    defaultSettings: {
      // base look
      background_color: "#ffffff",
      text_color: "#111827",
      border: true,
      logo_placement: "left",
      logo_type: "default", // default | white | none | custom
      logo_url: "",
      brand_subtitle: "Beauty",
      // quick icon toggles (ON by default)
      show_search: true,
      show_cart: true,
      show_wishlist: true,
      show_whatsapp: true,
      show_profile: true,
      whatsapp_number: "", // e.g. +91XXXXXXXXXX or full https://wa.me/… link

      // optional legacy buttons (not required for the new icon row)
      left_button: "MENU", // NONE | BRANCH | SEARCH | ACCOUNT | CART | MENU
      right_button: "NONE",

      // menu / categories
      menu_items: [], // [{label:'About', href:'/about'}]
      display_categories_on_menu: true,

      // behavior
      sticky_header: true,

      // desktop & mobile search pill (same style on all breakpoints)
      desktop_search_bar_background_color: "#ffffff",
      desktop_search_bar_placeholder_text: "Search products",
      desktop_search_bar_placeholder_text_color: "#6b7280",
      desktop_search_bar_display_search_icon: true,
      desktop_search_bar_search_icon_color: "#6b7280",
      desktop_search_bar_border: true,
      desktop_search_bar_border_size: "2px",
      desktop_search_bar_border_color: "#111827",
      desktop_search_bar_radius: "full",

      // misc
      custom_css: null,
      visibility: "all", // all | desktop | mobile
    },
    settingsSchema: {
      groups: [
        {
          label: "Quick toggles",
          fields: [
            { path: "show_search", type: "boolean", label: "Search" },
            { path: "show_cart", type: "boolean", label: "Cart" },
            { path: "show_wishlist", type: "boolean", label: "Wishlist" },
            { path: "show_whatsapp", type: "boolean", label: "WhatsApp" },
            {
              path: "whatsapp_number",
              type: "text",
              label: "WhatsApp number/link",
              placeholder: "+91XXXXXXXXXX or https://wa.me/…",
              showIf: { show_whatsapp: true },
            },
            { path: "show_profile", type: "boolean", label: "Profile" },
          ],
        },

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
            {
              path: "logo_type",
              type: "select",
              label: "Logo type",
              options: ["default", "white", "none", "custom"],
            },
            {
              path: "brand_subtitle",
              type: "text",
              label: "Subtitle under logo",
            },
            { path: "border", type: "boolean", label: "Bottom border" },
            { path: "sticky_header", type: "boolean", label: "Sticky header" },
          ],
        },

        {
          label: "Button settings",
          fields: [
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
            { path: "menu_items", type: "linkList", label: "Custom links" },
          ],
        },

        {
          label: "Search pill",
          fields: [
            {
              path: "desktop_search_bar_background_color",
              type: "color",
              label: "Search BG",
            },
            {
              path: "desktop_search_bar_placeholder_text",
              type: "text",
              label: "Placeholder",
            },
            {
              path: "desktop_search_bar_placeholder_text_color",
              type: "color",
              label: "Placeholder color",
            },
            {
              path: "desktop_search_bar_display_search_icon",
              type: "boolean",
              label: "Show icon",
            },
            {
              path: "desktop_search_bar_search_icon_color",
              type: "color",
              label: "Icon color",
              showIf: { desktop_search_bar_display_search_icon: true },
            },
            {
              path: "desktop_search_bar_border",
              type: "boolean",
              label: "Border",
            },
            {
              path: "desktop_search_bar_border_size",
              type: "select",
              label: "Border size",
              options: ["0px", "1px", "2px", "3px", "4px", "6px"],
              showIf: { desktop_search_bar_border: true },
            },
            {
              path: "desktop_search_bar_border_color",
              type: "color",
              label: "Border color",
              showIf: { desktop_search_bar_border: true },
            },
            {
              path: "desktop_search_bar_radius",
              type: "select",
              label: "Corner radius",
              options: ["none", "sm", "md", "lg", "xl", "full"],
            },
          ],
        },

        {
          label: "Custom CSS",
          fields: [{ path: "custom_css", type: "textarea", label: "Your CSS" }],
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
{
  name: "Store Hero",
  code: "store_hero",
  defaultSettings: {
    height_desktop_px: 420,
    height_mobile_px: 280,
    border_radius: "lg",
    background_image_url:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
    background_object_position: "center",

    overlay_color: "#000000",
    overlay_opacity: 25,

    show_logo_badge: true,
    logo_image_url: "",
    logo_badge_size: 88,
    logo_badge_shape: "rounded",
    logo_badge_shadow: true,
    logo_badge_inner_padding: 6,

    show_made_with: true,
    made_with_text: "Made with StoreMins",
    made_with_link: "https://storemins.com",
    show_made_with_icon: true,
    made_with_icon_url:
      "https://minis-media-assets.swiggy.com/swiggymini/image/upload/h_128,c_fit,fl_lossy,q_auto:eco,f_auto/IMAGE/847486d0-db3e-4d54-bee7-b537747c7ecd/0gZi8UlkP9cWIQrrlQF1u-B63F0C50-8D0C-4529-AC08-1613096E9E43.png",

    inset_padding: 14,
    custom_css: null,
    visibility: "all",
  },
  settingsSchema: {
    groups: [
      {
        label: "Background",
        fields: [
          { path: "background_image_url", type: "image", label: "Image" },
          {
            path: "background_object_position",
            type: "text",
            label: "Object position (CSS)",
            placeholder: "center, 50% 40%, left top…",
          },
          {
            path: "height_desktop_px",
            type: "number",
            label: "Height (desktop, px)",
            min: 120,
            max: 1000,
            step: 10,
          },
          {
            path: "height_mobile_px",
            type: "number",
            label: "Height (mobile, px)",
            min: 120,
            max: 800,
            step: 10,
          },
          {
            path: "border_radius",
            type: "select",
            label: "Corner radius",
            options: ["none", "sm", "md", "lg", "xl", "2xl"],
          },
          { path: "overlay_color", type: "color", label: "Overlay color" },
          {
            path: "overlay_opacity",
            type: "number",
            label: "Overlay opacity (%)",
            min: 0,
            max: 100,
            step: 1,
          },
        ],
      },
      {
        label: "Logo badge (bottom-left)",
        fields: [
          { path: "show_logo_badge", type: "boolean", label: "Show logo badge" },
          {
            path: "logo_image_url",
            type: "image",
            label: "Logo image",
            showIf: { show_logo_badge: true },
          },
          {
            path: "logo_badge_size",
            type: "number",
            label: "Size (px)",
            min: 36,
            max: 160,
            step: 2,
            showIf: { show_logo_badge: true },
          },
          {
            path: "logo_badge_shape",
            type: "select",
            label: "Shape",
            options: ["rounded", "circle", "square"],
            showIf: { show_logo_badge: true },
          },
          {
            path: "logo_badge_inner_padding",
            type: "number",
            label: "Inner padding (px)",
            min: 0,
            max: 20,
            step: 1,
            showIf: { show_logo_badge: true },
          },
          {
            path: "logo_badge_shadow",
            type: "boolean",
            label: "Shadow",
            showIf: { show_logo_badge: true },
          },
        ],
      },
      {
        label: "Made with chip (bottom-right)",
        fields: [
          { path: "show_made_with", type: "boolean", label: "Show chip" },
          {
            path: "made_with_text",
            type: "text",
            label: "Text",
            showIf: { show_made_with: true },
          },
          {
            path: "made_with_link",
            type: "text",
            label: "Link",
            showIf: { show_made_with: true },
          },
          {
            path: "show_made_with_icon",
            type: "boolean",
            label: "Show icon",
            showIf: { show_made_with: true },
          },
          {
            path: "made_with_icon_url",
            type: "image",
            label: "Icon",
            showIf: { show_made_with: true },
          },
        ],
      },
      {
        label: "Advanced",
        fields: [
          {
            path: "inset_padding",
            type: "number",
            label: "Edge padding (px)",
            min: 0,
            max: 40,
            step: 1,
          },
          { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
    name: "Store Stats",
    code: "store_stats",
    defaultSettings: {
      // display
      alignment: "center", // left | center | right
      compact: true, // tighter spacing
      show_dividers: true,
      text_color: "#111827",
      divider_color: "#E5E7EB",
      visibility: "all",

      // built-in badges (these values are shown by the renderer if no live stats are present)
      rating_enabled: true,
      rating_value: 4.42,
      rating_count: 92,

      orders_enabled: true,
      orders_value: "1.5k",

      loves_enabled: true,
      loves_value: 279,

      // custom badges (max 2)
      custom1_enabled: false,
      custom1_icon: "ri-flashlight-line", // any Remix icon class, fallback to a dot
      custom1_label: "New",
      custom1_value: "",

      custom2_enabled: false,
      custom2_icon: "ri-shield-check-line",
      custom2_label: "Trusted",
      custom2_value: "",

      // advanced
      custom_css: null,
    },
    settingsSchema: {
      groups: [
        {
          label: "Display",
          fields: [
            {
              path: "alignment",
              type: "select",
              label: "Alignment",
              options: ["left", "center", "right"],
            },
            { path: "compact", type: "boolean", label: "Compact spacing" },
            { path: "show_dividers", type: "boolean", label: "Show dividers" },
            { path: "text_color", type: "color", label: "Text & icon color" },
            { path: "divider_color", type: "color", label: "Divider color" },
          ],
        },
        {
          label: "Built-in badges",
          fields: [
            { path: "rating_enabled", type: "boolean", label: "Rating" },
            { path: "orders_enabled", type: "boolean", label: "Orders" },
            { path: "loves_enabled", type: "boolean", label: "“Love this”" },
          ],
        },
        {
          label: "Custom badge #1",
          fields: [
            { path: "custom1_enabled", type: "boolean", label: "Enabled" },
            {
              path: "custom1_icon",
              type: "text",
              label: "Icon (Remix class)",
              showIf: { custom1_enabled: true },
            },
            {
              path: "custom1_label",
              type: "text",
              label: "Label",
              showIf: { custom1_enabled: true },
            },
            {
              path: "custom1_value",
              type: "text",
              label: "Value (optional)",
              showIf: { custom1_enabled: true },
            },
          ],
        },
        {
          label: "Custom badge #2",
          fields: [
            { path: "custom2_enabled", type: "boolean", label: "Enabled" },
            {
              path: "custom2_icon",
              type: "text",
              label: "Icon (Remix class)",
              showIf: { custom2_enabled: true },
            },
            {
              path: "custom2_label",
              type: "text",
              label: "Label",
              showIf: { custom2_enabled: true },
            },
            {
              path: "custom2_value",
              type: "text",
              label: "Value (optional)",
              showIf: { custom2_enabled: true },
            },
          ],
        },
        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
    name: "Store Delivery Info",
    code: "store_delivery_info",
    defaultSettings: {
      background_color: "#ffffff",
      text_color: "#111827",
      accent_color: "#7c3aed",
      align: "left", // left | center | right
      show_dividers: true,
      min_days: 1,
      max_days: 5,
      store_name: "", // empty -> falls back to store setting / window.__STORE_NAME
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Display",
          fields: [
            {
              path: "align",
              type: "select",
              label: "Alignment",
              options: ["left", "center", "right"],
            },
            {
              path: "show_dividers",
              type: "boolean",
              label: "Show top/bottom divider",
            },
          ],
        },
        {
          label: "Colors",
          fields: [
            { path: "background_color", type: "color", label: "Background" },
            { path: "text_color", type: "color", label: "Text" },
            {
              path: "accent_color",
              type: "color",
              label: "Accent (icon & link)",
            },
          ],
        },
        {
          label: "Behavior",
          fields: [
            {
              path: "min_days",
              type: "number",
              label: "Min days",
              min: 1,
              max: 10,
              step: 1,
            },
            {
              path: "max_days",
              type: "number",
              label: "Max days",
              min: 1,
              max: 30,
              step: 1,
            },
            {
              path: "store_name",
              type: "text",
              label: "Store override (optional)",
            },
          ],
        },
        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
  // --- FLASH SALE BLOCKS -------------------------------------------------------
  {
    name: "Flash Sale Hero",
    code: "flash_sale_hero",
    defaultSettings: {
      enabled: true,

      // content
      headline: "FLAT 50% OFF",
      subheadline: "Today only",
      show_countdown: true,
      countdown_end_iso: null,
      cta_label: "Shop Now",
      cta_href: "/collections/flash-sale",

      // sizing
      height_desktop: 200,
      height_mobile: 140,

      // background (default image so preview always shows it)
      background_image:
        "https://moosend.com/wp-content/uploads/2024/12/flash_sales_email_examples.png",
      background_color: "#cccccc",
      text_color: "#111827",
      overlay_color: "#000000",
      overlay_opacity: 20, // 0-100
      align: "center", // left | center | right

      // badge
      badge_show: true,
      badge_text: "LIMITED",
      badge_color: "#111827",

      // subsections toggles
      show_deals_grid: false,
      show_carousel: false,
      show_urgency_strip: false,

      // Deals grid config
      deals: {
        section_background_color: "#cccccc",
        section_top_margin: "0rem",
        section_bottom_margin: "1rem",
        title: "Top Deals",
        title_color: "#111827",
        grid_cols: 3, // 2 | 3 | 4
        show_price: true,
        show_compare_at: true,
        card_radius: "md", // none | sm | md | lg | xl | 2xl (Tailwind token)
        card_shadow: "sm", // sm | md | lg
        image_aspect: "1/1",
        show_badge: true,
        // optional preview data
        sample_products: [],
      },

      // Carousel config
      carousel: {
        section_background_color: "#cccccc",
        section_top_margin: "0rem",
        section_bottom_margin: "1rem",
        display_title: true,
        title: "Hot Right Now",
        badge_text: "HOT",
        auto_scroll: false,
        scroll_speed_ms: 2000,
        sample_products: [],
        show_dots: true,
      },

      // Urgency strip config
      urgency: {
        section_background_color: "#cccccc",
        border: false,
        text_color: "#111827",
        show_icons: true,
        show_timer: true,
        show_stock: true,
        stock_left: 37,
        stock_total: 100,
        accent_color: "#ef4444",
        show_rating: true,
        rating_value: 4.8,
        rating_count: 1200,
      },

      custom_css: null,
      visibility: "all",
    },

    settingsSchema: {
      groups: [
        {
          label: "Hero",
          fields: [
            { path: "enabled", type: "boolean", label: "Enabled" },
            { path: "headline", type: "text", label: "Headline" },
            { path: "subheadline", type: "text", label: "Subheadline" },
            {
              path: "show_countdown",
              type: "boolean",
              label: "Show countdown",
            },
            {
              path: "countdown_end_iso",
              type: "datetime",
              label: "Ends at (ISO)",
              showIf: { show_countdown: true },
            },
            { path: "cta_label", type: "text", label: "CTA label" },
            { path: "cta_href", type: "text", label: "CTA link" },

            {
              path: "background_image",
              type: "image",
              label: "Background image",
            },
            {
              path: "background_color",
              type: "color",
              label: "Background color",
            },
            { path: "text_color", type: "color", label: "Text color" },
            { path: "overlay_color", type: "color", label: "Overlay color" },
            {
              path: "overlay_opacity",
              type: "number",
              label: "Overlay opacity (%)",
              min: 0,
              max: 100,
              step: 1,
            },
            {
              path: "align",
              type: "select",
              label: "Text align",
              options: ["left", "center", "right"],
            },
            {
              path: "height_desktop",
              type: "number",
              label: "Height desktop",
              min: 160,
              max: 800,
              step: 10,
            },
            {
              path: "height_mobile",
              type: "number",
              label: "Height mobile",
              min: 120,
              max: 600,
              step: 10,
            },
            { path: "badge_show", type: "boolean", label: "Show badge" },
            {
              path: "badge_text",
              type: "text",
              label: "Badge text",
              showIf: { badge_show: true },
            },
            {
              path: "badge_color",
              type: "color",
              label: "Badge color",
              showIf: { badge_show: true },
            },
          ],
        },

        {
          label: "Sections",
          fields: [
            { path: "show_deals_grid", type: "boolean", label: "Deals grid" },
            { path: "show_carousel", type: "boolean", label: "Carousel" },
            {
              path: "show_urgency_strip",
              type: "boolean",
              label: "Urgency strip",
            },
          ],
        },

        {
          label: "Deals grid config",
          fields: [
            {
              path: "deals.section_background_color",
              type: "color",
              label: "Section background",
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.section_top_margin",
              type: "text",
              label: "Top margin (e.g. 0rem)",
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.section_bottom_margin",
              type: "text",
              label: "Bottom margin (e.g. 1rem)",
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.title",
              type: "text",
              label: "Title",
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.title_color",
              type: "color",
              label: "Title color",
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.grid_cols",
              type: "number",
              label: "Grid columns (2–4)",
              min: 2,
              max: 4,
              step: 1,
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.show_price",
              type: "boolean",
              label: "Show price",
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.show_compare_at",
              type: "boolean",
              label: "Show compare-at price",
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.card_radius",
              type: "select",
              label: "Card radius",
              options: ["none", "sm", "md", "lg", "xl", "2xl"],
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.card_shadow",
              type: "select",
              label: "Card shadow",
              options: ["sm", "md", "lg"],
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.image_aspect",
              type: "text",
              label: "Image aspect (e.g. 1/1, 4/5)",
              showIf: { show_deals_grid: true },
            },
            {
              path: "deals.show_badge",
              type: "boolean",
              label: "Show discount badge",
              showIf: { show_deals_grid: true },
            },
          ],
        },

        {
          label: "Carousel config",
          fields: [
            {
              path: "carousel.section_background_color",
              type: "color",
              label: "Section background",
              showIf: { show_carousel: true },
            },
            {
              path: "carousel.section_top_margin",
              type: "text",
              label: "Top margin",
              showIf: { show_carousel: true },
            },
            {
              path: "carousel.section_bottom_margin",
              type: "text",
              label: "Bottom margin",
              showIf: { show_carousel: true },
            },
            {
              path: "carousel.display_title",
              type: "boolean",
              label: "Show title",
              showIf: { show_carousel: true },
            },
            {
              path: "carousel.title",
              type: "text",
              label: "Title",
              showIf: { show_carousel: true, "carousel.display_title": true },
            },
            {
              path: "carousel.badge_text",
              type: "text",
              label: "Corner badge text",
              showIf: { show_carousel: true },
            },
            {
              path: "carousel.auto_scroll",
              type: "boolean",
              label: "Auto-scroll",
              showIf: { show_carousel: true },
            },
            {
              path: "carousel.scroll_speed_ms",
              type: "number",
              label: "Auto-scroll speed (ms)",
              min: 800,
              max: 8000,
              step: 100,
              showIf: { show_carousel: true, "carousel.auto_scroll": true },
            },
            {
              path: "carousel.show_dots",
              type: "boolean",
              label: "Show dots",
              showIf: { show_carousel: true },
            },
          ],
        },

        {
          label: "Urgency strip config",
          fields: [
            {
              path: "urgency.section_background_color",
              type: "color",
              label: "Section background",
              showIf: { show_urgency_strip: true },
            },
            {
              path: "urgency.border",
              type: "boolean",
              label: "Show top & bottom borders",
              showIf: { show_urgency_strip: true },
            },
            {
              path: "urgency.text_color",
              type: "color",
              label: "Text color",
              showIf: { show_urgency_strip: true },
            },
            {
              path: "urgency.show_icons",
              type: "boolean",
              label: "Show icons",
              showIf: { show_urgency_strip: true },
            },
            {
              path: "urgency.show_timer",
              type: "boolean",
              label: "Show timer",
              showIf: { show_urgency_strip: true },
            },
            {
              path: "urgency.show_stock",
              type: "boolean",
              label: "Show stock bar",
              showIf: { show_urgency_strip: true },
            },
            {
              path: "urgency.stock_left",
              type: "number",
              label: "Stock left",
              min: 0,
              step: 1,
              showIf: { show_urgency_strip: true, "urgency.show_stock": true },
            },
            {
              path: "urgency.stock_total",
              type: "number",
              label: "Stock total",
              min: 1,
              step: 1,
              showIf: { show_urgency_strip: true, "urgency.show_stock": true },
            },
            {
              path: "urgency.accent_color",
              type: "color",
              label: "Accent color",
              showIf: { show_urgency_strip: true },
            },
            {
              path: "urgency.show_rating",
              type: "boolean",
              label: "Show rating",
              showIf: { show_urgency_strip: true },
            },
            {
              path: "urgency.rating_value",
              type: "number",
              label: "Rating value",
              min: 0,
              max: 5,
              step: 0.1,
              showIf: { show_urgency_strip: true, "urgency.show_rating": true },
            },
            {
              path: "urgency.rating_count",
              type: "number",
              label: "Rating count",
              min: 0,
              step: 1,
              showIf: { show_urgency_strip: true, "urgency.show_rating": true },
            },
          ],
        },

        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
  // --- end FLASH SALE ----------------------------------------------------------
  {
    name: "Social Proof Strip",
    code: "social_proof_strip",
    defaultSettings: {
      enabled: true,
      section_background_color: "#ffffff",
      compact: true,
      max_items: 5,

      // card style
      chip_radius: 18,
      chip_background_color: "#ffffff",
      chip_border_color: "#ECEFF3",
      chip_shadow: true,
      hover_lift: true,

      // icon style
      icon_size: 20,
      icon_pad: 10,
      icon_radius: 12,

      // slots (3 enabled by default) + Podcasts enabled as #4
      item1: {
        enabled: true,
        platform: "Instagram",
        value: "64.1K",
        label: "Followers",
        href: "https://instagram.com/",
        icon_img:
          "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
        icon_bg: "linear-gradient(135deg,#F9CE34 0%,#EE2A7B 50%,#6228D7 100%)",
        icon_color: "#ffffff",
      },
      item2: {
        enabled: true,
        platform: "YouTube",
        value: "64.1K",
        label: "Followers",
        href: "https://youtube.com/",
        icon_img:
          "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
        icon_bg: "#FF0000",
        icon_color: "#ffffff",
      },
      item3: {
        enabled: true,
        platform: "Facebook",
        value: "40K+",
        label: "Followers",
        href: "https://facebook.com/",
        icon_img:
          "https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg",
        icon_bg: "#1877F2",
        icon_color: "#ffffff",
      },

      // ➕ New default chip matching your screenshot
      item4: {
        enabled: true,
        platform: "Podcasts",
        value: "20+",
        label: "Podcasts",
        // Inline SVG mic (URL-encoded) so no font dependency
        icon_img:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23111827'><path d='M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z'/><path d='M5 11a1 1 0 1 0-2 0c0 4.08 3.06 7.44 7 7.93V22h4v-3.07c3.94-.49 7-3.85 7-7.93a1 1 0 1 0-2 0 6 6 0 0 1-12 0z'/></svg>",
        icon_bg: "#F59E0B", // amber pill
        icon_color: "#111827",
        // If you prefer an icon font instead, comment icon_img and use:
        // icon: "ri-mic-line", icon_color: "#111827"
      },

      item5: { enabled: false },

      visibility: "all",
      custom_css: null,
    },

    settingsSchema: {
      groups: [
        {
          label: "Display",
          fields: [
            { path: "enabled", type: "boolean", label: "Enabled" },
            {
              path: "section_background_color",
              type: "color",
              label: "Section background",
            },
            { path: "compact", type: "boolean", label: "Compact paddings" },
            {
              path: "max_items",
              type: "number",
              label: "Max items (≤5)",
              min: 1,
              max: 5,
              step: 1,
            },
          ],
        },
        {
          label: "Card style",
          fields: [
            {
              path: "chip_radius",
              type: "number",
              label: "Card radius (px)",
              min: 0,
              max: 24,
              step: 1,
            },
            {
              path: "chip_background_color",
              type: "color",
              label: "Card background",
            },
            { path: "chip_border_color", type: "color", label: "Card border" },
            { path: "chip_shadow", type: "boolean", label: "Soft shadow" },
            { path: "hover_lift", type: "boolean", label: "Hover lift" },
          ],
        },
        {
          label: "Icon style",
          fields: [
            {
              path: "icon_size",
              type: "number",
              label: "Icon size (px)",
              min: 12,
              max: 32,
              step: 1,
            },
            {
              path: "icon_pad",
              type: "number",
              label: "Icon padding (px)",
              min: 6,
              max: 16,
              step: 1,
            },
            {
              path: "icon_radius",
              type: "number",
              label: "Icon radius (px)",
              min: 0,
              max: 20,
              step: 1,
            },
          ],
        },

        // Five explicit slots
        {
          label: "Item #1",
          fields: [
            { path: "item1.enabled", type: "boolean", label: "Show item" },
            { path: "item1.platform", type: "text", label: "Platform" },
            { path: "item1.value", type: "text", label: "Value" },
            { path: "item1.label", type: "text", label: "Sub label" },
            { path: "item1.href", type: "text", label: "Link (optional)" },
            { path: "item1.icon_img", type: "image", label: "Icon image" },
            { path: "item1.icon", type: "text", label: "Remix icon (alt)" },
            { path: "item1.icon_bg", type: "color", label: "Icon background" },
            { path: "item1.icon_color", type: "color", label: "Icon color" },
          ],
        },
        {
          label: "Item #2",
          fields: [
            { path: "item2.enabled", type: "boolean", label: "Show item" },
            { path: "item2.platform", type: "text", label: "Platform" },
            { path: "item2.value", type: "text", label: "Value" },
            { path: "item2.label", type: "text", label: "Sub label" },
            { path: "item2.href", type: "text", label: "Link (optional)" },
            { path: "item2.icon_img", type: "image", label: "Icon image" },
            { path: "item2.icon", type: "text", label: "Remix icon (alt)" },
            { path: "item2.icon_bg", type: "color", label: "Icon background" },
            { path: "item2.icon_color", type: "color", label: "Icon color" },
          ],
        },
        {
          label: "Item #3",
          fields: [
            { path: "item3.enabled", type: "boolean", label: "Show item" },
            { path: "item3.platform", type: "text", label: "Platform" },
            { path: "item3.value", type: "text", label: "Value" },
            { path: "item3.label", type: "text", label: "Sub label" },
            { path: "item3.href", type: "text", label: "Link (optional)" },
            { path: "item3.icon_img", type: "image", label: "Icon image" },
            { path: "item3.icon", type: "text", label: "Remix icon (alt)" },
            { path: "item3.icon_bg", type: "color", label: "Icon background" },
            { path: "item3.icon_color", type: "color", label: "Icon color" },
          ],
        },
        {
          label: "Item #4",
          fields: [
            { path: "item4.enabled", type: "boolean", label: "Show item" },
            { path: "item4.platform", type: "text", label: "Platform" },
            { path: "item4.value", type: "text", label: "Value" },
            { path: "item4.label", type: "text", label: "Sub label" },
            { path: "item4.href", type: "text", label: "Link (optional)" },
            { path: "item4.icon_img", type: "image", label: "Icon image" },
            { path: "item4.icon", type: "text", label: "Remix icon (alt)" },
            { path: "item4.icon_bg", type: "color", label: "Icon background" },
            { path: "item4.icon_color", type: "color", label: "Icon color" },
          ],
        },
        {
          label: "Item #5",
          fields: [
            { path: "item5.enabled", type: "boolean", label: "Show item" },
            { path: "item5.platform", type: "text", label: "Platform" },
            { path: "item5.value", type: "text", label: "Value" },
            { path: "item5.label", type: "text", label: "Sub label" },
            { path: "item5.href", type: "text", label: "Link (optional)" },
            { path: "item5.icon_img", type: "image", label: "Icon image" },
            { path: "item5.icon", type: "text", label: "Remix icon (alt)" },
            { path: "item5.icon_bg", type: "color", label: "Icon background" },
            { path: "item5.icon_color", type: "color", label: "Icon color" },
          ],
        },

        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
    name: "Story Highlights",
    code: "story_highlights",
    defaultSettings: {
      enabled: true,
      // strip look
      section_background_color: "#ffffff",
      item_size_px: 72,
      gap_px: 14,
      label_size: "text-xs",
      label_color: "#111827",
      show_labels: true,
      ring: {
        width_px: 3,
        from: "#F58529",
        via: "#DD2A7B",
        to: "#515BD4",
        bg: "#ffffff",
      },
      // modal look
      modal_backdrop: "rgba(0,0,0,0.75)",
      modal_nav_bg: "rgba(255,255,255,0.9)",
      modal_nav_color: "#111827",

      // sample highlights (each max 3 images)
      highlights: [
        {
          name: "Shoot Day",
          cover:
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop",
          ],
        },
        {
          name: "Arizona",
          cover:
            "https://images.unsplash.com/photo-1543352634-873e4fc5d8fd?w=600&auto=format&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1543352634-873e4fc5d8fd?w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&auto=format&fit=crop",
          ],
        },
        {
          name: "Mallorca",
          cover:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop",
          ],
        },
      ],
      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Display",
          fields: [
            { path: "enabled", type: "boolean", label: "Enabled" },
            {
              path: "section_background_color",
              type: "color",
              label: "Background",
            },
            {
              path: "item_size_px",
              type: "number",
              label: "Item size (px)",
              min: 48,
              max: 120,
              step: 2,
            },
            {
              path: "gap_px",
              type: "number",
              label: "Gap (px)",
              min: 6,
              max: 32,
              step: 1,
            },
            { path: "show_labels", type: "boolean", label: "Show labels" },
            {
              path: "label_size",
              type: "select",
              label: "Label size",
              options: ["text-xs", "text-sm"],
              showIf: { show_labels: true },
            },
            {
              path: "label_color",
              type: "color",
              label: "Label color",
              showIf: { show_labels: true },
            },
          ],
        },
        {
          label: "Ring",
          fields: [
            {
              path: "ring.width_px",
              type: "number",
              label: "Ring width (px)",
              min: 1,
              max: 8,
              step: 1,
            },
            { path: "ring.from", type: "color", label: "From" },
            { path: "ring.via", type: "color", label: "Via" },
            { path: "ring.to", type: "color", label: "To" },
            { path: "ring.bg", type: "color", label: "Inner gap color" },
          ],
        },
        {
          label: "Modal",
          fields: [
            {
              path: "modal_backdrop",
              type: "text",
              label: "Backdrop (CSS color/gradient)",
            },
            { path: "modal_nav_bg", type: "text", label: "Nav BG (CSS color)" },
            { path: "modal_nav_color", type: "color", label: "Nav text color" },
          ],
        },
        {
          label: "Content",
          fields: [
            {
              path: "highlights",
              type: "textarea",
              label:
                "Highlights (JSON array, each with name, cover, images[≤3])",
            },
          ],
        },
        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
    name: "Offers / Collections",
    code: "offers_collections",
    defaultSettings: {
      enabled: true,

      // header
      show_header: true,
      title: "Explore offers",
      subtitle: "Handpicked promos & popular collections",
      align: "left", // left | center | right

      // simple images (array of strings) – editor friendly
      images: [
        "https://images.unsplash.com/photo-1604908554007-4b0b1b2d9a8b?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80&auto=format&fit=crop",
      ],

      // optional rich `items` (component can read both)
      items: [
        {
          image:
            "https://images.unsplash.com/photo-1604908554007-4b0b1b2d9a8b?w=1600&q=80&auto=format&fit=crop",
          title: "Buy 1 Get 1 Free",
          subtitle: "Wraps, Bowls & Shawarmas",
          badge: "Limited",
          ctaLabel: "Explore",
          href: "/collections/buy1get1",
        },
        {
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=80&auto=format&fit=crop",
          title: "Mini Biryanis at ₹149",
          subtitle: "T&Cs apply",
          badge: "Hot",
          ctaLabel: "View",
          href: "/collections/biryani",
        },
        {
          image:
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80&auto=format&fit=crop",
          title: "Bowls & Salads",
          subtitle: "Fresh picks",
          ctaLabel: "Explore",
          href: "/collections/bowls",
          gradient:
            "linear-gradient(180deg, rgba(0,0,0,0) 10%, rgba(0,0,0,0.75) 100%)",
        },
      ],

      // card look
      radius: 16,
      height_mobile_px: 160,
      height_desktop_px: 180,
      overlay_gradient:
        "linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(0,0,0,0.65) 100%)",
      show_cta: true,
      cta_label_default: "Explore",

      // section
      section_background_color: "#ffffff",

      // mobile dots
      show_dots_mobile: true,

      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Header",
          fields: [
            { path: "show_header", type: "boolean", label: "Show header" },
            { path: "title", type: "text", label: "Title" },
            { path: "subtitle", type: "text", label: "Subtitle" },
            {
              path: "align",
              type: "select",
              label: "Align",
              options: ["left", "center", "right"],
            },
          ],
        },
        {
          label: "Pictures",
          fields: [
            {
              path: "images",
              type: "imageList",
              label: "Images (simple)",
              itemLabel: "Image",
              withLink: false, // links are supported via rich items below
            },
            {
              path: "items",
              type: "textarea",
              label:
                "Advanced items JSON (optional: image, title, subtitle, badge, ctaLabel, href, gradient)",
            },
          ],
        },
        {
          label: "Card",
          fields: [
            {
              path: "radius",
              type: "number",
              label: "Corner radius (px)",
              min: 0,
              max: 32,
              step: 1,
            },
            {
              path: "height_mobile_px",
              type: "number",
              label: "Height mobile (px)",
              min: 120,
              max: 280,
              step: 10,
            },
            {
              path: "height_desktop_px",
              type: "number",
              label: "Height desktop (px)",
              min: 140,
              max: 360,
              step: 10,
            },
            {
              path: "overlay_gradient",
              type: "text",
              label: "Overlay gradient (CSS)",
            },
            { path: "show_cta", type: "boolean", label: "Show CTA chip" },
            { path: "cta_label_default", type: "text", label: "Default CTA" },
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
              path: "show_dots_mobile",
              type: "boolean",
              label: "Show dots on mobile",
            },
          ],
        },
        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
    name: "Customer Testimonials",
    code: "customer_testimonials",
    defaultSettings: {
      enabled: true,
      section_background_color: "#ffffff",
      display_title: true,
      title: "What our clients say",
      title_color: "#111827",
      display_subtitle: false,
      subtitle: "",
      subtitle_color: "#374151",

      // testimonials (users can add their own later via admin)
      testimonials: [
        {
          name: "Stefan Jør",
          role: "Founder & CEO",
          company: "Prime Retail",
          avatar: "https://i.pravatar.cc/150?img=1",
          stars: 5,
          feedback:
            "Love the design and customization of InstaGrow. We’ve used various apps before but none this flexible.",
        },
        {
          name: "Gaurav Khe",
          role: "Business Manager",
          company: "GlowMart",
          avatar: "https://i.pravatar.cc/150?img=2",
          stars: 5,
          feedback:
            "I like the flexibility and customization options. No custom CSS required — works out of the box.",
        },
        {
          name: "Marian Campos",
          role: "Entrepreneur",
          company: "iZettle",
          avatar: "https://i.pravatar.cc/150?img=3",
          stars: 4,
          feedback:
            "A very well-done plugin that now works exactly as advertised. Best Facebook integration I’ve used.",
        },
      ],

      // card UI
      card_radius: "lg",
      card_shadow: "md",
      show_navigation: true,
      auto_slide: true,
      slide_interval: 5000,

      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Basics",
          fields: [
            { path: "enabled", type: "boolean", label: "Enabled" },
            { path: "title", type: "text", label: "Title" },
            { path: "subtitle", type: "text", label: "Subtitle" },
          ],
        },
        {
          label: "Testimonials",
          fields: [
            {
              path: "testimonials",
              type: "textarea",
              label:
                "Testimonials JSON (name, role, company, avatar, stars, feedback)",
            },
          ],
        },
        {
          label: "Appearance",
          fields: [
            {
              path: "section_background_color",
              type: "color",
              label: "Background",
            },
            {
              path: "title_color",
              type: "color",
              label: "Title Color",
            },
            {
              path: "subtitle_color",
              type: "color",
              label: "Subtitle Color",
            },
          ],
        },
      ],
    },
  },

  {
    name: "About Us",
    code: "about_us",
    defaultSettings: {
      enabled: true,

      // header
      display_title: true,
      title: "About us",
      title_color: "#111827",
      display_subtitle: false,
      subtitle: "",
      subtitle_color: "#6b7280",
      align: "left", // left | center | right

      // layout
      section_background_color: "#ffffff",
      grid_desktop_columns: 4, // 1 | 2 | 3 | 4
      grid_tablet_columns: 2, // 1 | 2 | 3
      card_radius: "xl", // none | sm | md | lg | xl | 2xl | full
      card_shadow: "md", // none | sm | md | lg
      card_divider: true,
      use_accordion: true, // collapsible details/summary

      // cards (4)
      items: [
        {
          key: "orders",
          icon: "ri-truck-line",
          title: "Orders and delivery",
          bullets: [
            "Delivery across India",
            "Delivery fee will apply",
            "All orders will be delivered by SampleStore.co",
            "Enter pincode on home page for estimated delivery timeline",
          ],
        },
        {
          key: "cancellation",
          icon: "ri-close-circle-line",
          title: "Cancellation policy",
          bullets: [
            "Full refund if you cancel before the order is accepted by us.",
            "For any queries on cancellations reach out to us via chat.",
          ],
        },
        {
          key: "returns",
          icon: "ri-refresh-line",
          title: "Return policy",
          bullets: ["For Terms & Conditions refer to our highlights."],
        },
        {
          key: "contact",
          icon: "ri-customer-service-2-line",
          title: "How to reach us",
          bullets: ["Jogeshwari West, Mumbai", "xxxxxxxxxxxxxx014@gmail.com"],
        },
      ],

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
            { path: "enabled", type: "boolean", label: "Enabled" },
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
            {
              path: "align",
              type: "select",
              label: "Align",
              options: ["left", "center", "right"],
            },
          ],
        },
        {
          label: "Layout",
          fields: [
            {
              path: "section_background_color",
              type: "color",
              label: "Background",
            },
            {
              path: "grid_tablet_columns",
              type: "select",
              label: "Tablet Columns",
              options: ["1", "2", "3"],
            },
            {
              path: "grid_desktop_columns",
              type: "select",
              label: "Desktop Columns",
              options: ["1", "2", "3", "4"],
            },
            {
              path: "card_radius",
              type: "select",
              label: "Card Radius",
              options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
            },
            {
              path: "card_shadow",
              type: "select",
              label: "Card Shadow",
              options: ["none", "sm", "md", "lg"],
            },
            {
              path: "card_divider",
              type: "boolean",
              label: "Show Card Divider",
            },
            {
              path: "use_accordion",
              type: "boolean",
              label: "Use Accordion (collapsible)",
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
        {
          label: "Cards",
          fields: [
            {
              path: "items",
              type: "textarea",
              label: "Items JSON (key, icon, title, bullets[])",
            },
          ],
        },
        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
    name: "Deals / Coupons Rail",
    code: "main_coupon",
    defaultSettings: {
      enabled: true,

      // header
      display_title: true,
      title: "Deals for you",
      title_color: "#111827",
      align: "left",

      // items
      items: [
        {
          enabled: true,
          badge_text: "DEAL",
          badge_bg: "#F97316",
          badge_color: "#ffffff",
          title: "Items At ₹99",
          subtitle: "On select items",
          href: "#",
        },
        {
          enabled: true,
          badge_text: "%",
          badge_bg: "#F97316",
          badge_color: "#ffffff",
          title: "50% Off Upto ₹100",
          subtitle: "Use SWIGGY50",
          href: "#",
        },
        {
          enabled: true,
          badge_text: "%",
          badge_bg: "#F97316",
          badge_color: "#ffffff",
          title: "Flat ₹200 Off",
          subtitle: "Orders above ₹999",
          href: "#",
        },
        {
          enabled: true,
          badge_text: "NEW",
          badge_bg: "#0F172A",
          badge_color: "#ffffff",
          title: "Free Gift",
          subtitle: "On first order",
          href: "#",
        },
        {
          enabled: true,
          badge_text: "%",
          badge_bg: "#F97316",
          badge_color: "#ffffff",
          title: "Bank Offers",
          subtitle: "HDFC / ICICI",
          href: "#",
        },
        {
          enabled: true,
          badge_text: "B1G1",
          badge_bg: "#F97316",
          badge_color: "#ffffff",
          title: "Buy 1 Get 1",
          subtitle: "Today only",
          href: "#",
        },
        {
          enabled: true,
          badge_text: "₹",
          badge_bg: "#0EA5E9",
          badge_color: "#ffffff",
          title: "20% Cashback",
          subtitle: "With PayTM",
          href: "#",
        },
        {
          enabled: true,
          badge_text: "FREE",
          badge_bg: "#16A34A",
          badge_color: "#ffffff",
          title: "Free Delivery",
          subtitle: "Above ₹499",
          href: "#",
        },
        {
          enabled: true,
          badge_text: "ID",
          badge_bg: "#4F46E5",
          badge_color: "#ffffff",
          title: "Student Offer",
          subtitle: "Verify & save",
          href: "#",
        },
        {
          enabled: true,
          badge_text: "%",
          badge_bg: "#F97316",
          badge_color: "#ffffff",
          title: "Festive Sale",
          subtitle: "Ends tonight",
          href: "#",
        },
      ],

      // card UI
      card_radius: 18,
      card_border: true,
      card_border_color: "#E5E7EB",
      card_text_color: "#111827",
      card_subtle_text_color: "#6B7280",
      card_bg: "#ffffff",
      card_shadow: false,
      card_height_px: 72,
      card_horizontal_pad_px: 18,
      gap_px: 14,

      // arrows
      show_arrows_desktop: true,
      show_arrows_mobile: false,
      arrows_bg: "#F3F4F6",
      arrows_fg: "#111827",

      // rail centering (keep false to avoid the left gap)
      center_rail_ends: false,

      // section
      section_background_color: "#ffffff",
      section_top_margin: "0rem",
      section_bottom_margin: "0.75rem",

      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Header",
          fields: [
            { path: "display_title", type: "boolean", label: "Show title" },
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
              path: "align",
              type: "select",
              label: "Heading alignment",
              options: ["left", "center", "right"],
            },
          ],
        },
        {
          label: "Content",
          fields: [
            {
              path: "items",
              type: "textarea",
              label:
                "Coupons JSON (array of {enabled,badge_text,badge_bg,badge_color,title,subtitle,href})",
            },
          ],
        },
        {
          label: "Card",
          fields: [
            {
              path: "card_radius",
              type: "number",
              label: "Corner radius (px)",
              min: 0,
              max: 30,
              step: 1,
            },
            { path: "card_border", type: "boolean", label: "Show border" },
            {
              path: "card_border_color",
              type: "color",
              label: "Border color",
              showIf: { card_border: true },
            },
            { path: "card_text_color", type: "color", label: "Title color" },
            {
              path: "card_subtle_text_color",
              type: "color",
              label: "Subtitle color",
            },
            { path: "card_bg", type: "color", label: "Card background" },
            { path: "card_shadow", type: "boolean", label: "Soft shadow" },
            {
              path: "card_height_px",
              type: "number",
              label: "Height (px)",
              min: 56,
              max: 108,
              step: 2,
            },
            {
              path: "card_horizontal_pad_px",
              type: "number",
              label: "Horizontal padding (px)",
              min: 8,
              max: 40,
              step: 1,
            },
            {
              path: "gap_px",
              type: "number",
              label: "Gap between cards (px)",
              min: 6,
              max: 32,
              step: 1,
            },
          ],
        },
        {
          label: "Arrows & Behavior",
          fields: [
            {
              path: "show_arrows_desktop",
              type: "boolean",
              label: "Show arrows on desktop",
            },
            {
              path: "show_arrows_mobile",
              type: "boolean",
              label: "Show arrows on mobile",
            },
            { path: "arrows_bg", type: "color", label: "Arrows background" },
            { path: "arrows_fg", type: "color", label: "Arrows icon color" },
            {
              path: "center_rail_ends",
              type: "boolean",
              label: "Center rail ends (adds side padding)",
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
              path: "section_top_margin",
              type: "spacing",
              label: "Top margin",
            },
            {
              path: "section_bottom_margin",
              type: "spacing",
              label: "Bottom margin",
            },
          ],
        },
        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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
    name: "Store Info",
    code: "store_info",
    defaultSettings: {
      enabled: true,

      // layout
      section_background_color: "#ffffff",
      align: "left", // left | center | right
      max_width_px: 720, // text column max width
      section_top_margin: "0rem",
      section_bottom_margin: "0.75rem",

      // text style
      text: "Crafting delicious, homemade treats daily.\nSpecialising in artisanal breads, cakes, and pastries that bring a touch of sweetness to your life. 🧁",
      text_color: "#6b7280", // gray-500
      font_size: "text-sm", // text-xs | text-sm | text-base | text-lg
      line_height: "leading-6", // leading-5 | leading-6 | leading-7

      custom_css: null,
      visibility: "all",
    },
    settingsSchema: {
      groups: [
        {
          label: "Content",
          fields: [
            { path: "enabled", type: "boolean", label: "Enabled" },
            {
              path: "text",
              type: "textarea",
              label: "Text (supports new lines)",
            },
            {
              path: "align",
              type: "select",
              label: "Alignment",
              options: ["left", "center", "right"],
            },
            {
              path: "max_width_px",
              type: "number",
              label: "Max text width (px)",
              min: 320,
              max: 1000,
              step: 10,
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
            { path: "text_color", type: "color", label: "Text color" },
            {
              path: "font_size",
              type: "select",
              label: "Font size",
              options: ["text-xs", "text-sm", "text-base", "text-lg"],
            },
            {
              path: "line_height",
              type: "select",
              label: "Line height",
              options: ["leading-5", "leading-6", "leading-7"],
            },
          ],
        },
        {
          label: "Section",
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
          ],
        },
        {
          label: "Advanced",
          fields: [
            { path: "custom_css", type: "textarea", label: "Custom CSS" },
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

// ---------------------------------------------------------------------------
//  (A) CATEGORY MASTER (12 solid categories)
// ---------------------------------------------------------------------------
const CATEGORY_LIST = [
  { slug: "recommended", name: "Recommended" },
  { slug: "makeup-mini", name: "Makeup/Skincare Miniature" },
  { slug: "full-size", name: "Full Size Products" },
  { slug: "body-mist", name: "Body Mist" },
  { slug: "perfume", name: "Perfume" },
  { slug: "arabic-perfume", name: "Arabic Perfume" },
  { slug: "perfume-mini", name: "Perfume Miniature" },
  { slug: "foundation", name: "Foundation" },
  { slug: "concealer", name: "Concealer" },
  { slug: "skin-tint", name: "Skin Tint" },
  { slug: "primer", name: "Primer" },
  { slug: "strobe-cream", name: "Strobe Cream" },
];

// ---------------------------------------------------------------------------
//  (B) CATEGORY → PRODUCT SLUGS (8–10 per category wherever possible)
//      Feel free to expand later; these match demoProducts below.
// ---------------------------------------------------------------------------
const CATEGORY_MAP: Record<string, string[]> = {
  recommended: [
    "gucci-flora-gorgeous-magnolia-edp",
    "carolina-herrera-good-girl-edp",
    "versace-dylan-blue-edt",
    "maison-margiela-replica-beach-walk",
    "kayali-vanilla-28",
    "nars-soft-matte-concealer",
    "mac-ruby-woo",
    "the-ordinary-niacinamide-10",
    "cerave-hydrating-cleanser",
  ],
  "makeup-mini": [
    "benefit-hoola-mini", // optional future product
    "nars-blush-orgasm",
    "good-girl-mini-7ml",
    "versace-dylan-blue-mini-5ml",
    "gucci-flora-mini-5ml",
    "maybelline-age-rewind-120",
    "rare-beauty-liquid-blush-hope",
    "maybelline-fit-me-loose-15",
  ],
  "full-size": [
    "gucci-flora-gorgeous-magnolia-edp",
    "carolina-herrera-good-girl-edp",
    "versace-dylan-blue-edt",
    "kayali-vanilla-28",
    "mac-strobe-cream-50ml",
    "charlotte-tilbury-setting-spray",
    "urban-decay-all-nighter",
    "clinique-moisture-surge",
    "cerave-moisturizing-cream",
  ],
  "body-mist": [
    "bath-body-works-warm-vanilla-sugar-mist",
    "victorias-secret-love-spell-mist",
    "plum-hawaiian-rumba-mist",
    "engage-on-woman-mist",
  ],
  perfume: [
    "gucci-flora-gorgeous-magnolia-edp",
    "carolina-herrera-good-girl-edp",
    "versace-dylan-blue-edt",
    "maison-margiela-replica-beach-walk",
    "kayali-vanilla-28",
    "lattafa-yara-edp",
    "rasasi-hawas-women",
    "ajmal-aurum",
    "arabian-oud-madawi",
  ],
  "arabic-perfume": [
    "lattafa-yara-edp",
    "rasasi-hawas-women",
    "ajmal-aurum",
    "arabian-oud-madawi",
  ],
  "perfume-mini": [
    "good-girl-mini-7ml",
    "versace-dylan-blue-mini-5ml",
    "gucci-flora-mini-5ml",
  ],
  foundation: [
    "maybelline-fit-me-128",
    "estee-lauder-double-wear-2w1",
    "dior-forever-skin-glow-2n",
  ],
  concealer: ["nars-soft-matte-concealer", "maybelline-age-rewind-120"],
  "skin-tint": ["milani-supercharged-skin-tint", "nykaa-skin-shield-tint"],
  primer: ["smashbox-photo-finish-primer", "mac-strobe-cream-50ml"],
  "strobe-cream": ["mac-strobe-cream-50ml"],
};

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

  // helper (put near the top of the file)
  const jsonAsObject = (v: Prisma.JsonValue) =>
    typeof v === "object" && v !== null && !Array.isArray(v)
      ? (v as Prisma.JsonObject)
      : {};

  // Add default blocks to Default theme (Announcement-Bar, Menu, Footer, Infinite Scroll)
  const annBar = await prisma.designElementCatalog.findUnique({
    where: { code: "announcement_bar" },
  });

  const topNav = await prisma.designElementCatalog.findUnique({
    where: { code: "top_nav" },
  });
  const bottomNav = await prisma.designElementCatalog.findUnique({
    where: { code: "bottom_nav" },
  });
  const infinite = await prisma.designElementCatalog.findUnique({
    where: { code: "products_infinite_scroll" },
  });

  const storeHero = await prisma.designElementCatalog.findUnique({
    where: { code: "store_hero" },
  });

  const storeStats = await prisma.designElementCatalog.findUnique({
    where: { code: "store_stats" },
  });

  const delivery = await prisma.designElementCatalog.findUnique({
    where: { code: "store_delivery_info" },
  });

  const fsHero = await prisma.designElementCatalog.findUnique({
    where: { code: "flash_sale_hero" },
  });

  const socialStrip = await prisma.designElementCatalog.findUnique({
    where: { code: "social_proof_strip" },
  });

  const storyHighlights = await prisma.designElementCatalog.findUnique({
    where: { code: "story_highlights" },
  });

  const offersCollections = await prisma.designElementCatalog.findUnique({
    where: { code: "offers_collections" },
  });

  const testimonials = await prisma.designElementCatalog.findUnique({
    where: { code: "customer_testimonials" },
  });
  const aboutUs = await prisma.designElementCatalog.findUnique({
    where: { code: "about_us" },
  });

  const mainCoupon = await prisma.designElementCatalog.findUnique({
    where: { code: "main_coupon" },
  });
  const storeInfo = await prisma.designElementCatalog.findUnique({
    where: { code: "store_info" },
  });

  if (
    topNav &&
    bottomNav &&
    infinite &&
    annBar &&
    storeHero &&
    storeStats &&
    delivery &&
    fsHero &&
    socialStrip &&
    storyHighlights &&
    offersCollections &&
    testimonials &&
    aboutUs &&
    mainCoupon &&
    storeInfo
  ) {
    const nowPlus6h = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    const allCategorySlugs = CATEGORY_LIST.map((c) => c.slug);

    await prisma.themeDesignElement.createMany({
      data: [
        {
          themeId: defaultTheme.id,
          designElementId: annBar.id,
          name: "Announcement Bar",
          code: "announcement_bar",
          position: 1,
          settings: {
            ...jsonAsObject(annBar.defaultSettings),
            message: "Your announcement here",
            left_button_show: false,
            right_button_show: false,
          } as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: topNav.id,
          name: "Menu",
          code: "top_nav",
          position: 2,
          settings: topNav.defaultSettings as Prisma.InputJsonValue,
        },
        // NEW: Store Hero
        {
          themeId: defaultTheme.id,
          designElementId: storeHero.id,
          name: "Store Hero",
          code: "store_hero",
          position: 3,
          settings: storeHero.defaultSettings as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: storeInfo.id!,
          name: "Store Info",
          code: "store_info",
          position: 4,
          settings: {
            ...jsonAsObject(storeInfo.defaultSettings),
            // You can change this text later in admin
            text:
              "Crafting delicious, homemade treats daily.\n" +
              "Specialising in artisanal breads, cakes, and pastries that bring a touch of sweetness to your life. 🧁",
            align: "left", // left | center | right
            text_color: "#6b7280", // calm grey
            font_size: "text-sm",
            line_height: "leading-6",
          } as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: storeStats!.id,
          name: "Store Stats",
          code: "store_stats",
          position: 5, // shift others accordingly
          settings: storeStats!.defaultSettings as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: delivery.id,
          name: "Delivery Info",
          code: "store_delivery_info",
          position: 6, // unique
          settings: {
            ...(typeof delivery.defaultSettings === "object" &&
            delivery.defaultSettings !== null
              ? delivery.defaultSettings
              : {}),
            // ✅ ONLY supported keys:
            store_name: "SampleStore.co",
            align: "left",
            show_dividers: true,
            accent_color: "#7c3aed",
            min_days: 1,
            max_days: 5,
          } as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: fsHero.id!,
          name: "Flash Sale",
          code: "flash_sale_hero",
          position: 7,
          settings: {
            ...jsonAsObject(fsHero.defaultSettings),
            countdown_end_iso: nowPlus6h,
          } as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: socialStrip.id,
          name: "Social Proof",
          code: "social_proof_strip",
          position: 8,
          settings: socialStrip.defaultSettings as Prisma.InputJsonValue,
        },
        // NEW: Story Highlights
        {
          themeId: defaultTheme.id,
          designElementId: storyHighlights.id,
          name: "Story Highlights",
          code: "story_highlights",
          position: 9,
          settings: storyHighlights.defaultSettings as Prisma.InputJsonValue,
        },
        mainCoupon && {
          themeId: defaultTheme.id,
          designElementId: mainCoupon.id,
          name: "Deals / Coupons",
          code: "main_coupon",
          position: 10, // e.g. after Story Highlights; adjust others if you keep strict unique positions
          settings: mainCoupon.defaultSettings as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: offersCollections.id!,
          name: "Offers / Collections",
          code: "offers_collections",
          position: 11,
          settings: offersCollections.defaultSettings as Prisma.InputJsonValue,
        },
        // ⭐️ DEFAULT products_infinite_scroll with category list prefilled
        {
          themeId: defaultTheme.id,
          designElementId: infinite!.id,
          name: "Products Infinite Scroll",
          code: "products_infinite_scroll",
          position: 12,
          settings: {
            ...(typeof infinite?.defaultSettings === "object" &&
            infinite?.defaultSettings !== null
              ? infinite!.defaultSettings
              : {}),
            title: "Explore all",
            subtitle: "Discover our full collection, just for you.",
            // this fallback list is read by the FE if /categories exists it will use that,
            // but still good to prefill. We pass slugs so your FE can call /api/products?category=<slug>.
            custom_category_list: allCategorySlugs,
            product_display_order: "ALPHABETICAL",
          } as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: testimonials.id!,
          name: "Customer Testimonials",
          code: "customer_testimonials",
          position: 13,
          settings: {
            ...jsonAsObject(testimonials.defaultSettings),
            // (optional) tweak defaults here:
            title: "What our clients say",
            display_subtitle: false,
          } as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: aboutUs!.id,
          name: "About Us",
          code: "about_us",
          position: 14, // after Delivery Info (old 6+ shift others if needed)
          settings: aboutUs!.defaultSettings as Prisma.InputJsonValue,
        },
        {
          themeId: defaultTheme.id,
          designElementId: bottomNav.id,
          name: "Footer",
          code: "bottom_nav",
          position: 15,
          settings: bottomNav.defaultSettings as Prisma.InputJsonValue,
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
          name: "Menu",
          customName: "Menu",
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

  // --- (2) Seed demo products (beauty + a few gadgets) ----------------
  const demoProducts = [
    // — Perfume (incl. minis)
    {
      name: "Gucci Flora Gorgeous Magnolia EDP",
      slug: "gucci-flora-gorgeous-magnolia-edp",
      price: 99900,
      popularity: 82,
      images: [
        "https://storage.googleapis.com/shy-pub/281007/1671804864551_skr58123sukkhioriginalimafzhbug9zwjat6.jpeg",
        "https://storage.googleapis.com/shy-pub/281007/1671804864551_skr58123sukkhioriginalimafzhbug9zwjat6.jpeg",
      ],
    },
    {
      name: "Carolina Herrera Good Girl EDP",
      slug: "carolina-herrera-good-girl-edp",
      price: 89900,
      popularity: 85,
      images: [
        "https://storage.googleapis.com/shy-pub/281007/1671805309299_ss858slushymushyoriginalimafd89eyqzgk3vq.jpeg",
        "https://i.imgur.com/4W2x2KZ.jpeg",
      ],
    },
    {
      name: "Versace Dylan Blue EDT",
      slug: "versace-dylan-blue-edt",
      price: 79900,
      popularity: 70,
      images: ["https://i.imgur.com/fy1o0sA.jpeg"],
    },
    {
      name: "Maison Margiela Replica Beach Walk",
      slug: "maison-margiela-replica-beach-walk",
      price: 109900,
      popularity: 68,
      images: ["https://i.imgur.com/X8xYcZS.jpeg"],
    },
    {
      name: "KAYALI Vanilla | 28",
      slug: "kayali-vanilla-28",
      price: 74900,
      popularity: 66,
      images: ["https://i.imgur.com/2nZx3pC.jpeg"],
    },
    {
      name: "Good Girl Mini 7ml",
      slug: "good-girl-mini-7ml",
      price: 19900,
      popularity: 64,
      images: ["https://i.imgur.com/9kG0yYE.jpeg"],
    },
    {
      name: "Versace Dylan Blue Mini 5ml",
      slug: "versace-dylan-blue-mini-5ml",
      price: 17900,
      popularity: 59,
      images: ["https://i.imgur.com/0r3L7y3.jpeg"],
    },
    {
      name: "Gucci Flora Mini 5ml",
      slug: "gucci-flora-mini-5ml",
      price: 19900,
      popularity: 58,
      images: ["https://i.imgur.com/4k4R3mP.jpeg"],
    },

    // — Arabic Perfume
    {
      name: "Lattafa Yara EDP",
      slug: "lattafa-yara-edp",
      price: 19900,
      popularity: 77,
      images: ["https://i.imgur.com/nYl2c0V.jpeg"],
    },
    {
      name: "Rasasi Hawas for Her",
      slug: "rasasi-hawas-women",
      price: 39900,
      popularity: 73,
      images: ["https://i.imgur.com/6kJk0K3.jpeg"],
    },
    {
      name: "Ajmal Aurum",
      slug: "ajmal-aurum",
      price: 32900,
      popularity: 60,
      images: ["https://i.imgur.com/5yQm0o2.jpeg"],
    },
    {
      name: "Arabian Oud Madawi",
      slug: "arabian-oud-madawi",
      price: 149900,
      popularity: 69,
      images: ["https://i.imgur.com/s8w2kJw.jpeg"],
    },

    // — Body Mist (some were in rupees earlier; we normalize below)
    {
      name: "Bath & Body Works Warm Vanilla Sugar Mist",
      slug: "bath-body-works-warm-vanilla-sugar-mist",
      price: 1999,
      popularity: 67,
      images: ["https://i.imgur.com/bqv8lZc.jpeg"],
    },
    {
      name: "Victoria’s Secret Love Spell Mist",
      slug: "victorias-secret-love-spell-mist",
      price: 2499,
      popularity: 71,
      images: ["https://i.imgur.com/Z1VYb6F.jpeg"],
    },
    {
      name: "Plum BodyLovin’ Hawaiian Rumba Mist",
      slug: "plum-hawaiian-rumba-mist",
      price: 399,
      popularity: 63,
      images: ["https://i.imgur.com/T3bX7kA.jpeg"],
    },
    {
      name: "Engage ON Woman Body Mist",
      slug: "engage-on-woman-mist",
      price: 249,
      popularity: 55,
      images: ["https://i.imgur.com/8e8Gv5V.jpeg"],
    },

    // — Complexion
    {
      name: "Maybelline Fit Me 128",
      slug: "maybelline-fit-me-128",
      price: 54900,
      popularity: 74,
      images: ["https://i.imgur.com/L2r8kQW.jpeg"],
    },
    {
      name: "Estée Lauder Double Wear 2W1",
      slug: "estee-lauder-double-wear-2w1",
      price: 389900,
      popularity: 71,
      images: ["https://i.imgur.com/1jK2k7K.jpeg"],
    },
    {
      name: "Dior Forever Skin Glow 2N",
      slug: "dior-forever-skin-glow-2n",
      price: 449900,
      popularity: 64,
      images: ["https://i.imgur.com/3kz0XoX.jpeg"],
    },
    {
      name: "NARS Soft Matte Concealer",
      slug: "nars-soft-matte-concealer",
      price: 289900,
      popularity: 78,
      images: ["https://i.imgur.com/2wzK7F8.jpeg"],
    },
    {
      name: "Maybelline Age Rewind 120",
      slug: "maybelline-age-rewind-120",
      price: 49900,
      popularity: 72,
      images: ["https://i.imgur.com/9sQ6r4e.jpeg"],
    },
    {
      name: "Milani Supercharged Skin Tint",
      slug: "milani-supercharged-skin-tint",
      price: 89900,
      popularity: 61,
      images: ["https://i.imgur.com/0n3p9yH.jpeg"],
    },
    {
      name: "Nykaa Skin Shield Tint",
      slug: "nykaa-skin-shield-tint",
      price: 79900,
      popularity: 55,
      images: ["https://i.imgur.com/d3n8m4K.jpeg"],
    },

    // — Prep/Finish
    {
      name: "Smashbox Photo Finish Primer",
      slug: "smashbox-photo-finish-primer",
      price: 189900,
      popularity: 70,
      images: ["https://i.imgur.com/1V7QeWk.jpeg"],
    },
    {
      name: "MAC Strobe Cream 50ml",
      slug: "mac-strobe-cream-50ml",
      price: 340000,
      popularity: 73,
      images: ["https://i.imgur.com/L6h3Fh5.jpeg"],
    },
    {
      name: "Charlotte Tilbury Setting Spray",
      slug: "charlotte-tilbury-setting-spray",
      price: 329900,
      popularity: 80,
      images: ["https://i.imgur.com/7nV9m8N.jpeg"],
    },
    {
      name: "Urban Decay All Nighter",
      slug: "urban-decay-all-nighter",
      price: 329900,
      popularity: 76,
      images: ["https://i.imgur.com/2oVd2KO.jpeg"],
    },

    // — Color
    {
      name: "NARS Blush Orgasm",
      slug: "nars-blush-orgasm",
      price: 299900,
      popularity: 81,
      images: ["https://i.imgur.com/r8v2h3a.jpeg"],
    },
    {
      name: "Rare Beauty Soft Pinch Blush (Hope)",
      slug: "rare-beauty-liquid-blush-hope",
      price: 269900,
      popularity: 79,
      images: ["https://i.imgur.com/w1n3W0c.jpeg"],
    },
    {
      name: "Laura Mercier Translucent Powder",
      slug: "laura-mercier-translucent",
      price: 339900,
      popularity: 77,
      images: ["https://i.imgur.com/VV8g0ye.jpeg"],
    },
    {
      name: "Maybelline Fit Me Loose 15",
      slug: "maybelline-fit-me-loose-15",
      price: 69900,
      popularity: 65,
      images: ["https://i.imgur.com/RdB9o1B.jpeg"],
    },
    {
      name: "BECCA Champagne Pop",
      slug: "becca-champagne-pop",
      price: 329900,
      popularity: 69,
      images: ["https://i.imgur.com/2o8cC9z.jpeg"],
    },
    {
      name: "MAC Soft & Gentle",
      slug: "mac-soft-gentle",
      price: 329900,
      popularity: 67,
      images: ["https://i.imgur.com/d1V3s2g.jpeg"],
    },
    {
      name: "MAC Ruby Woo",
      slug: "mac-ruby-woo",
      price: 199900,
      popularity: 90,
      images: ["https://i.imgur.com/Tl1q6Jv.jpeg"],
    },
    {
      name: "Maybelline SuperStay 120",
      slug: "maybelline-superstay-120",
      price: 89900,
      popularity: 74,
      images: ["https://i.imgur.com/2wY9vYk.jpeg"],
    },

    // — Skin/hair
    {
      name: "The Ordinary Niacinamide 10% + Zinc 1%",
      slug: "the-ordinary-niacinamide-10",
      price: 69900,
      popularity: 85,
      images: ["https://i.imgur.com/kz7H8eV.jpeg"],
    },
    {
      name: "L'Oréal Hyaluron Serum",
      slug: "loreal-hyaluron-serum",
      price: 79900,
      popularity: 66,
      images: ["https://i.imgur.com/yT8qfna.jpeg"],
    },
    {
      name: "Clinique Moisture Surge 50ml",
      slug: "clinique-moisture-surge",
      price: 299900,
      popularity: 73,
      images: ["https://i.imgur.com/0GZ8vZc.jpeg"],
    },
    {
      name: "CeraVe Moisturizing Cream",
      slug: "cerave-moisturizing-cream",
      price: 129900,
      popularity: 83,
      images: [
        "https://storage.googleapis.com/shy-pub/281007/1671805065146_12cg24812campusbluskyoriginalimaggp89f6zfxpss.jpeg",
      ],
    },
    {
      name: "Bioré UV Aqua Rich",
      slug: "biore-uv-aqua-rich",
      price: 109900,
      popularity: 88,
      images: ["https://i.imgur.com/XqX4m6B.jpeg"],
    },
    {
      name: "La Roche-Posay Anthelios",
      slug: "la-roche-posay-anthelios",
      price: 229900,
      popularity: 86,
      images: ["https://i.imgur.com/1Yc2xgA.jpeg"],
    },
    {
      name: "Laneige Cream Skin Toner",
      slug: "laneige-cream-skin-toner",
      price: 229900,
      popularity: 62,
      images: ["https://i.imgur.com/PlKJbA7.jpeg"],
    },
    {
      name: "Pixi Glow Tonic 100ml",
      slug: "pixi-glow-tonic",
      price: 149900,
      popularity: 72,
      images: ["https://i.imgur.com/z0QGkJ1.jpeg"],
    },
    {
      name: "CeraVe Hydrating Cleanser",
      slug: "cerave-hydrating-cleanser",
      price: 129900,
      popularity: 84,
      images: ["https://i.imgur.com/0v1qE0N.jpeg"],
    },
    {
      name: "Simple Refreshing Face Wash",
      slug: "simple-refreshing",
      price: 39900,
      popularity: 60,
      images: ["https://i.imgur.com/PzH7T6L.jpeg"],
    },
    {
      name: "St. Ives Apricot Scrub",
      slug: "st-ives-apricot-scrub",
      price: 34900,
      popularity: 58,
      images: ["https://i.imgur.com/7oE5o0C.jpeg"],
    },
    {
      name: "The Ordinary Caffeine Solution",
      slug: "the-ordinary-caffeine-solution",
      price: 89900,
      popularity: 63,
      images: ["https://i.imgur.com/7QHq2hR.jpeg"],
    },
    {
      name: "Banila Co Clean It Zero Balm",
      slug: "banila-clean-it-zero",
      price: 159900,
      popularity: 79,
      images: ["https://i.imgur.com/2Qx0m8N.jpeg"],
    },
    {
      name: "Selfless by Hyram Cleansing Balm",
      slug: "hyram-cleansing-balm",
      price: 149900,
      popularity: 54,
      images: ["https://i.imgur.com/8Q4cnrM.jpeg"],
    },
    {
      name: "Olaplex No.3",
      slug: "olaplex-no3",
      price: 299900,
      popularity: 75,
      images: ["https://i.imgur.com/V2l0Y9i.jpeg"],
    },
    {
      name: "Moroccanoil Treatment",
      slug: "moroccanoil-treatment",
      price: 199900,
      popularity: 72,
      images: ["https://i.imgur.com/Kbqjv1S.jpeg"],
    },

    // gadgets
    {
      name: "Wireless Headphones Z1",
      slug: "wireless-headphones-z1",
      price: 499900,
      popularity: 50,
      images: [
        "https://images.unsplash.com/photo-1518443895914-7bdc83ed5ebb?q=80&w=900&auto=format&fit=crop",
      ],
    },
    {
      name: "Smartwatch Neo",
      slug: "smartwatch-neo",
      price: 699900,
      popularity: 70,
      images: [
        "https://images.unsplash.com/photo-1516264664731-7e19d01f6b3b?q=80&w=900&auto=format&fit=crop",
      ],
    },
  ];

  // Normalize to paise (fixes the 1999/249/etc rupee entries)
  const normalizePrice = (n: number) =>
    n >= 10000 ? Math.round(n) : Math.round(n * 100);
  const normalizedDemo = demoProducts.map((p) => ({
    ...p,
    price: normalizePrice(p.price),
  }));

  // Upsert all products + images
  const productSlugToId = new Map<string, number>();
  for (const p of normalizedDemo) {
    const up = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        price: p.price, // paise
        popularity: p.popularity,
        isActive: true,
      },
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price, // paise
        popularity: p.popularity,
        currency: "INR",
        isActive: true,
      },
    });
    productSlugToId.set(p.slug, up.id);
    await prisma.productImage.deleteMany({ where: { productId: up.id } });
    await prisma.productImage.createMany({
      data: p.images.map((url, i) => ({ productId: up.id, url, position: i })),
    });
  }
  console.log("Seeded", normalizedDemo.length, "products.");

  // (5) Upsert categories
  const categorySlugToId = new Map<string, number>();
  for (const c of CATEGORY_LIST) {
    const up = await prisma.category.upsert({
      where: { slug: c.slug },
      create: { slug: c.slug, name: c.name },
      update: { name: c.name },
    });
    categorySlugToId.set(c.slug, up.id);
  }
  console.log("Seeded", CATEGORY_LIST.length, "categories.");

  // (6) Link products to categories (5–10 per category from CATEGORY_MAP)
  for (const [catSlug, productSlugs] of Object.entries(CATEGORY_MAP)) {
    const categoryId = categorySlugToId.get(catSlug);
    if (!categoryId) continue;

    // clean existing links
    await prisma.productCategory.deleteMany({ where: { categoryId } });

    const ids = productSlugs
      .map((s) => productSlugToId.get(s))
      .filter((v): v is number => !!v);

    // keep 5-10 links max
    const slice = ids.slice(0, 10);
    if (slice.length === 0) continue;

    await prisma.productCategory.createMany({
      data: slice.map((productId) => ({ productId, categoryId })),
      skipDuplicates: true,
    });
  }
  console.log("Linked products to categories.");

  console.log("Seed completed.");
}

main().finally(() => prisma.$disconnect());
