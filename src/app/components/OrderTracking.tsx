import { useState } from "react";
import { useParams, Link } from "react-router";
import { Package, Truck, CheckCircle, Clock, Box, Star, FileText, ChevronRight, X, Edit2, Check, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";

const STATUSES = [
  { key: "pending", label: "Order Placed", icon: Clock, desc: "Your order has been received and is awaiting confirmation." },
  { key: "processing", label: "Processing", icon: Package, desc: "Our team is preparing your items for dispatch." },
  { key: "packed", label: "Packed", icon: Box, desc: "Your order has been packed and is ready for shipping." },
  { key: "shipped", label: "Shipped", icon: Truck, desc: "Your order is on the way with our delivery partner." },
  { key: "delivered", label: "Delivered", icon: CheckCircle, desc: "Your order has been delivered successfully." },
];

function getOrderStatus(orderId: string) {
  const statuses = ["pending", "processing", "packed", "shipped", "delivered"];
  const last = parseInt(orderId?.slice(-1) || "2");
  return statuses[Math.min(last % 5, 4)];
}

const CAN_EDIT = ["pending", "processing"];
const CAN_CANCEL = ["pending", "processing", "packed"];

export function OrderTracking() {
  const { orderId } = useParams();
  const [currentStatus, setCurrentStatus] = useState(getOrderStatus(orderId || ""));
  const [address, setAddress] = useState("No. 12, Jalan Bukit Bintang, 50450 Kuala Lumpur, Selangor");
  const [cancelled, setCancelled] = useState(false);

  // Edit address modal
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(address);

  // Cancel modal
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const currentIndex = STATUSES.findIndex(s => s.key === currentStatus);

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + (4 - currentIndex) * 2);
  const estimatedStr = estimatedDate.toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const trackingNumber = "MYPX" + (orderId || "000000").slice(-6).toUpperCase();

  const items = [
    { name: "Teak Dining Table", qty: 1, price: 1200 },
    { name: "Classic Cotton Polo", qty: 2, price: 65 },
  ];
  const total = items.reduce((s, i) => s + i.price * i.qty, 0) + 25;

  const handleSaveAddress = () => {
    if (!newAddress.trim()) { toast.error("Please enter a valid address."); return; }
    setAddress(newAddress);
    setShowEditAddress(false);
    toast.success("Delivery address updated!");
  };

  const handleCancel = () => {
    if (!cancelReason) { toast.error("Please select a cancellation reason."); return; }
    setCancelled(true);
    setCurrentStatus("pending");
    setShowCancel(false);
    toast.success("Order cancelled. Refund will be processed in 3–5 business days.");
  };

  if (cancelled) {
    return (
      <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center px-4">
        <div className="bg-white rounded-sm shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl text-[#1C1A18] mb-2">Order Cancelled</h2>
          <p className="text-sm text-[#7A7167] mb-2">Order <span className="font-mono font-medium">{orderId}</span> has been cancelled.</p>
          <p className="text-sm text-[#7A7167] mb-6">A full refund of <span className="font-semibold text-[#1C1A18]">RM {total.toLocaleString()}</span> will be processed within 3–5 business days.</p>
          <Link to="/catalogue">
            <Button className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <div className="bg-[#1C1A18] py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-2">Order Status</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-white">Track Your Order</h1>
          <p className="text-[#A09488] text-sm mt-1 font-mono">{orderId}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Summary card */}
        <div className="bg-white rounded-sm shadow-sm p-6 flex flex-wrap gap-6 justify-between items-center">
          <div>
            <p className="text-xs text-[#7A7167] uppercase tracking-widest mb-1">Tracking Number</p>
            <p className="font-mono font-semibold text-[#1C1A18] text-lg">{trackingNumber}</p>
          </div>
          <div>
            <p className="text-xs text-[#7A7167] uppercase tracking-widest mb-1">Estimated Delivery</p>
            <p className="font-medium text-[#1C1A18] text-sm">{currentStatus === "delivered" ? "Delivered ✓" : estimatedStr}</p>
          </div>
          <div>
            <p className="text-xs text-[#7A7167] uppercase tracking-widest mb-1">Status</p>
            <span className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${
              currentStatus === "delivered" ? "bg-green-100 text-green-700" :
              currentStatus === "shipped" ? "bg-blue-100 text-blue-700" :
              currentStatus === "packed" ? "bg-purple-100 text-purple-700" :
              "bg-amber-100 text-amber-700"
            }`}>
              {STATUSES[currentIndex]?.label}
            </span>
          </div>
        </div>

        {/* Delivery address card */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[#7A7167] uppercase tracking-widest mb-2">Delivery Address</p>
              <p className="text-sm text-[#1C1A18]">{address}</p>
            </div>
            {CAN_EDIT.includes(currentStatus) && (
              <button onClick={() => { setNewAddress(address); setShowEditAddress(true); }}
                className="flex items-center gap-1 text-xs text-[#B07D45] border border-[#B07D45]/30 rounded-sm px-3 py-1.5 hover:bg-[#B07D45]/5 transition-colors flex-shrink-0 ml-4">
                <Edit2 className="w-3 h-3" /> Edit Address
              </button>
            )}
          </div>
          {CAN_EDIT.includes(currentStatus) && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-3">⚡ You can still edit your address — order not yet shipped</p>
          )}
          {currentStatus === "shipped" || currentStatus === "delivered" ? (
            <p className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-1 mt-3">🚚 Address is locked — order already shipped</p>
          ) : null}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-sm shadow-sm p-8">
          <h2 className="font-semibold text-[#1C1A18] mb-8">Delivery Progress</h2>
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#EDE8E0]" />
            <div className="absolute left-6 top-6 w-0.5 bg-[#B07D45] transition-all duration-700"
              style={{ height: `${(currentIndex / (STATUSES.length - 1)) * 100}%` }} />
            <div className="space-y-8">
              {STATUSES.map((status, index) => {
                const isDone = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const Icon = status.icon;
                return (
                  <div key={status.key} className="relative flex gap-5 items-start">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isDone ? "bg-[#B07D45] shadow-md" : "bg-[#EDE8E0]"}`}>
                      <Icon className={`w-5 h-5 ${isDone ? "text-white" : "text-[#A09488]"}`} />
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium ${isDone ? "text-[#1C1A18]" : "text-[#A09488]"}`}>{status.label}</p>
                        {isCurrent && <span className="text-xs bg-[#B07D45] text-white px-2 py-0.5 rounded-full">Current</span>}
                      </div>
                      <p className={`text-sm ${isDone ? "text-[#7A7167]" : "text-[#C4B8AC]"}`}>{status.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <h2 className="font-semibold text-[#1C1A18] mb-5">Items in This Order</h2>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#EDE8E0] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1C1A18]">{item.name}</p>
                  <p className="text-xs text-[#7A7167]">Qty: {item.qty}</p>
                </div>
                <span className="text-sm text-[#1C1A18]">RM {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-[#1C1A18] pt-2">
              <span>Total Paid</span>
              <span>RM {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link to={`/invoice/${orderId}`}>
            <Button variant="outline" className="border-[#D4C8BC] text-[#1C1A18] rounded-sm flex items-center gap-2 h-11">
              <FileText className="w-4 h-4" /> View Invoice
            </Button>
          </Link>

          {/* Cancel button */}
          {CAN_CANCEL.includes(currentStatus) && (
            <Button onClick={() => setShowCancel(true)} variant="outline"
              className="border-red-200 text-red-500 hover:bg-red-50 rounded-sm flex items-center gap-2 h-11">
              <X className="w-4 h-4" /> Cancel Order
            </Button>
          )}

          {currentStatus === "delivered" && (
            <Link to="/reviews/write">
              <Button className="bg-[#B07D45] hover:bg-[#9A6C38] text-white rounded-sm flex items-center gap-2 h-11">
                <Star className="w-4 h-4" /> Write a Review
              </Button>
            </Link>
          )}

          <Link to="/catalogue" className="ml-auto">
            <Button className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm flex items-center gap-2 h-11">
              Continue Shopping <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Edit Address Modal */}
      {showEditAddress && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-md shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg text-[#1C1A18]">Edit Delivery Address</h3>
              <button onClick={() => setShowEditAddress(false)}><X className="w-5 h-5 text-[#7A7167]" /></button>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-sm px-3 py-2 mb-4">
              ⚡ Address can only be changed before the order is shipped.
            </p>
            <Label className="text-xs text-[#7A7167] mb-2 block">New Delivery Address</Label>
            <textarea value={newAddress} onChange={e => setNewAddress(e.target.value)} rows={3}
              className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#B07D45] mb-5"
              placeholder="Enter full delivery address..." />
            <div className="flex gap-3">
              <Button onClick={() => setShowEditAddress(false)} variant="outline" className="flex-1 border-[#D4C8BC] rounded-sm">Cancel</Button>
              <Button onClick={handleSaveAddress} className="flex-1 bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> Save Address
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-md shadow-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1C1A18]">Cancel Order</h3>
                <p className="text-xs text-[#7A7167] font-mono">{orderId}</p>
              </div>
            </div>
            <p className="text-sm text-[#7A7167] mb-4">
              A full refund of <span className="font-semibold text-[#1C1A18]">RM {total.toLocaleString()}</span> will be processed within 3–5 business days.
            </p>
            <Label className="text-xs text-[#7A7167] mb-2 block">Reason for Cancellation *</Label>
            <select value={cancelReason} onChange={e => setCancelReason(e.target.value)}
              className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3 text-sm text-[#1C1A18] mb-5">
              <option value="">Select a reason...</option>
              <option>Changed my mind</option>
              <option>Found a better price elsewhere</option>
              <option>Ordered by mistake</option>
              <option>Delivery time too long</option>
              <option>Payment issue</option>
              <option>Other</option>
            </select>
            <div className="flex gap-3">
              <Button onClick={() => { setShowCancel(false); setCancelReason(""); }} variant="outline" className="flex-1 border-[#D4C8BC] rounded-sm">Keep Order</Button>
              <Button onClick={handleCancel} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-sm">Yes, Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}