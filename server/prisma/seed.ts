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
      fields: [
        {
          path: "outer_background_color",
          type: "color",
          label: "Outer Background",
        },
        { path: "background_color", type: "color", label: "Input Background" },
        { path: "placeholder_text", type: "text", label: "Placeholder Text" },
        {
          path: "placeholder_text_color",
          type: "color",
          label: "Placeholder Color",
        },
        {
          path: "display_search_icon",
          type: "boolean",
          label: "Show Search Icon",
        },
        { path: "search_icon_color", type: "color", label: "Icon Color" },
        { path: "border", type: "boolean", label: "Border" },
        {
          path: "border_size",
          type: "select",
          label: "Border Size",
          options: ["0px", "1px", "2px"],
        },
        { path: "border_color", type: "color", label: "Border Color" },
        {
          path: "radius",
          type: "select",
          label: "Corner Radius",
          options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
        },
        { path: "sticky_search_bar", type: "boolean", label: "Sticky" },
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
      fields: [
        { path: "display_title", type: "boolean", label: "Show Title" },
        { path: "section_title", type: "text", label: "Title Text" },
        { path: "section_title_color", type: "color", label: "Title Color" },
        { path: "grid_column_count", type: "number", label: "Columns" },
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
          options: ["text-xs", "text-sm", "text-base", "text-lg"],
        },
        { path: "category_name_color", type: "color", label: "Name Color" },
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
  },
  {
    name: "Products Infinite Scroll",
    code: "products_infinite_scroll",
    defaultSettings: {
      product_layout_type: "3",
      section_background_color: "#ffffff",
      display_title: true,
      title: "Explore all",
      title_color: "#111827",
      display_subtitle: true,
      subtitle: "Discover our full collection, just for you.",
      subtitle_color: "#1f2937",
      product_display_order: "ALPHABETICAL",
      image_slideshow: true,
      animation_style: "FADE",
      slideshow_delay: 2000,
      section_top_margin: "0rem",
      section_bottom_margin: "1.5rem",
      custom_css: null,
      visibility: "all",
      load_more_text: "Show More Products",
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
  },
  {
    name: "Footer",
    code: "bottom_nav",
    defaultSettings: {
      footer_type: "blur_float",
      footer_background_color: "#ffffff",
      footer_text_color: "#4b5563",
      footer_text_active_color: "#030712",
      show_discount_banner: false,
      selected_discount_id: null,
      custom_css: null,
      visibility: "all",
      home_icon: "ri-home-5-line",
      search_icon: "ri-search-line",
      cart_icon: "ri-shopping-cart-line",
      account_icon: "ri-user-line",
      show_desktop_footer: false,
      show_desktop_footer_in_mobile_too: true,
      desktop_footer_background_color: "#f3f4f6",
      desktop_footer_title_color: "#111827",
      desktop_footer_text_color: "#6b7280",
      desktop_footer_link_color: "#111827",
      desktop_footer_about_us_title: "About Us",
      desktop_footer_about_us_content:
        "Welcome to our store! We're here to bring you quality products and services with convenience, care, and trust.",
      desktop_footer_links_title: "Links",
      desktop_footer_links: [],
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

  console.log("Seed completed.");
}

main().finally(() => prisma.$disconnect());
