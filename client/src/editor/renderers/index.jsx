// client/src/editor/renderers/index.jsx (or .tsx)
import AboutUs from "./AboutUs";
import AnnouncementBar from "./AnnouncementBar";
import Banner from "./Banner";
import BannerSlider from "./BannerSlider";
import BottomNav from "./BottomNav";
import CategoriesGrid from "./CategoriesGrid";
import CustomerTestimonials from "./CustomerTestimonials";
import CustomHtmlBlock from "./CustomHtmlBlock";
import FlashSaleHero from "./FlashSaleHero";
import MainCoupon from "./MainCoupon";
import OffersCollections from "./OffersCollections";
import ProductsCategorized from "./ProductsCategorized";
import ProductsInfiniteScroll from "./ProductsInfiniteScroll";
import SearchBlock from "./SearchBlock";
import SliderCentered from "./SliderCentered";
import SocialProofStrip from "./SocialProofStrip";
import StoreDeliveryInfo from "./StoreDeliveryInfo";
import StoreHero from "./StoreHero";
import StoreInfo from "./StoreInfo";
import StoreStats from "./StoreStats";
import StoryHighlights from "./StoryHighlights";
import TopNav from "./TopNav";

// eslint-disable-next-line react-refresh/only-export-components
export const registry = {
  top_nav: TopNav,
  bottom_nav: BottomNav,
  products_categorized: ProductsCategorized,
  products_infinite_scroll: ProductsInfiniteScroll,
  categories_grid: CategoriesGrid,
  custom_html_block: CustomHtmlBlock,
  static_banner: Banner,
  slider_centered: SliderCentered,
  search_block: SearchBlock,
  banner_slider: BannerSlider,
  announcement_bar: AnnouncementBar,
  store_hero: StoreHero,
  store_stats: StoreStats,
  store_delivery_info: StoreDeliveryInfo,
  flash_sale_hero: FlashSaleHero,
  social_proof_strip: SocialProofStrip,
  story_highlights: StoryHighlights,
  offers_collections: OffersCollections,
  customer_testimonials: CustomerTestimonials,
  about_us: AboutUs,
  main_coupon: MainCoupon,
  store_info: StoreInfo,
};

export function RenderBlock({ code, settings }) {
  const Cmp = registry[code];
  if (!Cmp)
    return <div className="p-4 border bg-yellow-50">Unknown block: {code}</div>;
  // Wrap with reset container (removes outer top/bottom spacing of blocks)
  return (
    <div className="block-reset">
      <Cmp settings={settings} />
    </div>
  );
}
