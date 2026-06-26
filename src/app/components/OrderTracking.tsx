import { useParams, Link } from "react-router";
import { Package, Truck, CheckCircle, Clock, Box, Star, FileText, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const STATUSES = [
  { key: "pending", label: "Order Placed", icon: Clock, desc: "Your order has been received and is awaiting confirmation." },
  { key: "processing", label: "Processing", icon: Package, desc: "Our team is preparing your items for dispatch." },
  { key: "packed", label: "Packed", icon: Box, desc: "Your order has been packed and is ready for shipping." },
  { key: "shipped", label: "Shipped", icon: Truck, desc: "Your order is on the way with our delivery partner." },
  { key: "delivered", label: "Delivered", icon: CheckCircle, desc: "Your order has been delivered successfully." },
];

// Simulate order status based on orderId
function getOrderStatus(orderId: string) {
  const statuses = ["pending", "processing", "packed", "shipped", "delivered"];
  // Use last char of orderId to simulate different statuses for demo
  const last = parseInt(orderId?.slice(-1) || "2");
  return statuses[Math.min(last % 5, 4)];
}

export function OrderTracking() {
  const { orderId } = useParams();
  const currentStatus = getOrderStatus(orderId || "");
  const currentIndex = STATUSES.findIndex(s => s.key === currentStatus);

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + (4 - currentIndex) * 2);
  const estimatedStr = estimatedDate.toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const trackingNumber = "MYPX" + (orderId || "000000").slice(-6).toUpperCase();

  // Simulated items
  const items = [
    { name: "Teak Dining Table", qty: 1, price: 1200 },
    { name: "Classic Cotton Polo", qty: 2, price: 65 },
  ];
  const total = items.reduce((s, i) => s + i.price * i.qty, 0) + 25;

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

        {/* Tracking number & ETA */}
        <div className="bg-white rounded-sm shadow-sm p-6 flex flex-wrap gap-6 justify-between items-center">
          <div>
            <p className="text-xs text-[#7A7167] uppercase tracking-widest mb-1">Tracking Number</p>
            <p className="font-mono font-semibold text-[#1C1A18] text-lg">{trackingNumber}</p>
          </div>
          <div>
            <p className="text-xs text-[#7A7167] uppercase tracking-widest mb-1">Estimated Delivery</p>
            <p className="font-medium text-[#1C1A18]">{currentStatus === "delivered" ? "Delivered ✓" : estimatedStr}</p>
          </div>
          <div>
            <p className="text-xs text-[#7A7167] uppercase tracking-widest mb-1">Current Status</p>
            <span className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${
              currentStatus === "delivered" ? "bg-green-100 text-green-700" :
              currentStatus === "shipped" ? "bg-blue-100 text-blue-700" :
              "bg-amber-100 text-amber-700"
            }`}>
              {STATUSES[currentIndex]?.label}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-sm shadow-sm p-8">
          <h2 className="font-semibold text-[#1C1A18] mb-8">Delivery Progress</h2>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#EDE8E0]" />
            <div
              className="absolute left-6 top-6 w-0.5 bg-[#B07D45] transition-all duration-700"
              style={{ height: `${(currentIndex / (STATUSES.length - 1)) * 100}%` }}
            />

            <div className="space-y-8">
              {STATUSES.map((status, index) => {
                const isDone = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const Icon = status.icon;

                return (
                  <div key={status.key} className="relative flex gap-5 items-start">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isDone ? "bg-[#B07D45] shadow-md shadow-[#B07D45]/30" :
                      "bg-[#EDE8E0]"
                    }`}>
                      <Icon className={`w-5 h-5 ${isDone ? "text-white" : "text-[#A09488]"}`} />
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium ${isDone ? "text-[#1C1A18]" : "text-[#A09488]"}`}>{status.label}</p>
                        {isCurrent && <span className="text-xs bg-[#B07D45] text-white px-2 py-0.5 rounded-full">Current</span>}
                      </div>
                      <p className={`text-sm ${isDone ? "text-[#7A7167]" : "text-[#C4B8AC]"}`}>{status.desc}</p>
                      {isDone && (
                        <p className="text-xs text-[#B07D45] mt-1">
                          {new Date(Date.now() - (currentIndex - index) * 24 * 60 * 60 * 1000 * 1.5)
                            .toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
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
            <div className="flex justify-between items-center pt-2 font-semibold text-[#1C1A18]">
              <span>Total Paid</span>
              <span>RM {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to={`/invoice/${orderId}`}>
            <Button variant="outline" className="w-full border-[#D4C8BC] text-[#1C1A18] rounded-sm flex items-center gap-2 h-11">
              <FileText className="w-4 h-4" /> View Invoice
            </Button>
          </Link>

          {currentStatus === "delivered" && (
            <Link to="/reviews/write">
              <Button className="w-full bg-[#B07D45] hover:bg-[#9A6C38] text-white rounded-sm flex items-center gap-2 h-11">
                <Star className="w-4 h-4" /> Write a Review
              </Button>
            </Link>
          )}

          <Link to="/catalogue">
            <Button className="w-full bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm flex items-center gap-2 h-11">
              Continue Shopping <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}