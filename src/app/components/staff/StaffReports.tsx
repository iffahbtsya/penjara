import { useState } from "react";
import { TrendingUp, Package, ShoppingBag, Users, FileText, Download, Calendar, BarChart2 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { Button } from "../ui/button";
import { toast } from "sonner";

const MONTHLY_DATA = [
  { month: "Jan", revenue: 12400, orders: 38, customers: 29 },
  { month: "Feb", revenue: 9800, orders: 30, customers: 24 },
  { month: "Mar", revenue: 14200, orders: 44, customers: 35 },
  { month: "Apr", revenue: 11700, orders: 36, customers: 28 },
  { month: "May", revenue: 16300, orders: 51, customers: 42 },
  { month: "Jun", revenue: 18900, orders: 58, customers: 47 },
  { month: "Jul", revenue: 21200, orders: 65, customers: 53 },
  { month: "Aug", revenue: 19400, orders: 60, customers: 49 },
  { month: "Sep", revenue: 22800, orders: 70, customers: 58 },
  { month: "Oct", revenue: 25100, orders: 77, customers: 63 },
  { month: "Nov", revenue: 28600, orders: 88, customers: 71 },
  { month: "Dec", revenue: 31400, orders: 97, customers: 82 },
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

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS = [2024, 2025, 2026];

export function StaffReports() {
  const [reportType, setReportType] = useState<"monthly" | "yearly">("monthly");
  const [selectedMonth, setSelectedMonth] = useState(5); // June
  const [selectedYear, setSelectedYear] = useState(2026);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const yearlyData = MONTHLY_DATA;
  const monthlyData = [MONTHLY_DATA[selectedMonth]];

  const displayData = reportType === "yearly" ? yearlyData : MONTHLY_DATA.slice(0, selectedMonth + 1);
  const totalRevenue = displayData.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = displayData.reduce((s, m) => s + m.orders, 0);
  const totalCustomers = displayData.reduce((s, m) => s + m.customers, 0);
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const reportTitle = reportType === "yearly"
    ? `Annual Sales Report ${selectedYear}`
    : `Monthly Sales Report — ${MONTHS[selectedMonth]} ${selectedYear}`;

  const handleGeneratePDF = () => {
    setGenerating(true);
    toast.loading("Generating PDF report...");

    setTimeout(() => {
      setGenerating(false);
      toast.dismiss();

      // Build HTML content for PDF
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${reportTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; color: #1C1A18; background: white; padding: 40px; }
    .header { border-bottom: 3px solid #B07D45; padding-bottom: 24px; margin-bottom: 32px; }
    .logo { font-size: 24px; font-weight: bold; color: #1C1A18; letter-spacing: 1px; }
    .logo span { color: #B07D45; }
    .report-title { font-size: 20px; color: #7A7167; margin-top: 6px; }
    .meta { font-size: 12px; color: #A09488; margin-top: 4px; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #B07D45; margin-bottom: 16px; border-bottom: 1px solid #EDE8E0; padding-bottom: 8px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: #F7F3EE; padding: 16px; border-left: 3px solid #B07D45; }
    .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #7A7167; margin-bottom: 6px; }
    .stat-value { font-size: 22px; font-weight: bold; color: #1C1A18; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #1C1A18; color: white; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    td { padding: 10px 12px; border-bottom: 1px solid #EDE8E0; }
    tr:nth-child(even) td { background: #F7F3EE; }
    .total-row td { font-weight: bold; background: #EDE8E0 !important; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #D4C8BC; font-size: 11px; color: #A09488; display: flex; justify-content: space-between; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; }
    .badge-wood { background: #FEF3C7; color: #92400E; }
    .badge-metal { background: #F1F5F9; color: #475569; }
    .badge-clothing { background: #FFF1F2; color: #BE123C; }
    h2 { font-size: 18px; margin-bottom: 8px; }
    .highlight { color: #B07D45; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SEREPOS – Seremban Prison Online Sales System <span>SALES</span></div>
    <div class="report-title">${reportTitle}</div>
    <div class="meta">Generated on ${new Date().toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · Confidential</div>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Total Revenue</div>
      <div class="stat-value">RM ${totalRevenue.toLocaleString()}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Orders</div>
      <div class="stat-value">${totalOrders}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Customers</div>
      <div class="stat-value">${totalCustomers}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Avg. Order Value</div>
      <div class="stat-value">RM ${avgOrder.toLocaleString()}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Revenue Breakdown</div>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Revenue (RM)</th>
          <th>Orders</th>
          <th>Customers</th>
          <th>Avg Order (RM)</th>
        </tr>
      </thead>
      <tbody>
        ${displayData.map(m => `
          <tr>
            <td>${m.month}</td>
            <td><strong>RM ${m.revenue.toLocaleString()}</strong></td>
            <td>${m.orders}</td>
            <td>${m.customers}</td>
            <td>RM ${Math.round(m.revenue / m.orders).toLocaleString()}</td>
          </tr>
        `).join("")}
        <tr class="total-row">
          <td>TOTAL</td>
          <td>RM ${totalRevenue.toLocaleString()}</td>
          <td>${totalOrders}</td>
          <td>${totalCustomers}</td>
          <td>RM ${avgOrder.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Top Performing Products</div>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Units Sold</th>
          <th>Revenue (RM)</th>
        </tr>
      </thead>
      <tbody>
        ${TOP_PRODUCTS.map(p => `
          <tr>
            <td>${p.name}</td>
            <td><span class="badge badge-${p.cat === "Wood" ? "wood" : p.cat === "Metal" ? "metal" : "clothing"}">${p.cat}</span></td>
            <td>${p.units}</td>
            <td><strong>RM ${p.revenue.toLocaleString()}</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Category Performance</div>
    <table>
      <thead><tr><th>Category</th><th>Share (%)</th><th>Est. Revenue (RM)</th></tr></thead>
      <tbody>
        ${CAT_PIE.map(c => `
          <tr>
            <td>${c.name}</td>
            <td>${c.value}%</td>
            <td>RM ${Math.round(totalRevenue * c.value / 100).toLocaleString()}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <span>SEREPOS – Seremban Prison Online Sales System · Confidential & Internal Use Only</span>
    <span>${reportTitle} · Page 1 of 1</span>
  </div>
</body>
</html>`;

      // Open in new window and trigger print/save as PDF
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(htmlContent);
        win.document.close();
        win.focus();
        setTimeout(() => {
          win.print();
        }, 500);
      }

      toast.success("Report opened! Use 'Save as PDF' in the print dialog.");
      setShowPreview(true);
    }, 1500);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">Reports</h1>
          <p className="text-sm text-[#7A7167] mt-1">Sales analytics and downloadable reports</p>
        </div>
      </div>

      {/* Report Generator Card */}
      <div className="bg-white rounded-sm shadow-sm p-6 mb-8 border-l-4 border-[#B07D45]">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="w-5 h-5 text-[#B07D45]" />
          <h2 className="font-semibold text-[#1C1A18]">Generate PDF Report</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {/* Report type */}
          <div>
            <label className="text-xs text-[#7A7167] uppercase tracking-widest mb-2 block">Report Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setReportType("monthly")}
                className={`py-2 text-sm rounded-sm border transition-colors ${reportType === "monthly" ? "bg-[#1C1A18] text-white border-[#1C1A18]" : "border-[#D4C8BC] text-[#7A7167] hover:border-[#1C1A18]"}`}>
                Monthly
              </button>
              <button onClick={() => setReportType("yearly")}
                className={`py-2 text-sm rounded-sm border transition-colors ${reportType === "yearly" ? "bg-[#1C1A18] text-white border-[#1C1A18]" : "border-[#D4C8BC] text-[#7A7167] hover:border-[#1C1A18]"}`}>
                Yearly
              </button>
            </div>
          </div>

          {/* Month selector — only for monthly */}
          {reportType === "monthly" && (
            <div>
              <label className="text-xs text-[#7A7167] uppercase tracking-widest mb-2 block">Month</label>
              <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
                className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3 text-sm text-[#1C1A18]">
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </div>
          )}

          {/* Year */}
          <div>
            <label className="text-xs text-[#7A7167] uppercase tracking-widest mb-2 block">Year</label>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3 text-sm text-[#1C1A18]">
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Preview of what will be generated */}
        <div className="bg-[#F7F3EE] rounded-sm p-4 mb-5">
          <p className="text-xs text-[#7A7167] mb-1">Report to be generated:</p>
          <p className="font-medium text-[#1C1A18]">{reportTitle}</p>
          <p className="text-xs text-[#A09488] mt-1">Includes: Revenue breakdown · Top products · Category performance · Order summary</p>
        </div>

        <Button onClick={handleGeneratePDF} disabled={generating}
          className="bg-[#B07D45] hover:bg-[#9A6C38] text-white rounded-sm flex items-center gap-2 h-11 px-6">
          {generating ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Download className="w-4 h-4" /> Generate & Download PDF</>
          )}
        </Button>
        <p className="text-xs text-[#A09488] mt-2">A print dialog will open — select "Save as PDF" to download.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `RM ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-[#B07D45]" },
          { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-blue-600" },
          { label: "Customers", value: totalCustomers, icon: Users, color: "text-green-600" },
          { label: "Avg Order Value", value: `RM ${avgOrder.toLocaleString()}`, icon: BarChart2, color: "text-purple-600" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-sm shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#7A7167] uppercase tracking-widest">{stat.label}</p>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-semibold text-[#1C1A18]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-sm shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-[#B07D45]" />
          <h2 className="font-semibold text-[#1C1A18]">Revenue Trend</h2>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={MONTHLY_DATA}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B07D45" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#B07D45" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} tickFormatter={v => `RM ${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`RM ${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "4px", border: "1px solid #D4C8BC", fontSize: "12px" }} />
            <Area type="monotone" dataKey="revenue" stroke="#B07D45" strokeWidth={2} fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Orders chart */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShoppingBag className="w-4 h-4 text-[#B07D45]" />
            <h2 className="font-semibold text-[#1C1A18]">Monthly Orders</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#7A7167" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "4px", border: "1px solid #D4C8BC", fontSize: "12px" }} />
              <Bar dataKey="orders" fill="#1C1A18" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Package className="w-4 h-4 text-[#B07D45]" />
            <h2 className="font-semibold text-[#1C1A18]">Sales by Category</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CAT_PIE} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {CAT_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} contentStyle={{ borderRadius: "4px", border: "1px solid #D4C8BC", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products table */}
      <div className="bg-white rounded-sm shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-[#B07D45]" />
          <h2 className="font-semibold text-[#1C1A18]">Top Performing Products</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F7F3EE]">
              {["#", "Product", "Category", "Units Sold", "Revenue"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#7A7167] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_PRODUCTS.map((p, i) => (
              <tr key={p.name} className="border-t border-[#F0EDE8] hover:bg-[#F7F3EE] transition-colors">
                <td className="px-4 py-3 text-[#A09488] text-xs">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-[#1C1A18]">{p.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.cat === "Wood" ? "bg-amber-100 text-amber-800" : p.cat === "Metal" ? "bg-slate-100 text-slate-700" : "bg-rose-100 text-rose-700"}`}>
                    {p.cat}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#1C1A18]">{p.units}</td>
                <td className="px-4 py-3 font-semibold text-[#1C1A18]">RM {p.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}