import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, SlidersHorizontal, Star, ShoppingCart, Grid3X3, List } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { LoginRequiredModal } from "./LoginRequiredModal";
import { toast } from "sonner";

const CAT_LABELS: Record<string, string> = { kayu: "Wood", besi: "Metal", baju: "Clothing" };

export function Catalogue() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(searchParams.get("cat") || "all");
  const [sortBy, setSortBy] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setSelectedCat(cat);
  }, [searchParams]);

  const handleAddToCart = (product: typeof products[0]) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    addToCart({ ...product, size: undefined, color: undefined });
    toast.success(`${product.name} added to cart`);
  };

  let filtered = [...products]
    .filter(p => selectedCat === "all" || p.cat === selectedCat)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  if (sortBy === "price-asc") filtered = filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered = filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered = filtered.sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} message="Please log in to add items to your cart." />

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
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="pl-9 bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-9 text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "kayu", "besi", "baju"].map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)}
                className={`px-4 py-1.5 rounded-sm text-sm transition-colors ${selectedCat === cat ? "bg-[#1C1A18] text-white" : "bg-[#F7F3EE] text-[#7A7167] hover:bg-[#EDE8E0]"}`}>
                {cat === "all" ? "All" : CAT_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#7A7167]" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm px-2 py-1.5 text-sm text-[#1C1A18]">
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-[#1C1A18] text-white" : "text-[#7A7167] hover:bg-[#EDE8E0]"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-[#1C1A18] text-white" : "text-[#7A7167] hover:bg-[#EDE8E0]"}`}>
              <List className="w-4 h-4" />
            </button>
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
                    <Badge className={`text-xs border-0 ${product.cat === "kayu" ? "bg-amber-100 text-amber-800" : product.cat === "besi" ? "bg-slate-100 text-slate-700" : "bg-rose-100 text-rose-700"}`}>
                      {CAT_LABELS[product.cat]}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-[#7A7167]">
                      <Star className="w-3 h-3 fill-[#B07D45] text-[#B07D45]" />{product.rating || "New"}
                    </div>
                  </div>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium text-[#1C1A18] mt-1 mb-2 hover:text-[#B07D45] transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1C1A18]">RM {product.price.toLocaleString()}</span>
                    <button onClick={() => handleAddToCart(product)}
                      className="p-2 bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm transition-colors">
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
                    <Badge className={`text-xs border-0 mb-1 ${product.cat === "kayu" ? "bg-amber-100 text-amber-800" : product.cat === "besi" ? "bg-slate-100 text-slate-700" : "bg-rose-100 text-rose-700"}`}>
                      {CAT_LABELS[product.cat]}
                    </Badge>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-[#1C1A18] hover:text-[#B07D45] transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-[#7A7167] mt-1">
                      <Star className="w-3 h-3 fill-[#B07D45] text-[#B07D45]" />{product.rating || "New"} · {product.reviews || 0} reviews
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-[#1C1A18] text-lg">RM {product.price.toLocaleString()}</span>
                    <button onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1C1A18] hover:bg-[#B07D45] text-white text-sm rounded-sm transition-colors">
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
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}