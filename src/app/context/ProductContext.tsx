import { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  cat: "kayu" | "besi" | "baju";
  price: number;
  rating: number;
  reviews: number;
  image: string;
  stock: number;
  description?: string;
  material?: string;
  dimensions?: string;
  sizes?: string[];
  colors?: string[];
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Teak Dining Table", cat: "kayu", price: 1200, rating: 4.8, reviews: 34, stock: 8, image: "https://theteakline.com/wp-content/uploads/2026/02/opera-dining-table-2-the-teak-line.png", description: "A beautifully handcrafted solid teak dining table.", material: "Grade A Solid Teak", dimensions: "180cm × 90cm × 75cm" },
  { id: 2, name: "Mahogany Bookshelf", cat: "kayu", price: 890, rating: 4.9, reviews: 27, stock: 5, image: "https://www.bigw.com.au/medias/sys_master/images/images/h79/h4a/97284761780254.jpg", description: "Solid mahogany bookshelf with 5 adjustable shelves.", material: "Solid Mahogany", dimensions: "90cm × 30cm × 190cm" },
  { id: 3, name: "Oak Side Table", cat: "kayu", price: 340, rating: 4.6, reviews: 18, stock: 12, image: "https://images.thdstatic.com/productImages/f0cc09df-0472-41d9-9071-f994698460e7/svn/oak-lirago-end-side-tables-hd-tjs400-64_600.jpg", description: "Minimalist oak side table.", material: "Solid Oak", dimensions: "45cm × 45cm × 55cm" },
  { id: 4, name: "Wooden Jewellery Box", cat: "kayu", price: 95, rating: 4.7, reviews: 44, stock: 20, image: "https://down-my.img.susercontent.com/file/6477a7db7e49696e609dc10d4426c8b4", description: "Intricately carved jewellery box.", material: "Teak & Rosewood" },
  { id: 5, name: "Rattan Wall Decor", cat: "kayu", price: 180, rating: 4.5, reviews: 29, stock: 15, image: "https://down-my.img.susercontent.com/file/cn-11134207-7ras8-m55f7yehpzc1a4", description: "Hand-woven rattan wall art panel.", material: "Natural Rattan", dimensions: "60cm × 60cm" },
  { id: 6, name: "Steel Clothes Drying Rack", cat: "besi", price: 185, rating: 4.6, reviews: 52, stock: 30, image: "https://images.thdstatic.com/productImages/61fb8e26-c53d-423e-890c-3eca8e1ddb9b/svn/white-37-boyel-living-clothes-drying-racks-bljz10467-64_1000.jpg", description: "Heavy-duty powder-coated steel drying rack.", material: "Powder-Coated Steel", dimensions: "120cm × 55cm × 90cm" },
  { id: 7, name: "Industrial Shelf Unit", cat: "besi", price: 420, rating: 4.8, reviews: 21, stock: 10, image: "https://m.media-amazon.com/images/I/81uSA7EeBEL._AC_UF894,1000_QL80_.jpg", description: "5-tier industrial steel shelf unit.", material: "Cold-Rolled Steel", dimensions: "90cm × 40cm × 180cm" },
  { id: 8, name: "Metal Locker Cabinet", cat: "besi", price: 650, rating: 4.5, reviews: 16, stock: 7, image: "https://i5.walmartimages.com/asr/fcf64f30-28c1-4a11-bbec-0e97e018aaa6.144964fe56069ff12aebb3436a1e2187.jpeg", description: "4-door steel locker cabinet.", material: "CRCA Steel" },
  { id: 9, name: "Iron Coat Rack", cat: "besi", price: 120, rating: 4.7, reviews: 38, stock: 22, image: "https://images.thdstatic.com/productImages/f8867afdb47b41f58578f80bf56f71db/svn/black-umbrella-stands-ph00559b498-64_1000.jpg", description: "Wrought iron freestanding coat rack.", material: "Wrought Iron", dimensions: "40cm base × 170cm tall" },
  { id: 10, name: "Steel Workbench", cat: "besi", price: 780, rating: 4.9, reviews: 12, stock: 6, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShohWysB3tj7VrqYTo-u7-CnA1XlJJod_pmrhDkQPlFZXFQDbHC32qK8sF&s=10", description: "Heavy-gauge steel workbench.", material: "Heavy-Gauge Steel", dimensions: "150cm × 60cm × 90cm" },
  { id: 11, name: "Classic Cotton Polo", cat: "baju", price: 65, rating: 4.7, reviews: 91, stock: 50, image: "https://m.media-amazon.com/images/I/81Qk6j07qEL._AC_UY1000_.jpg", description: "100% combed cotton polo shirt.", material: "100% Combed Cotton", sizes: ["XS","S","M","L","XL","XXL"], colors: ["White","Navy","Black","Charcoal"] },
  { id: 12, name: "Heavy Duty Work Shirt", cat: "baju", price: 89, rating: 4.8, reviews: 63, stock: 40, image: "https://heavydutywear.ca/cdn/shop/files/4074NB_1.jpg?v=1738621840&width=900", description: "Durable long-sleeve work shirt.", material: "65% Polyester / 35% Cotton", sizes: ["S","M","L","XL","XXL","3XL"], colors: ["Khaki","Navy","Olive","Black"] },
  { id: 13, name: "Linen Casual Shirt", cat: "baju", price: 78, rating: 4.5, reviews: 47, stock: 35, image: "https://image.made-in-china.com/2f0j00MSOkwcbGiqcn/Men-s-High-Quality-Linen-Long-Sleeve-Linen-Summer-Loose-Casual-Cotton-Shirt-for-Man.jpg", description: "Breathable linen shirt.", material: "100% Linen", sizes: ["S","M","L","XL","XXL"], colors: ["Off-White","Sand","Sage","Sky Blue"] },
  { id: 14, name: "Custom Print T-Shirt", cat: "baju", price: 55, rating: 4.6, reviews: 120, stock: 60, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=300&fit=crop&auto=format", description: "Versatile unisex t-shirt.", material: "100% Ring-Spun Cotton", sizes: ["XS","S","M","L","XL","XXL"], colors: ["White","Black","Red","Royal Blue"] },
  { id: 15, name: "Formal Batik Shirt", cat: "baju", price: 110, rating: 4.9, reviews: 38, stock: 25, image: "https://poya.com.my/cdn/shop/articles/Screenshot_2024-01-15_at_10.44.26_AM.png?v=1705286673", description: "Hand-stamped Malaysian batik shirt.", material: "Cotton Batik", sizes: ["S","M","L","XL","XXL"], colors: ["Dark Blue","Maroon","Forest Green"] },
];

interface ProductContextType {
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "rating" | "reviews">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addProduct = (p: Omit<Product, "id" | "rating" | "reviews">) => {
    setProducts(prev => [...prev, { ...p, id: Date.now(), rating: 0, reviews: 0 }]);
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(x => x.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be inside ProductProvider");
  return ctx;
}