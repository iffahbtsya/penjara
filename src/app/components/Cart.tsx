import { Link, useNavigate } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { LoginRequiredModal } from "./LoginRequiredModal";
import { useState } from "react";

export function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateCart, removeFromCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    navigate("/payment");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F3EE] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-20 h-20 text-[#D4C8BC] mb-6" />
        <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18] mb-3">Your cart is empty</h2>
        <p className="text-[#7A7167] mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/catalogue">
          <Button className="bg-[#1C1A18] hover:bg-[#B07D45] text-white px-8 rounded-sm">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} message="Please log in to proceed to checkout." />

      <div className="bg-[#1C1A18] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-white">Shopping Cart</h1>
          <p className="text-[#A09488] text-sm mt-1">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white rounded-sm p-4 flex gap-4 shadow-sm">
                <div className="w-24 h-24 flex-shrink-0 rounded-sm overflow-hidden bg-[#EDE8E0]">
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#1C1A18] text-sm mb-1">{item.name}</h3>
                  <div className="flex gap-3 text-xs text-[#7A7167] mb-3">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-[#D4C8BC] rounded-sm">
                      <button onClick={() => item.qty > 1 ? updateCart(item.id, item.qty - 1, item.size) : removeFromCart(item.id, item.size)} className="px-2 py-1 hover:bg-[#EDE8E0] text-[#1C1A18] text-sm">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button onClick={() => updateCart(item.id, item.qty + 1, item.size)} className="px-2 py-1 hover:bg-[#EDE8E0] text-[#1C1A18] text-sm">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[#1C1A18]">RM {(item.price * item.qty).toLocaleString()}</span>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-[#7A7167] hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/catalogue" className="flex items-center gap-2 text-sm text-[#B07D45] hover:underline">← Continue Shopping</Link>
          </div>

          <div className="bg-white rounded-sm p-6 shadow-sm h-fit sticky top-24">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18] mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between text-[#7A7167]">
                  <span>{item.name} × {item.qty}</span>
                  <span>RM {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-[#EDE8E0] pt-3 flex justify-between text-[#7A7167]">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-700">FREE</span> : `RM ${shipping}`}</span>
              </div>
              {subtotal < 500 && <p className="text-xs text-[#B07D45]">Add RM {(500 - subtotal).toLocaleString()} more for free shipping</p>}
            </div>
            <div className="border-t border-[#D4C8BC] pt-4 mb-6 flex justify-between font-semibold text-[#1C1A18]">
              <span>Total</span>
              <span>RM {total.toLocaleString()}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full bg-[#1C1A18] hover:bg-[#B07D45] text-white h-11 rounded-sm flex items-center justify-center gap-2 transition-colors">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
            <div className="mt-4 text-center text-xs text-[#7A7167]">Secure checkout — SSL encrypted</div>
          </div>
        </div>
      </div>
    </div>
  );
}