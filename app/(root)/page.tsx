import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import { getFeaturedProducts, getLatestProducts } from "@/lib/actions/product.actions";

const HomePage = async() => {
  const latestProducts = await getLatestProducts()
  const featuredProducts = await getFeaturedProducts()
  return <>
    {featuredProducts.length && <ProductCarousel data={featuredProducts} />} 
    <ProductList data={latestProducts} title="Newest Arrivals"/>
  </>;
}
 
export default HomePage;