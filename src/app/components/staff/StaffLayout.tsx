import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Package, BarChart3, Truck, Settings, Star, User, Menu, X, Package as PkgIcon, ChevronRight, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { path: "/staff/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/staff/products", icon: Package, label: "Products" },
  { path: "/staff/orders", icon: Truck, label: "Orders" },
  { path: "/staff/reports", icon: BarChart3, label: "Reports" },
  { path: "/staff/rewards", icon: Star, label: "Staff Rewards" },
  { path: "/staff/account", icon: User, label: "My Account" },
];

interface StaffLayoutProps {
  children: React.ReactNode;
  staffName: string;
  onLogout: () => void;
}

export function StaffLayout({ children, staffName, onLogout }: StaffLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0EDE8] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1A18] transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:flex lg:flex-col`}>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <PkgIcon className="w-5 h-5 text-[#B07D45]" />
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-white">Staff Portal</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${active ? "bg-[#B07D45] text-white" : "text-[#A09488] hover:bg-white/5 hover:text-white"}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 bg-[#B07D45] rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {staffName.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-medium">{staffName}</p>
              <p className="text-[#7A7167] text-xs">Staff Member</p>
            </div>
          </div>
          <button onClick={() => { onLogout(); navigate("/"); }} className="w-full flex items-center gap-2 text-xs text-[#7A7167] hover:text-white px-2 py-1.5 rounded transition-colors">
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-[#E0D9D2] px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#7A7167]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <Link to="/" className="text-xs text-[#B07D45] hover:underline">← Back to Store</Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1C1A18]">
            <User className="w-4 h-4 text-[#7A7167]" />
            <span>{staffName}</span>
          </div>
        </div>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
