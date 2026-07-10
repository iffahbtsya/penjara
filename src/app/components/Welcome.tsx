import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Star, Shield, Truck, Award } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FAQSection } from "./FAQSection";

const categories = [
  {
    id: "kayu",
    name: "Wood",
    subtitle: "Handcrafted wooden furniture & crafts",
    image: "https://www.thewoodcolony.com/data/masthead/1573020230_masthead-home4.jpg",
    color: "#6B4226",
    tag: "Kayu",
  },
  {
    id: "besi",
    name: "Metal",
    subtitle: "Industrial shelving, racks & metal goods",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format",
    color: "#3D3D3D",
    tag: "Besi",
  },
  {
    id: "baju",
    name: "Clothing",
    subtitle: "Quality garments & custom apparel",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop&auto=format",
    color: "#B07D45",
    tag: "Baju",
  },
];

const featuredProducts = [
  {
    id: 1,
    name: "Teak Dining Table",
    category: "Wood",
    price: 1200,
    rating: 4.8,
    reviews: 34,
    image: "https://theteakline.com/wp-content/uploads/2026/02/opera-dining-table-2-the-teak-line.png",
  },
  {
    id: 6,
    name: "Steel Clothes Drying Rack",
    category: "Metal",
    price: 185,
    rating: 4.6,
    reviews: 52,
    image: "https://images.thdstatic.com/productImages/61fb8e26-c53d-423e-890c-3eca8e1ddb9b/svn/white-37-boyel-living-clothes-drying-racks-bljz10467-64_1000.jpg",
  },
  {
    id: 11,
    name: "Classic Cotton Polo",
    category: "Clothing",
    price: 65,
    rating: 4.7,
    reviews: 91,
    image: "https://m.media-amazon.com/images/I/81Qk6j07qEL._AC_UY1000_.jpg",
  },
  {
    id: 2,
    name: "Mahogany Bookshelf",
    category: "Wood",
    price: 890,
    rating: 4.9,
    reviews: 27,
    image: "https://www.bigw.com.au/medias/sys_master/images/images/h79/h4a/97284761780254.jpg",
  },
];

const trustBadges = [
  { icon: Shield, label: "Prison-Industry Certified" },
  { icon: Star, label: "Top Rated Products" },
  { icon: Truck, label: "Nationwide Delivery" },
  { icon: Award, label: "Loyalty Rewards" },
];

export function Welcome() {
  const { isLoggedIn, user } = useAuth();
  return (
    <div className="bg-[#F7F3EE]">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src= "https://www.prison.gov.my/images/carta/institusi/penjara-seremban25.jpg?w=1600&h=900&fit=crop&auto=format"/*"https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=900&fit=crop&auto=format"*/
            alt="Craftsmen at work"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1A18]/90 via-[#1C1A18]/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <p className="text-[#B07D45] text-sm uppercase tracking-[0.2em] mb-4">Supporting Rehabilitation</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              Seremban Prison<br />
              <span className="italic text-[#B07D45]">Online Sales System</span>
            </h1>
            <p className="text-[#D4C8BC] text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Quality products crafted by skilled hands. Every purchase supports meaningful industry and a path toward a better future.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalogue">
                <Button className="bg-[#B07D45] hover:bg-[#9A6C38] text-white px-8 py-3 rounded-sm flex items-center gap-2 text-base">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              {!isLoggedIn ? (
                <Link to="/register">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1C1A18] px-8 py-3 rounded-sm text-base bg-transparent">
                    Create Account
                  </Button>
                </Link>
              ) : (
                <span className="text-white/70 text-sm py-3">Welcome back, {user?.name}! 👋</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-[#1C1A18] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 justify-center py-2">
                <Icon className="w-5 h-5 text-[#B07D45]" />
                <span className="text-[#D4C8BC] text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-2">Browse by Category</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-[#1C1A18]">Our Collections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link to={`/catalogue?cat=${cat.id}`} key={cat.id} className="group relative overflow-hidden rounded-sm aspect-[4/3] block">
              <ImageWithFallback
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A18]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-xs uppercase tracking-widest text-[#B07D45] mb-1 block">{cat.tag}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl text-white mb-1">{cat.name}</h3>
                <p className="text-[#D4C8BC] text-sm">{cat.subtitle}</p>
              </div>
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-2">Handpicked for You</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-[#1C1A18]">Featured Products</h2>
            </div>
            <Link to="/catalogue" className="text-sm text-[#B07D45] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group bg-[#F7F3EE] rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden bg-[#EDE8E0]">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs text-[#B07D45] uppercase tracking-widest">{product.category}</span>
                  <h3 className="text-sm font-medium text-[#1C1A18] mt-1 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#1C1A18]">RM {product.price.toLocaleString()}</span>
                    <div className="flex items-center gap-1 text-xs text-[#7A7167]">
                      <Star className="w-3 h-3 fill-[#B07D45] text-[#B07D45]" />
                      {product.rating} ({product.reviews})
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mission banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1A18] rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-4">Our Mission</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl md:text-4xl text-white mb-6 leading-snug">
              Quality goods that create <span className="italic text-[#B07D45]">real change</span>
            </h2>
            <p className="text-[#A09488] leading-relaxed mb-8">
              Every product in our store is made by skilled craftsmen working within correctional facilities. Your purchase directly funds vocational training, fair wages, and rehabilitation programs.
            </p>
            {!isLoggedIn ? (
              <Link to="/register">
                <Button className="bg-[#B07D45] hover:bg-[#9A6C38] text-white rounded-sm w-fit px-8 py-3">
                  Join the Movement
                </Button>
              </Link>
            ) : (
              <Link to="/catalogue">
                <Button className="bg-[#B07D45] hover:bg-[#9A6C38] text-white rounded-sm w-fit px-8 py-3">
                  Browse Products
                </Button>
              </Link>
            )}
          </div>
          <div className="aspect-auto md:aspect-auto">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&h=500&fit=crop&auto=format"
              alt="Craftsmen at work"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-3">Got Questions?</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">
              Frequently Asked Questions
            </h2>
            <p className="text-[#7A7167] mt-3 text-sm">Everything you need to know about Three Good Sales.</p>
          </div>
          <FAQSection />
        </div>
      </section>
    </div>
  );
}