import { useState } from "react";
import { useNavigate } from "react-router";
import { CreditCard, Smartphone, Building, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function Payment() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user, updatePoints } = useAuth();
  const [method, setMethod] = useState<"card" | "fpx" | "ewallet">("card");
  const [address, setAddress] = useState({ name: "", line1: "", city: "", state: "", postcode: "", phone: "" });
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handleOrder = () => {
    if (!address.name || !address.line1 || !address.city || !address.state || !address.postcode) {
      toast.error("Please fill in your delivery address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const orderId = "TGS-" + Date.now().toString().slice(-6);
      // Award reward points (1 point per RM1)
      const pointsEarned = Math.floor(total);
      if (user) {
        updatePoints((user.rewardPoints || 0) + pointsEarned);
      }
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/invoice/${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <div className="bg-[#1C1A18] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-white">Checkout</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-[#A09488]">
            <Lock className="w-3 h-3" /> Secure checkout
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery address */}
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <h2 className="font-semibold text-[#1C1A18] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1C1A18] text-white rounded-full flex items-center justify-center text-xs">1</span>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-xs text-[#7A7167] mb-1 block">Full Name</Label>
                  <Input value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} placeholder="Jane Doe" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-[#7A7167] mb-1 block">Address Line</Label>
                  <Input value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} placeholder="No. 12, Jalan Bukit Bintang" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1 block">City</Label>
                  <Input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="Kuala Lumpur" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1 block">State</Label>
                  <select value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3 text-sm text-[#1C1A18]">
                    <option value="">Select State</option>
                    {["Selangor", "Kuala Lumpur", "Johor", "Penang", "Perak", "Sabah", "Sarawak", "Kedah", "Kelantan", "Terengganu"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1 block">Postcode</Label>
                  <Input value={address.postcode} onChange={e => setAddress({ ...address, postcode: e.target.value })} placeholder="50450" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1 block">Phone Number</Label>
                  <Input value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="+60 12-345 6789" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <h2 className="font-semibold text-[#1C1A18] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1C1A18] text-white rounded-full flex items-center justify-center text-xs">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {([
                  { id: "card", icon: CreditCard, label: "Credit / Debit Card" },
                  { id: "fpx", icon: Building, label: "Online Banking (FPX)" },
                  { id: "ewallet", icon: Smartphone, label: "e-Wallet" },
                ] as const).map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-sm transition-colors text-sm ${method === m.id ? "border-[#1C1A18] bg-[#F7F3EE]" : "border-[#D4C8BC] hover:border-[#1C1A18]"}`}>
                    <m.icon className={`w-5 h-5 ${method === m.id ? "text-[#B07D45]" : "text-[#7A7167]"}`} />
                    <span className={method === m.id ? "text-[#1C1A18] font-medium" : "text-[#7A7167]"}>{m.label}</span>
                  </button>
                ))}
              </div>
              {method === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-[#7A7167] mb-1 block">Card Number</Label>
                    <Input value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} placeholder="1234 5678 9012 3456" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-[#7A7167] mb-1 block">Name on Card</Label>
                    <Input value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="JANE DOE" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-[#7A7167] mb-1 block">Expiry Date</Label>
                      <Input value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} placeholder="MM / YY" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-[#7A7167] mb-1 block">CVV</Label>
                      <Input value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} placeholder="123" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                    </div>
                  </div>
                </div>
              )}
              {method === "fpx" && (
                <div>
                  <Label className="text-xs text-[#7A7167] mb-2 block">Select your Bank</Label>
                  <select className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3 text-sm text-[#1C1A18]">
                    {["Maybank", "CIMB Bank", "RHB Bank", "Public Bank", "Hong Leong Bank", "AmBank"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              )}
              {method === "ewallet" && (
                <div className="grid grid-cols-3 gap-3">
                  {["Touch 'n Go eWallet", "Boost", "GrabPay"].map(ew => (
                    <button key={ew} className="p-3 border border-[#D4C8BC] rounded-sm text-sm text-[#7A7167] hover:border-[#B07D45] hover:text-[#B07D45] transition-colors">{ew}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right summary */}
          <div className="bg-white rounded-sm p-6 shadow-sm h-fit sticky top-24">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18] mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between">
                  <span className="text-[#7A7167] truncate max-w-[160px]">{item.name} × {item.qty}</span>
                  <span className="text-[#1C1A18]">RM {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#EDE8E0] pt-3 space-y-2 text-sm mb-5">
              <div className="flex justify-between text-[#7A7167]"><span>Subtotal</span><span>RM {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-[#7A7167]"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-700">FREE</span> : `RM ${shipping}`}</span></div>
            </div>
            <div className="border-t border-[#D4C8BC] pt-4 flex justify-between font-semibold text-[#1C1A18] mb-6">
              <span>Total Payable</span>
              <span>RM {total.toLocaleString()}</span>
            </div>
            <Button onClick={handleOrder} disabled={loading} className="w-full bg-[#B07D45] hover:bg-[#9A6C38] text-white h-11 rounded-sm flex items-center justify-center gap-2">
              {loading ? "Processing..." : <><Lock className="w-4 h-4" /> Place Order</>}
            </Button>
            <p className="text-xs text-center text-[#7A7167] mt-3">Your payment is secured with 256-bit SSL encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
}