import { useParams, Link } from "react-router";
import { CheckCircle, Package, Printer, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

export function Invoice() {
  const { orderId } = useParams();
  const { currentOrder } = useOrder();
  const { user } = useAuth();

  const items = currentOrder?.items || [];
  const subtotal = currentOrder?.subtotal ?? items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = currentOrder?.shipping ?? 25;
  const discount = currentOrder?.discount ?? 0;
  const total = currentOrder?.total ?? subtotal + shipping;
  const date = currentOrder?.date ?? new Date().toLocaleDateString("en-MY", { day: "2-digit", month: "long", year: "numeric" });
  const address = currentOrder?.address;
  const customerName = address?.name || user?.name || "Valued Customer";

  return (
    <div className="min-h-screen bg-[#F7F3EE] py-12">
      <div className="max-w-2xl mx-auto px-4">

        {/* Success banner */}
        <div className="bg-green-50 border border-green-200 rounded-sm p-6 mb-8 flex items-center gap-4">
          <CheckCircle className="w-10 h-10 text-green-600 flex-shrink-0" />
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-green-800">Order Confirmed!</h2>
            <p className="text-sm text-green-700 mt-1">Thank you, {customerName}. Your order has been received.</p>
          </div>
        </div>

        {/* Invoice card */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#1C1A18] px-8 py-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-5 h-5 text-[#B07D45]" />
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg text-white">Three Good Sales</span>
              </div>
              <p className="text-xs text-[#A09488]">threegoodsales.com · hello@threegoodsales.com</p>
            </div>
            <div className="text-right">
              <div className="text-[#B07D45] text-sm uppercase tracking-widest mb-1">Invoice</div>
              <div className="text-white font-mono text-sm">{orderId}</div>
            </div>
          </div>

          {/* Meta */}
          <div className="px-8 py-5 bg-[#F7F3EE] grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-[#D4C8BC]">
            <div><p className="text-xs text-[#7A7167] mb-1">Date</p><p className="text-sm text-[#1C1A18]">{date}</p></div>
            <div><p className="text-xs text-[#7A7167] mb-1">Customer</p><p className="text-sm text-[#1C1A18]">{customerName}</p></div>
            <div><p className="text-xs text-[#7A7167] mb-1">Payment</p><span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Paid</span></div>
            <div><p className="text-xs text-[#7A7167] mb-1">Delivery</p><span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Processing</span></div>
          </div>

          {/* Delivery address */}
          {address && (
            <div className="px-8 py-4 border-b border-[#EDE8E0]">
              <p className="text-xs text-[#7A7167] uppercase tracking-widest mb-2">Delivery Address</p>
              <p className="text-sm text-[#1C1A18]">{address.name}</p>
              <p className="text-sm text-[#7A7167]">{address.line1}, {address.city}, {address.state} {address.postcode}</p>
              {address.phone && <p className="text-sm text-[#7A7167]">{address.phone}</p>}
            </div>
          )}

          {/* Items */}
          <div className="px-8 py-6">
            {items.length === 0 ? (
              <p className="text-sm text-[#7A7167] text-center py-4">No items found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#D4C8BC]">
                    <th className="text-left py-2 text-xs uppercase tracking-widest text-[#7A7167] font-medium">Product</th>
                    <th className="text-center py-2 text-xs uppercase tracking-widest text-[#7A7167] font-medium">Qty</th>
                    <th className="text-right py-2 text-xs uppercase tracking-widest text-[#7A7167] font-medium">Price</th>
                    <th className="text-right py-2 text-xs uppercase tracking-widest text-[#7A7167] font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b border-[#EDE8E0]">
                      <td className="py-3 text-[#1C1A18]">
                        {item.name}
                        {item.size && <span className="text-xs text-[#7A7167] ml-1">({item.size})</span>}
                        {item.color && <span className="text-xs text-[#7A7167] ml-1">· {item.color}</span>}
                      </td>
                      <td className="py-3 text-center text-[#7A7167]">{item.qty}</td>
                      <td className="py-3 text-right text-[#7A7167]">RM {item.price.toLocaleString()}</td>
                      <td className="py-3 text-right text-[#1C1A18] font-medium">RM {(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Totals */}
          <div className="px-8 pb-6">
            <div className="ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-[#7A7167]"><span>Subtotal</span><span>RM {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-[#7A7167]"><span>Shipping</span><span>{shipping === 0 ? "FREE" : `RM ${shipping}`}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-700"><span>Voucher Discount</span><span>- RM {discount}</span></div>}
              <div className="border-t border-[#D4C8BC] pt-2 flex justify-between font-semibold text-[#1C1A18]">
                <span>Total Paid</span><span>RM {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F7F3EE] px-8 py-5 text-xs text-[#7A7167] border-t border-[#D4C8BC]">
            <p>Your order is expected to arrive within 5–10 business days. Inquiries: hello@threegoodsales.com or +60 3-1234 5678.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button onClick={() => window.print()} variant="outline" className="border-[#D4C8BC] text-[#1C1A18] rounded-sm flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print Invoice
          </Button>
          <Link to={`/track/${orderId}`} className="ml-auto">
            <Button className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm flex items-center gap-2">
              Track Order <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}