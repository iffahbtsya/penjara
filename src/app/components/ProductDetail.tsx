import { useState } from "react";
import { Link, useParams } from "react-router";
import { Star, ShoppingCart, Heart, Check, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { LoginRequiredModal } from "./LoginRequiredModal";
import { toast } from "sonner";

const PRODUCTS: Record<number, {
  id: number; name: string; cat: "kayu" | "besi" | "baju";
  price: number; rating: number; reviews: number; image: string;
  gallery: string[]; description: string; material: string;
  dimensions?: string; sizes?: string[]; colors?: string[];
  stock: number;
}> = {
  1: { id: 1, name: "Teak Dining Table", cat: "kayu", price: 1200, rating: 4.8, reviews: 34, image: "https://theteakline.com/wp-content/uploads/2026/02/opera-dining-table-2-the-teak-line.png", gallery: ["https://www.casateak.com/wp-content/uploads/2017/09/20170319_113427-scaled-1.jpg", "https://royalnilambur.com/_next/image?url=https%3A%2F%2Fapi.royalnilambur.com%2Frails%2Factive_storage%2Fblobs%2Fproxy%2FeyJfcmFpbHMiOnsiZGF0YSI6ImJjMjQ2NTFmLWQxNDUtNGYzMC1hNDAwLTcyZjJhNmZiNjM0YSIsInB1ciI6ImJsb2JfaWQifX0%3D--1f0732981dced07ac9ea0fc4f3f63d432b6c6c84%2Froyal-dhyonix-nilambur-teak-wood-dining-table-with-glass-top-royal-nilambur.png&w=1920&q=75", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfZ8W447VsF5RhpuKS1OlR7qGhG-gXWve7XQ&s"], description: "A beautifully handcrafted solid teak dining table, built to last for generations. Finished with natural oil to bring out the rich grain of the wood. Seats 6 comfortably.", material: "Grade A Solid Teak, Natural Oil Finish", dimensions: "180cm × 90cm × 75cm", stock: 8 },
  2: { id: 2, name: "Mahogany Bookshelf", cat: "kayu", price: 890, rating: 4.9, reviews: 27, image: "https://www.bigw.com.au/medias/sys_master/images/images/h79/h4a/97284761780254.jpg", gallery: ["https://www.adairs.com.au/cdn-cgi/image/fit=scale-down,quality=85,format=auto,width=800/globalassets/13.-ecommerce/03.-product-images/2024_images/furniture/storage--shelves/57141_oak_01.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvBU3yawqzlbQbZ1gzsqcWsMxy3W29t0eHi5AuVJTagi-CsvmfaDR9gEu1&s=10"], description: "Solid mahogany bookshelf with 5 adjustable shelves. Classic joinery with a smooth lacquer finish that protects the rich reddish-brown grain.", material: "Solid Mahogany, Lacquer Finish", dimensions: "90cm × 30cm × 190cm", stock: 5 },
  3: { id: 3, name: "Oak Side Table", cat: "kayu", price: 340, rating: 4.6, reviews: 18, image: "https://images.thdstatic.com/productImages/f0cc09df-0472-41d9-9071-f994698460e7/svn/oak-lirago-end-side-tables-hd-tjs400-64_600.jpg", gallery: [], description: "Minimalist oak side table with tapered legs. Perfect beside a sofa or bed.", material: "Solid Oak, Matte Wax Finish", dimensions: "45cm × 45cm × 55cm", stock: 12 },
  4: { id: 4, name: "Wooden Jewellery Box", cat: "kayu", price: 95, rating: 4.7, reviews: 44, image: "https://down-my.img.susercontent.com/file/6477a7db7e49696e609dc10d4426c8b4", gallery: [], description: "Intricately carved jewellery box with velvet-lined interior and brass hinge. Makes a perfect gift.", material: "Teak & Rosewood Veneer, Velvet Interior", stock: 20 },
  5: { id: 5, name: "Rattan Wall Decor", cat: "kayu", price: 180, rating: 4.5, reviews: 29, image: "https://down-my.img.susercontent.com/file/cn-11134207-7ras8-m55f7yehpzc1a4", gallery: [], description: "Hand-woven rattan wall art panel with geometric pattern. Adds warmth and texture to any room.", material: "Natural Rattan, Hand-woven", dimensions: "60cm × 60cm", stock: 15 },
  6: { id: 6, name: "Steel Clothes Drying Rack", cat: "besi", price: 185, rating: 4.6, reviews: 52, image: "https://images.thdstatic.com/productImages/61fb8e26-c53d-423e-890c-3eca8e1ddb9b/svn/white-37-boyel-living-clothes-drying-racks-bljz10467-64_1000.jpg", gallery: [], description: "Heavy-duty powder-coated steel drying rack with 3 telescoping bars. Folds flat for easy storage. Weight capacity: 15kg.", material: "Powder-Coated Carbon Steel", dimensions: "120cm × 55cm × 90cm (extended)", stock: 30 },
  7: { id: 7, name: "Industrial Shelf Unit", cat: "besi", price: 420, rating: 4.8, reviews: 21, image: "https://m.media-amazon.com/images/I/81uSA7EeBEL._AC_UF894,1000_QL80_.jpg", gallery: [], description: "5-tier industrial steel shelf unit with adjustable brackets. Perfect for warehouses, garages, or modern interiors. Load capacity 50kg per shelf.", material: "Cold-Rolled Steel, Epoxy Powder Coat", dimensions: "90cm × 40cm × 180cm", stock: 10 },
  8: { id: 8, name: "Metal Locker Cabinet", cat: "besi", price: 650, rating: 4.5, reviews: 16, image: "https://i5.walmartimages.com/asr/fcf64f30-28c1-4a11-bbec-0e97e018aaa6.144964fe56069ff12aebb3436a1e2187.jpeg", gallery: [], description: "4-door steel locker cabinet with individual keys. Built for schools, gyms, and offices. Ventilated panels prevent moisture build-up.", material: "CRCA Steel, Electrostatically Coated", dimensions: "30cm × 45cm × 180cm per door", stock: 7 },
  9: { id: 9, name: "Iron Coat Rack", cat: "besi", price: 120, rating: 4.7, reviews: 38, image: "https://images.thdstatic.com/productImages/f8867afdb47b41f58578f80bf56f71db/svn/black-umbrella-stands-ph00559b498-64_1000.jpg", gallery: [], description: "Wrought iron freestanding coat rack with 8 hooks and umbrella base. Classic industrial design that complements any interior.", material: "Wrought Iron, Matte Black Finish", dimensions: "40cm base × 170cm tall", stock: 22 },
  10: { id: 10, name: "Steel Workbench", cat: "besi", price: 780, rating: 4.9, reviews: 12, image: "https://m.media-amazon.com/images/I/71V+dCp4gsL._AC_SX679_.jpg", gallery: [], description: "Heavy-gauge steel workbench with pegboard back panel and lower shelf. Ideal for workshops and garages. Supports up to 200kg.", material: "Heavy-Gauge Steel, Galvanized Top", dimensions: "150cm × 60cm × 90cm", stock: 6 },
  11: { id: 11, name: "Classic Cotton Polo", cat: "baju", price: 65, rating: 4.7, reviews: 91, image: "https://m.media-amazon.com/images/I/81Qk6j07qEL._AC_UY1000_.jpg", gallery: [], description: "100% combed cotton polo shirt with 3-button placket. Pre-shrunk and colour-fast for long-lasting wear.", material: "100% Combed Cotton, 220gsm", sizes: ["XS", "S", "M", "L", "XL", "XXL"], colors: ["White", "Navy", "Black", "Charcoal"], stock: 50 },
  12: { id: 12, name: "Heavy Duty Work Shirt", cat: "baju", price: 89, rating: 4.8, reviews: 63, image: "https://heavydutywear.ca/cdn/shop/files/4074NB_1.jpg?v=1738621840&width=900", gallery: [], description: "Durable long-sleeve work shirt with reinforced elbows and chest pockets. Designed for tradespeople and craftsmen.", material: "65% Polyester / 35% Cotton Blend, 240gsm", sizes: ["S", "M", "L", "XL", "XXL", "3XL"], colors: ["Khaki", "Navy", "Olive", "Black"], stock: 40 },
  13: { id: 13, name: "Linen Casual Shirt", cat: "baju", price: 78, rating: 4.5, reviews: 47, image: "https://image.made-in-china.com/2f0j00MSOkwcbGiqcn/Men-s-High-Quality-Linen-Long-Sleeve-Linen-Summer-Loose-Casual-Cotton-Shirt-for-Man.jpg", gallery: [], description: "Breathable linen shirt with a relaxed, oversized silhouette. Perfect for casual or smart-casual occasions.", material: "100% Linen", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Off-White", "Sand", "Sage", "Sky Blue"], stock: 35 },
  14: { id: 14, name: "Custom Print T-Shirt", cat: "baju", price: 55, rating: 4.6, reviews: 120, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=300&fit=crop&auto=format", gallery: [], description: "Versatile unisex t-shirt available in a wide range of colours. Order custom-printed versions on our Custom Clothes page.", material: "100% Ring-Spun Cotton, 180gsm", sizes: ["XS", "S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Red", "Royal Blue", "Forest Green"], stock: 60 },
  15: { id: 15, name: "Formal Batik Shirt", cat: "baju", price: 110, rating: 4.9, reviews: 38, image: "https://poya.com.my/cdn/shop/articles/Screenshot_2024-01-15_at_10.44.26_AM.png?v=1705286673", gallery: [], description: "Hand-stamped Malaysian batik shirt suitable for formal occasions. Each piece is unique with traditional Malay motifs.", material: "Cotton Batik, Hand-stamped", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Dark Blue", "Maroon", "Forest Green"], stock: 25 },
};

const REVIEWS = [
  { user: "Ikram A.", rating: 5, date: "12 May 2024", comment: "Absolutely stunning quality. The craftsmanship is exceptional and it arrived perfectly packaged." },
  { user: "Siti N.", rating: 4, date: "3 Apr 2024", comment: "Great product, solid build. Delivery was prompt. Would definitely purchase again." },
  { user: "Chen W.", rating: 5, date: "18 Mar 2024", comment: "You can really feel the love and care that went into making this. Highly recommended." },
];

export function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS[Number(id)] || PRODUCTS[1];
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const catLabel = { kayu: "Wood", besi: "Metal", baju: "Clothing" }[product.cat];
  const catColor = { kayu: "bg-amber-100 text-amber-800", besi: "bg-slate-100 text-slate-700", baju: "bg-rose-100 text-rose-700" }[product.cat];

  const handleAdd = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    addToCart({ ...product, size: selectedSize, color: selectedColor }, qty);
    toast.success(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} message="Please log in to add items to your cart." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-[#7A7167] mb-8">
          <Link to="/" className="hover:text-[#B07D45]">Home</Link>
          <span>/</span>
          <Link to="/catalogue" className="hover:text-[#B07D45]">Catalogue</Link>
          <span>/</span>
          <span className="text-[#1C1A18]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-[4/3] bg-white rounded-sm overflow-hidden mb-4 shadow-sm">
              <ImageWithFallback src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.gallery.length > 0 && (
              <div className="flex gap-3">
                <button onClick={() => setSelectedImage(product.image)} className={`w-20 h-16 rounded-sm overflow-hidden border-2 transition-colors ${selectedImage === product.image ? "border-[#B07D45]" : "border-transparent"}`}>
                  <ImageWithFallback src={product.image} alt="" className="w-full h-full object-cover" />
                </button>
                {product.gallery.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(img)} className={`w-20 h-16 rounded-sm overflow-hidden border-2 transition-colors ${selectedImage === img ? "border-[#B07D45]" : "border-transparent"}`}>
                    <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Badge className={`${catColor} border-0 mb-3`}>{catLabel}</Badge>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18] mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? "fill-[#B07D45] text-[#B07D45]" : "text-[#D4C8BC]"}`} />
                ))}
              </div>
              <span className="text-sm text-[#7A7167]">{product.rating} · {product.reviews} reviews</span>
            </div>

            <div className="text-3xl font-semibold text-[#1C1A18] mb-6">RM {product.price.toLocaleString()}</div>
            <p className="text-[#7A7167] leading-relaxed mb-6">{product.description}</p>

            <div className="border-t border-[#D4C8BC] py-4 mb-4 space-y-2">
              <div className="flex gap-2 text-sm"><span className="text-[#7A7167] w-28">Material:</span><span className="text-[#1C1A18]">{product.material}</span></div>
              {product.dimensions && <div className="flex gap-2 text-sm"><span className="text-[#7A7167] w-28">Dimensions:</span><span className="text-[#1C1A18]">{product.dimensions}</span></div>}
              <div className="flex gap-2 text-sm"><span className="text-[#7A7167] w-28">Availability:</span><span className="text-green-700">{product.stock} in stock</span></div>
            </div>

            {product.sizes && (
              <div className="mb-4">
                <p className="text-sm font-medium text-[#1C1A18] mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(sz => (
                    <button key={sz} onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 border text-sm rounded-sm transition-colors ${selectedSize === sz ? "border-[#1C1A18] bg-[#1C1A18] text-white" : "border-[#D4C8BC] text-[#7A7167] hover:border-[#1C1A18]"}`}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && (
              <div className="mb-6">
                <p className="text-sm font-medium text-[#1C1A18] mb-2">Color: <span className="text-[#7A7167] font-normal">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(col => (
                    <button key={col} onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 border text-sm rounded-sm transition-colors ${selectedColor === col ? "border-[#B07D45] text-[#B07D45]" : "border-[#D4C8BC] text-[#7A7167] hover:border-[#1C1A18]"}`}>
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-[#D4C8BC] rounded-sm">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-[#EDE8E0] transition-colors text-[#1C1A18]">−</button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-[#EDE8E0] transition-colors text-[#1C1A18]">+</button>
              </div>
              <Button onClick={handleAdd} className={`flex-1 h-11 rounded-sm flex items-center gap-2 justify-center transition-colors ${added ? "bg-green-600 hover:bg-green-700" : "bg-[#1C1A18] hover:bg-[#B07D45]"} text-white`}>
                {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
              </Button>
              
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-[#D4C8BC] pt-5">
              {[
                { icon: Truck, label: "Free delivery above RM500" },
                { icon: Shield, label: "Quality guaranteed" },
                { icon: RotateCcw, label: "30-day returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="w-5 h-5 text-[#B07D45]" />
                  <span className="text-xs text-[#7A7167]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl text-[#1C1A18] mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-sm p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "fill-[#B07D45] text-[#B07D45]" : "text-[#D4C8BC]"}`} />
                  ))}
                </div>
                <p className="text-sm text-[#7A7167] leading-relaxed mb-4">"{r.comment}"</p>
                <div className="flex justify-between text-xs text-[#A09488]">
                  <span className="font-medium text-[#1C1A18]">{r.user}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}