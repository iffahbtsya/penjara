import React, { useState } from "react";
import { Search, Send, MessageCircle, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";

const ALL_ORDERS = [
  { id: "TGS-847291", customer: "Jane Doe", email: "jane@example.com", phone: "+60123456789", amount: 1330, items: 3, status: "Delivered", date: "12 Jun 2024", address: "No. 12, Jalan Bukit Bintang, KL" },
  { id: "TGS-651082", customer: "Ahmad Razif", email: "ahmad@example.com", phone: "+60112345678", amount: 420, items: 1, status: "Shipped", date: "3 Jun 2024", address: "Level 3, Menara Citibank, KL" },
  { id: "TGS-503774", customer: "Siti Nora", email: "siti@example.com", phone: "+60134567890", amount: 254, items: 2, status: "Processing", date: "1 Jun 2024", address: "45 Jalan Cheras, Selangor" },
  { id: "TGS-412590", customer: "Chen Wei", email: "chen@example.com", phone: "+60167890123", amount: 890, items: 1, status: "Pending", date: "28 May 2024", address: "22 Jalan Ampang, KL" },
  { id: "TGS-398201", customer: "Priya Sharma", email: "priya@example.com", phone: "+60170123456", amount: 185, items: 1, status: "Delivered", date: "20 May 2024", address: "88 Jalan SS2, Petaling Jaya" },
  { id: "TGS-274103", customer: "Ismail Bin Omar", email: "ismail@example.com", phone: "+60193456789", amount: 650, items: 2, status: "Cancelled", date: "15 May 2024", address: "10 Jalan Kerinchi, KL" },
];

const STATUSES = ["All", "Pending", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"];
const STATUS_OPTIONS = ["Pending", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"];
const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Packed: "bg-purple-100 text-purple-700",
  Pending: "bg-slate-100 text-slate-600",
  Cancelled: "bg-red-100 text-red-600",
};

const WA_TEMPLATES = [
  {
    id: "order_confirmed",
    label: "Order Confirmed",
    message: (order: typeof ALL_ORDERS[0]) =>
      `Assalamualaikum / Hi ${order.customer}! 👋\n\nYour order *${order.id}* has been confirmed.\n\n📦 Items: ${order.items}\n💰 Total: RM ${order.amount.toLocaleString()}\n📍 Delivering to: ${order.address}\n\nThank you for shopping with *Three Good Sales*! We'll notify you when your order ships. 🙏`,
  },
  {
    id: "order_packed",
    label: "Order Packed",
    message: (order: typeof ALL_ORDERS[0]) =>
      `Hi ${order.customer}! 📦\n\nGreat news! Your order *${order.id}* has been packed and is ready for collection by our courier.\n\nExpected dispatch: Tomorrow\n\nWe'll send you a tracking number once it's shipped. Stay tuned! 🚚\n\n— *Three Good Sales*`,
  },
  {
    id: "order_shipped",
    label: "Order Shipped",
    message: (order: typeof ALL_ORDERS[0]) =>
      `Hi ${order.customer}! 🚚\n\nYour order *${order.id}* is on its way!\n\n📦 Tracking No: MYPX${order.id.slice(-6)}\n🏠 Delivering to: ${order.address}\n⏱ Est. arrival: 3–5 business days\n\nTrack your parcel at: pos.com.my\n\n— *Three Good Sales*`,
  },
  {
    id: "order_delivered",
    label: "Order Delivered",
    message: (order: typeof ALL_ORDERS[0]) =>
      `Hi ${order.customer}! ✅\n\nYour order *${order.id}* has been delivered!\n\nWe hope you love your purchase. 🙏 If you're happy with your order, we'd love to hear your feedback!\n\nLeave a review at: threegoodsales.com/reviews\n\n— *Three Good Sales*`,
  },
  {
    id: "custom",
    label: "Custom Message",
    message: () => "",
  },
];

export function StaffOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // WhatsApp notification modal
  const [waOrder, setWaOrder] = useState<typeof ALL_ORDERS[0] | null>(null);
  const [waTemplate, setWaTemplate] = useState(WA_TEMPLATES[0].id);
  const [waMessage, setWaMessage] = useState("");
  const [waSent, setWaSent] = useState(false);

  const filtered = orders
    .filter(o => statusFilter === "All" || o.status === statusFilter)
    .filter(o => !search || o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase()));

  const updateStatus = (id: string, status: string) => {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
    toast.success(`Order ${id} status updated to ${status}`);
  };

  const openWA = (order: typeof ALL_ORDERS[0]) => {
    setWaOrder(order);
    setWaTemplate(WA_TEMPLATES[0].id);
    setWaMessage(WA_TEMPLATES[0].message(order));
    setWaSent(false);
  };

  const handleTemplateChange = (templateId: string) => {
    setWaTemplate(templateId);
    const tmpl = WA_TEMPLATES.find(t => t.id === templateId);
    if (tmpl && waOrder) {
      setWaMessage(tmpl.id === "custom" ? "" : tmpl.message(waOrder));
    }
  };

  const handleSendWA = () => {
    if (!waMessage.trim()) { toast.error("Message cannot be empty."); return; }
    if (!waOrder) return;

    // Format phone — remove spaces and dashes
    const phone = waOrder.phone.replace(/[\s\-]/g, "");
    const encoded = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${phone}?text=${encoded}`;

    window.open(waUrl, "_blank");
    setWaSent(true);
    toast.success(`WhatsApp opened for ${waOrder.customer}!`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">Orders</h1>
        <p className="text-sm text-[#7A7167] mt-1">Manage orders and send WhatsApp notifications to customers</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7167]" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="pl-9 bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-9 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-sm text-xs transition-colors ${statusFilter === s ? "bg-[#1C1A18] text-white" : "bg-[#F7F3EE] text-[#7A7167] hover:bg-[#EDE8E0]"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {STATUS_OPTIONS.map(s => {
          const count = orders.filter(o => o.status === s).length;
          return (
            <div key={s} className="bg-white rounded-sm p-3 shadow-sm text-center">
              <p className="text-lg font-semibold text-[#1C1A18]">{count}</p>
              <p className="text-xs text-[#7A7167]">{s}</p>
            </div>
          );
        })}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F3EE]">
              <tr>
                {["Order ID", "Customer", "Amount", "Items", "Status", "Date", "Update Status", "Notify"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#7A7167] font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <React.Fragment key={o.id}>
                  <tr className="border-t border-[#F0EDE8] hover:bg-[#F7F3EE] transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                        className="flex items-center gap-1 font-mono text-xs text-[#B07D45] hover:underline">
                        {o.id}
                        {expandedId === o.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#1C1A18] whitespace-nowrap">{o.customer}</td>
                    <td className="px-4 py-3 font-medium text-[#1C1A18]">RM {o.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[#7A7167]">{o.items}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[#7A7167] whitespace-nowrap">{o.date}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                        className="text-xs bg-[#F7F3EE] border border-[#D4C8BC] rounded px-2 py-1 text-[#1C1A18] cursor-pointer">
                        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openWA(o)}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-sm transition-colors whitespace-nowrap">
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {expandedId === o.id && (
                    <tr className="bg-[#F7F3EE]">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div><p className="text-xs text-[#7A7167] mb-1">Email</p><p className="text-[#1C1A18]">{o.email}</p></div>
                          <div><p className="text-xs text-[#7A7167] mb-1">Phone</p><p className="text-[#1C1A18]">{o.phone}</p></div>
                          <div><p className="text-xs text-[#7A7167] mb-1">Delivery Address</p><p className="text-[#1C1A18]">{o.address}</p></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[#7A7167] text-sm">No orders found.</div>
        )}
      </div>

      {/* WhatsApp Notification Modal */}
      {waOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1C1A18] text-sm">Send WhatsApp Notification</h3>
                  <p className="text-xs text-[#7A7167]">{waOrder.customer} · {waOrder.phone}</p>
                </div>
              </div>
              <button onClick={() => setWaOrder(null)}><X className="w-5 h-5 text-[#7A7167]" /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Order info */}
              <div className="bg-[#F7F3EE] rounded-sm p-3 text-sm flex items-center justify-between">
                <span className="text-[#7A7167]">Order</span>
                <span className="font-mono font-medium text-[#1C1A18]">{waOrder.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[waOrder.status]}`}>{waOrder.status}</span>
              </div>

              {/* Template selector */}
              <div>
                <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-2 block">Message Template</Label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {WA_TEMPLATES.map(t => (
                    <button key={t.id} onClick={() => handleTemplateChange(t.id)}
                      className={`py-2 px-3 text-xs rounded-sm border transition-colors text-left ${waTemplate === t.id ? "bg-[#1C1A18] text-white border-[#1C1A18]" : "border-[#D4C8BC] text-[#7A7167] hover:border-[#1C1A18]"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message preview / edit */}
              <div>
                <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-2 block">Message</Label>
                <textarea
                  value={waMessage}
                  onChange={e => setWaMessage(e.target.value)}
                  rows={8}
                  className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm px-3 py-2.5 text-sm text-[#1C1A18] resize-none focus:outline-none focus:border-green-500 font-mono"
                  placeholder="Type your message..."
                />
                <p className="text-xs text-[#A09488] mt-1">{waMessage.length} characters · You can edit the message before sending</p>
              </div>

              {/* Info note */}
              <div className="bg-green-50 border border-green-200 rounded-sm p-3 text-xs text-green-700">
                📱 Clicking "Send via WhatsApp" will open WhatsApp Web or the app with this pre-filled message to <strong>{waOrder.customer}</strong> ({waOrder.phone}).
              </div>

              {waSent && (
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 text-xs text-blue-700 flex items-center gap-2">
                  <Check className="w-4 h-4" /> WhatsApp opened! Verify the message was sent to the customer.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button onClick={() => setWaOrder(null)} variant="outline" className="flex-1 border-[#D4C8BC] rounded-sm">Cancel</Button>
                <Button onClick={handleSendWA}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-sm flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}