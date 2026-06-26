import { Link } from "react-router";
import { Package, ShoppingBag, DollarSign, Users, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12400 }, { month: "Feb", revenue: 9800 }, { month: "Mar", revenue: 14200 },
  { month: "Apr", revenue: 11700 }, { month: "May", revenue: 16300 }, { month: "Jun", revenue: 18900 },
];

const catData = [
  { cat: "Wood", sales: 42 }, { cat: "Metal", sales: 31 }, { cat: "Clothing", sales: 67 },
];

const RECENT_ORDERS = [
  { id: "TGS-847291", customer: "Jane Doe", amount: 1330, status: "Delivered", date: "12 Jun" },
  { id: "TGS-651082", customer: "Ahmad R.", amount: 420, status: "Shipped", date: "3 Jun" },
  { id: "TGS-503774", customer: "Siti N.", amount: 254, status: "Processing", date: "1 Jun" },
  { id: "TGS-412590", customer: "Chen W.", amount: 890, status: "Pending", date: "28 May" },
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Pending: "bg-slate-100 text-slate-600",
};

const LOW_STOCK = [
  { name: "Steel Workbench", qty: 6, cat: "Metal" },
  { name: "Metal Locker Cabinet", qty: 7, cat: "Metal" },
  { name: "Mahogany Bookshelf", qty: 5, cat: "Wood" },
];

export function StaffDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">Dashboard</h1>
        <p className="text-[#7A7167] text-sm mt-1">Welcome back, Ahmad. Here's today's overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: DollarSign, label: "Total Revenue", value: "RM 83,400", change: "+12.4%", up: true, color: "#B07D45" },
          { icon: ShoppingBag, label: "Orders This Month", value: "142", change: "+8.1%", up: true, color: "#2D6A4F" },
          { icon: Package, label: "Products Listed", value: "15", change: "2 low stock", up: false, color: "#1C1A18" },
          { icon: Users, label: "Active Customers", value: "2,419", change: "+3.2%", up: true, color: "#6B4226" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-sm p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ backgroundColor: kpi.color + "15" }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${kpi.up ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{kpi.change}</span>
            </div>
            <p className="text-2xl font-semibold text-[#1C1A18]">{kpi.value}</p>
            <p className="text-xs text-[#7A7167] mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-sm p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-medium text-[#1C1A18]">Revenue Overview</h2>
            <span className="text-xs text-[#7A7167]">Jan – Jun 2024</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B07D45" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#B07D45" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} tickFormatter={v => `RM${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`RM ${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "4px", border: "1px solid #D4C8BC", fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#B07D45" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by category */}
        <div className="bg-white rounded-sm p-6 shadow-sm">
          <h2 className="font-medium text-[#1C1A18] mb-5">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="cat" type="category" tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ borderRadius: "4px", border: "1px solid #D4C8BC", fontSize: 12 }} />
              <Bar dataKey="sales" fill="#B07D45" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-sm shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-medium text-[#1C1A18]">Recent Orders</h2>
            <Link to="/staff/orders" className="text-xs text-[#B07D45] hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EDE8E0]">
                {["Order ID", "Customer", "Amount", "Status", "Date"].map(h => (
                  <th key={h} className="text-left py-2 text-xs text-[#7A7167] font-medium uppercase tracking-wider pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map(o => (
                <tr key={o.id} className="border-b border-[#F0EDE8] hover:bg-[#F7F3EE] transition-colors">
                  <td className="py-3 font-mono text-xs text-[#B07D45]">{o.id}</td>
                  <td className="py-3 text-[#1C1A18]">{o.customer}</td>
                  <td className="py-3 font-medium text-[#1C1A18]">RM {o.amount.toLocaleString()}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                  <td className="py-3 text-[#7A7167]">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2 className="font-medium text-[#1C1A18]">Low Stock Alert</h2>
          </div>
          <div className="space-y-3">
            {LOW_STOCK.map(item => (
              <div key={item.name} className="flex items-center justify-between py-2 border-b border-[#EDE8E0]">
                <div>
                  <p className="text-sm text-[#1C1A18]">{item.name}</p>
                  <p className="text-xs text-[#7A7167]">{item.cat}</p>
                </div>
                <span className="text-sm font-semibold text-amber-600">{item.qty} left</span>
              </div>
            ))}
          </div>
          <Link to="/staff/products" className="mt-4 block">
            <button className="w-full text-xs text-center py-2 border border-[#D4C8BC] rounded-sm text-[#7A7167] hover:bg-[#F7F3EE] transition-colors">Manage Inventory</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
