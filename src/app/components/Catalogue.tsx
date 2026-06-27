import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, SlidersHorizontal, Star, ShoppingCart, Grid3X3, List } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { LoginRequiredModal } from "./LoginRequiredModal";
import { toast } from "sonner";

const ALL_PRODUCTS = [
  { id: 1, name: "Teak Dining Table", cat: "kayu", price: 1200, rating: 4.8, reviews: 34, image: "https://theteakline.com/wp-content/uploads/2026/02/opera-dining-table-2-the-teak-line.png", stock: 8 },
  { id: 2, name: "Mahogany Bookshelf", cat: "kayu", price: 890, rating: 4.9, reviews: 27, image: "https://www.bigw.com.au/medias/sys_master/images/images/h79/h4a/97284761780254.jpg", stock: 5 },
  { id: 3, name: "Oak Side Table", cat: "kayu", price: 340, rating: 4.6, reviews: 18, image: "https://images.thdstatic.com/productImages/f0cc09df-0472-41d9-9071-f994698460e7/svn/oak-lirago-end-side-tables-hd-tjs400-64_600.jpg", stock: 12 },
  { id: 4, name: "Wooden Jewellery Box", cat: "kayu", price: 95, rating: 4.7, reviews: 44, image: "https://down-my.img.susercontent.com/file/6477a7db7e49696e609dc10d4426c8b4", stock: 20 },
  { id: 5, name: "Rattan Wall Decor", cat: "kayu", price: 180, rating: 4.5, reviews: 29, image: "https://down-my.img.susercontent.com/file/cn-11134207-7ras8-m55f7yehpzc1a4", stock: 15 },
  { id: 6, name: "Steel Clothes Drying Rack", cat: "besi", price: 185, rating: 4.6, reviews: 52, image: "https://images.thdstatic.com/productImages/61fb8e26-c53d-423e-890c-3eca8e1ddb9b/svn/white-37-boyel-living-clothes-drying-racks-bljz10467-64_1000.jpg", stock: 30 },
  { id: 7, name: "Industrial Shelf Unit", cat: "besi", price: 420, rating: 4.8, reviews: 21, image: "https://m.media-amazon.com/images/I/81uSA7EeBEL._AC_UF894,1000_QL80_.jpg", stock: 10 },
  { id: 8, name: "Metal Locker Cabinet", cat: "besi", price: 650, rating: 4.5, reviews: 16, image: "https://i5.walmartimages.com/asr/fcf64f30-28c1-4a11-bbec-0e97e018aaa6.144964fe56069ff12aebb3436a1e2187.jpeg", stock: 7 },
  { id: 9, name: "Iron Coat Rack", cat: "besi", price: 120, rating: 4.7, reviews: 38, image: "https://images.thdstatic.com/productImages/f8867afdb47b41f58578f80bf56f71db/svn/black-umbrella-stands-ph00559b498-64_1000.jpg", stock: 22 },
  { id: 10, name: "Steel Workbench", cat: "besi", price: 780, rating: 4.9, reviews: 12, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShohWysB3tj7VrqYTo-u7-CnA1XlJJod_pmrhDkQPlFZXFQDbHC32qK8sF&s=10", stock: 6 },
  { id: 11, name: "Classic Cotton Polo", cat: "baju", price: 65, rating: 4.7, reviews: 91, image: "https://m.media-amazon.com/images/I/81Qk6j07qEL._AC_UY1000_.jpg", stock: 50 },
  { id: 12, name: "Heavy Duty Work Shirt", cat: "baju", price: 89, rating: 4.8, reviews: 63, image: "https://heavydutywear.ca/cdn/shop/files/4074NB_1.jpg?v=1738621840&width=900", stock: 40 },
  { id: 13, name: "Linen Casual Shirt", cat: "baju", price: 78, rating: 4.5, reviews: 47, image: "https://image.made-in-china.com/2f0j00MSOkwcbGiqcn/Men-s-High-Quality-Linen-Long-Sleeve-Linen-Summer-Loose-Casual-Cotton-Shirt-for-Man.jpg", stock: 35 },
  { id: 14, name: "Custom Print T-Shirt", cat: "baju", price: 55, rating: 4.6, reviews: 120, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=300&fit=crop&auto=format", stock: 60 },
{ id: 15, name: "Formal Batik Shirt", cat: "baju", price: 110, rating: 4.9, reviews: 38, image: "https://poya.com.my/cdn/shop/articles/Screenshot_2024-01-15_at_10.44.26_AM.png?v=1705286673", stock: 25 },
];

const CAT_LABELS: Record<string, string> = { kayu: "Wood", besi: "Metal", baju: "Clothing" };

export function Catalogue() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("cat") || "all");
  const [sortBy, setSortBy] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setSelectedCat(cat);
  }, [searchParams]);

  const handleAddToCart = (product: typeof ALL_PRODUCTS[0]) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    addToCart({ ...product, size: undefined, color: undefined });
    toast.success(`${product.name} added to cart`);
  };

  let filtered = ALL_PRODUCTS
    .filter(p => selectedCat === "all" || p.cat === selectedCat)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to add items to your cart."
      />

      <div className="bg-[#1C1A18] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-2">Explore Our Range</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-white">Product Catalogue</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-sm p-4 mb-8 flex flex-wrap gap-4 items-center shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7167]" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9 bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-9 text-sm" />
          </div>
          <div className="flex gap-2">
            {["all", "kayu", "besi", "baju"].map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)} className={`px-4 py-1.5 rounded-sm text-sm transition-colors capitalize ${selectedCat === cat ? "bg-[#1C1A18] text-white" : "bg-[#F7F3EE] text-[#7A7167] hover:bg-[#EDE8E0]"}`}>
                {cat === "all" ? "All" : CAT_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#7A7167]">
            <SlidersHorizontal className="w-4 h-4" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm px-2 py-1.5 text-sm text-[#1C1A18]">
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-[#1C1A18] text-white" : "text-[#7A7167] hover:bg-[#EDE8E0]"}`}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-[#1C1A18] text-white" : "text-[#7A7167] hover:bg-[#EDE8E0]"}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex gap-3 text-sm text-[#7A7167] mb-6">
          <span>{filtered.length} products found</span>
          {selectedCat !== "all" && <Badge className="bg-[#B07D45]/10 text-[#B07D45] border-0">{CAT_LABELS[selectedCat]}</Badge>}
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <div key={product.id} className="group bg-white rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-[4/3] overflow-hidden bg-[#EDE8E0]">
                    <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={`text-xs border-0 ${product.cat === "kayu" ? "bg-amber-100 text-amber-800" : product.cat === "besi" ? "bg-slate-100 text-slate-700" : "bg-rose-100 text-rose-700"}`}>{CAT_LABELS[product.cat]}</Badge>
                    <div className="flex items-center gap-1 text-xs text-[#7A7167]"><Star className="w-3 h-3 fill-[#B07D45] text-[#B07D45]" />{product.rating}</div>
                  </div>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium text-[#1C1A18] mt-1 mb-2 hover:text-[#B07D45] transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1C1A18]">RM {product.price.toLocaleString()}</span>
                    <button onClick={() => handleAddToCart(product)} className="p-2 bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(product => (
              <div key={product.id} className="group bg-white rounded-sm overflow-hidden hover:shadow-md transition-shadow flex">
                <div className="w-40 h-32 flex-shrink-0 overflow-hidden bg-[#EDE8E0]">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex-1 flex items-center justify-between">
                  <div>
                    <Badge className={`text-xs border-0 mb-1 ${product.cat === "kayu" ? "bg-amber-100 text-amber-800" : product.cat === "besi" ? "bg-slate-100 text-slate-700" : "bg-rose-100 text-rose-700"}`}>{CAT_LABELS[product.cat]}</Badge>
                    <Link to={`/product/${product.id}`}><h3 className="font-medium text-[#1C1A18] hover:text-[#B07D45] transition-colors">{product.name}</h3></Link>
                    <div className="flex items-center gap-1 text-xs text-[#7A7167] mt-1"><Star className="w-3 h-3 fill-[#B07D45] text-[#B07D45]" />{product.rating} · {product.reviews} reviews</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-[#1C1A18] text-lg">RM {product.price.toLocaleString()}</span>
                    <button onClick={() => handleAddToCart(product)} className="flex items-center gap-2 px-4 py-2 bg-[#1C1A18] hover:bg-[#B07D45] text-white text-sm rounded-sm transition-colors">
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#7A7167]">
            <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}