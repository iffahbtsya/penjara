import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
  cat: string;
  customDesign?: {
    text?: string;
    font?: string;
    textColor?: string;
    logoUrl?: string;
    imageUrl?: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Omit<CartItem, "qty">, qty?: number) => void;
  updateCart: (id: number, qty: number, size?: string) => void;
  removeFromCart: (id: number, size?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Omit<CartItem, "qty">, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(
        i => i.id === product.id && i.size === product.size && i.color === product.color
      );
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.size === product.size && i.color === product.color
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const updateCart = (id: number, qty: number, size?: string) => {
    setCartItems(prev =>
      prev.map(i => (i.id === id && i.size === size ? { ...i, qty } : i))
    );
  };

  const removeFromCart = (id: number, size?: string) => {
    setCartItems(prev =>
      prev.filter(i => !(i.id === id && i.size === size))
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      updateCart,
      removeFromCart,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}