import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "./CartContext";

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  address: {
    name: string;
    line1: string;
    city: string;
    state: string;
    postcode: string;
    phone: string;
  };
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  date: string;
}

interface OrderContextType {
  currentOrder: OrderDetails | null;
  saveOrder: (order: OrderDetails) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);

  const saveOrder = (order: OrderDetails) => setCurrentOrder(order);
  const clearOrder = () => setCurrentOrder(null);

  return (
    <OrderContext.Provider value={{ currentOrder, saveOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}