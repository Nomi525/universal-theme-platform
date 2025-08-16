import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import ProductsInfiniteScroll from "./ProductsInfiniteScroll";
import ProductHorizontalStrip from "./ProductHorizontalStrip";
import CategoriesGrid from "./CategoriesGrid";
import CustomHtmlBlock from "./CustomHtmlBlock";
import Banner from "./Banner";
import SliderCentered from "./SliderCentered";
import SearchBlock from "./SearchBlock";
import BannerSlider from "./BannerSlider";

// eslint-disable-next-line react-refresh/only-export-components
export const registry = {
  top_nav: TopNav,
  bottom_nav: BottomNav,
  products_infinite_scroll: ProductsInfiniteScroll,
  product_horizontal_strip: ProductHorizontalStrip,
  categories_grid: CategoriesGrid,
  custom_html_block: CustomHtmlBlock,
  static_banner: Banner,
  slider_centered: SliderCentered,
  search_block: SearchBlock,
  banner_slider: BannerSlider,
};

export function RenderBlock({ code, settings }) {
  const Cmp = registry[code];
  if (!Cmp)
    return <div className="p-4 border bg-yellow-50">Unknown block: {code}</div>;
  return <Cmp settings={settings} />;
}