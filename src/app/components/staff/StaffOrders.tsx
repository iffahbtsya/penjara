import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

const ALL_ORDERS = [
  { id: "TGS-847291", customer: "Jane Doe", email: "jane@example.com", phone: "+60 12-345 6789", amount: 1330, items: 3, status: "Delivered", date: "12 Jun 2024", address: "No. 12, Jalan Bukit Bintang, KL" },
  { id: "TGS-651082", customer: "Ahmad Razif", email: "ahmad@example.com", phone: "+60 11-234 5678", amount: 420, items: 1, status: "Shipped", date: "3 Jun 2024", address: "Level 3, Menara Citibank, KL" },
  { id: "TGS-503774", customer: "Siti Nora", email: "siti@example.com", phone: "+60 13-456 7890", amount: 254, items: 2, status: "Processing", date: "1 Jun 2024", address: "45 Jalan Cheras, Selangor" },
  { id: "TGS-412590", customer: "Chen Wei", email: "chen@example.com", phone: "+60 16-789 0123", amount: 890, items: 1, status: "Pending", date: "28 May 2024", address: "22 Jalan Ampang, KL" },
  { id: "TGS-398201", customer: "Priya Sharma", email: "priya@example.com", phone: "+60 17-012 3456", amount: 185, items: 1, status: "Delivered", date: "20 May 2024", address: "88 Jalan SS2, Petaling Jaya" },
  { id: "TGS-274103", customer: "Ismail Bin Omar", email: "ismail@example.com", phone: "+60 19-345 6789", amount: 650, items: 2, status: "Cancelled", date: "15 May 2024", address: "10 Jalan Kerinchi, KL" },
];

const STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Pending: "bg-slate-100 text-slate-600",
  Cancelled: "bg-red-100 text-red-600",
};
const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export function StaffOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = orders
    .filter(o => statusFilter === "All" || o.status === statusFilter)
    .filter(o => !search || o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase()));

  const updateStatus = (id: string, status: string) => {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">Orders</h1>
        <p className="text-sm text-[#7A7167] mt-1">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7167]" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..." className="pl-9 bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-9 text-sm" />
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {STATUSES.slice(1).map(s => {
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
                {["Order ID", "Customer", "Amount", "Items", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider text-[#7A7167] font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <React.Fragment key={o.id}>
                  <tr className="border-t border-[#F0EDE8] hover:bg-[#F7F3EE] transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}>
                    <td className="px-5 py-3 font-mono text-xs text-[#B07D45] whitespace-nowrap">{o.id}</td>
                    <td className="px-5 py-3 text-[#1C1A18] whitespace-nowrap">{o.customer}</td>
                    <td className="px-5 py-3 font-medium text-[#1C1A18]">RM {o.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-[#7A7167]">{o.items}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3 text-[#7A7167] whitespace-nowrap">{o.date}</td>
                    <td className="px-5 py-3">
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <select
                          value={o.status}
                          onChange={e => updateStatus(o.id, e.target.value)}
                          className="text-xs bg-[#F7F3EE] border border-[#D4C8BC] rounded px-2 py-1 text-[#1C1A18] cursor-pointer"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                  {expandedId === o.id && (
                    <tr className="bg-[#F7F3EE]">
                      <td colSpan={7} className="px-5 py-4">
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
          <div className="py-12 text-center text-[#7A7167] text-sm">No orders match your criteria.</div>
        )}
      </div>
    </div>
  );
}
