import { TrendingUp, Package, ShoppingBag, Users } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const MONTHLY = [
  { month: "Jan", revenue: 12400, orders: 38 }, { month: "Feb", revenue: 9800, orders: 30 },
  { month: "Mar", revenue: 14200, orders: 44 }, { month: "Apr", revenue: 11700, orders: 36 },
  { month: "May", revenue: 16300, orders: 51 }, { month: "Jun", revenue: 18900, orders: 58 },
];

const CAT_PIE = [
  { name: "Wood", value: 35, color: "#6B4226" },
  { name: "Metal", value: 28, color: "#3D3D3D" },
  { name: "Clothing", value: 37, color: "#B07D45" },
];

const TOP_PRODUCTS = [
  { name: "Classic Cotton Polo", revenue: 5850, units: 90, cat: "Clothing" },
  { name: "Teak Dining Table", revenue: 14400, units: 12, cat: "Wood" },
  { name: "Industrial Shelf Unit", revenue: 8400, units: 20, cat: "Metal" },
  { name: "Formal Batik Shirt", revenue: 4180, units: 38, cat: "Clothing" },
  { name: "Steel Workbench", revenue: 7020, units: 9, cat: "Metal" },
];

export function StaffReports() {
  const totalRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = MONTHLY.reduce((s, m) => s + m.orders, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">Reports & Analytics</h1>
        <p className="text-sm text-[#7A7167] mt-1">Performance overview — January to June 2024</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: TrendingUp, label: "Total Revenue", value: `RM ${totalRevenue.toLocaleString()}`, sub: "Jan–Jun 2024", color: "#B07D45" },
          { icon: ShoppingBag, label: "Total Orders", value: totalOrders, sub: "+8.1% vs last period", color: "#2D6A4F" },
          { icon: Package, label: "Products Sold", value: "1,240 units", sub: "Across 15 products", color: "#6B4226" },
          { icon: Users, label: "New Customers", value: "318", sub: "This period", color: "#1C1A18" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-sm p-5 shadow-sm">
            <div className="w-10 h-10 rounded-sm mb-3 flex items-center justify-center" style={{ backgroundColor: card.color + "15" }}>
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <p className="text-2xl font-semibold text-[#1C1A18]">{card.value}</p>
            <p className="text-xs text-[#7A7167] mt-0.5">{card.label}</p>
            <p className="text-xs text-[#A09488] mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-sm shadow-sm p-6">
          <h2 className="font-medium text-[#1C1A18] mb-5">Monthly Revenue & Orders</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B07D45" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#B07D45" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} tickFormatter={v => `RM${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number, name: string) => [name === "revenue" ? `RM ${v.toLocaleString()}` : v, name === "revenue" ? "Revenue" : "Orders"]} contentStyle={{ borderRadius: "4px", border: "1px solid #D4C8BC", fontSize: 12 }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#B07D45" strokeWidth={2} fill="url(#revG)" />
              <Bar yAxisId="right" dataKey="orders" fill="#6B4226" opacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-6">
          <h2 className="font-medium text-[#1C1A18] mb-5">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CAT_PIE} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {CAT_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconSize={10} iconType="circle" formatter={(val) => <span style={{ fontSize: 11, color: "#7A7167" }}>{val}</span>} />
              <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: "4px", border: "1px solid #D4C8BC", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-sm shadow-sm p-6">
        <h2 className="font-medium text-[#1C1A18] mb-5">Top Products by Revenue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EDE8E0]">
                {["#", "Product", "Category", "Units Sold", "Revenue"].map(h => (
                  <th key={h} className="text-left pb-3 px-2 text-xs uppercase tracking-wider text-[#7A7167] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.sort((a, b) => b.revenue - a.revenue).map((p, i) => (
                <tr key={p.name} className="border-b border-[#F0EDE8] hover:bg-[#F7F3EE]">
                  <td className="py-3 px-2 text-[#7A7167]">#{i + 1}</td>
                  <td className="py-3 px-2 font-medium text-[#1C1A18]">{p.name}</td>
                  <td className="py-3 px-2 text-[#7A7167]">{p.cat}</td>
                  <td className="py-3 px-2 text-[#1C1A18]">{p.units}</td>
                  <td className="py-3 px-2 font-semibold text-[#1C1A18]">RM {p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
