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
  { id: 2, name: "Mahogany Bookshelf", cat: "kayu", price: 890, rating: 4.9, reviews: 27, image: "https://www.lockstockandbarrel-uk.com/Admin/uploads/mahogany-bookcase-with-2-shelves-(side).jpg", stock: 5 },
  { id: 3, name: "Oak Side Table", cat: "kayu", price: 340, rating: 4.6, reviews: 18, image: "https://www.oakfurnitureking.co.uk/media/catalog/product/cache/879eab5c65e962e632059f3f7c4eaf9a/d/a/dakota-lamp-table-2.jpg", stock: 12 },
  { id: 4, name: "Wooden Jewellery Box", cat: "kayu", price: 95, rating: 4.7, reviews: 44, image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400&h=300&fit=crop&auto=format", stock: 20 },
  { id: 5, name: "Rattan Wall Decor", cat: "kayu", price: 180, rating: 4.5, reviews: 29, image: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=400&h=300&fit=crop&auto=format", stock: 15 },
  { id: 6, name: "Steel Clothes Drying Rack", cat: "besi", price: 185, rating: 4.6, reviews: 52, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE-3ftXvnHMC15DgrUXWDe_jLRQi1rTa4MwscTlsGwtd0_KOoji7t1crk&s=10", stock: 30 },
  { id: 7, name: "Industrial Shelf Unit", cat: "besi", price: 420, rating: 4.8, reviews: 21, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format", stock: 10 },
  { id: 8, name: "Metal Locker Cabinet", cat: "besi", price: 650, rating: 4.5, reviews: 16, image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRkWHZoi8aMcKztE1OwUl7H7EwqiesujHJvpO51KCBPwZIAVwGHFfgGtfV3ljxbKvSWpynUyzN5flOKvazWjF6-TSOt3Mq7NuFxKO1nojJsTWDLbXmdkjyOKuxR", stock: 7 },
  { id: 9, name: "Iron Coat Rack", cat: "besi", price: 120, rating: 4.7, reviews: 38, image: "https://cdn20.pamono.com/p/s/1/7/1720749_63xs3889kh/large-wrought-iron-coat-rack-1980s.jpg", stock: 22 },
  { id: 10, name: "Steel Workbench", cat: "besi", price: 780, rating: 4.9, reviews: 12, image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop&auto=format", stock: 6 },
  { id: 11, name: "Classic Cotton Polo", cat: "baju", price: 65, rating: 4.7, reviews: 91, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=300&fit=crop&auto=format", stock: 50 },
  { id: 12, name: "Heavy Duty Work Shirt", cat: "baju", price: 89, rating: 4.8, reviews: 63, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=300&fit=crop&auto=format", stock: 40 },
  { id: 13, name: "Linen Casual Shirt", cat: "baju", price: 78, rating: 4.5, reviews: 47, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop&auto=format", stock: 35 },
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