import { useState } from "react";
import { Link } from "react-router";
import { User, Package, MapPin, Settings, Star, ChevronRight, Edit2, FileText, Truck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useAuth } from "../context/AuthContext";

const ORDER_HISTORY = [
  { id: "TGS-847291", date: "12 Jun 2024", items: 3, total: 1330, status: "Delivered" },
  { id: "TGS-651082", date: "3 May 2024", items: 1, total: 420, status: "Shipped" },
  { id: "TGS-503774", date: "18 Apr 2024", items: 2, total: 254, status: "Processing" },
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Pending: "bg-slate-100 text-slate-600",
};

export function MyAccount() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"profile" | "orders" | "addresses" | "settings">("profile");
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+60 12-345 6789",
  });

  const tabs = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "orders", icon: Package, label: "Order History" },
    { id: "addresses", icon: MapPin, label: "Addresses" },
    { id: "settings", icon: Settings, label: "Settings" },
  ] as const;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <div className="bg-[#1C1A18] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-5">
          <div className="w-14 h-14 bg-[#B07D45] rounded-full flex items-center justify-center text-white text-xl font-semibold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-[#A09488] text-sm">Welcome back</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl text-white">{user.name}</h1>
          </div>
          <div className="ml-auto hidden md:block">
            <Badge className="bg-[#B07D45]/20 text-[#B07D45] border-0">Gold Member</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="bg-white rounded-sm shadow-sm p-4 h-fit">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors mb-1 ${tab === t.id ? "bg-[#1C1A18] text-white" : "text-[#7A7167] hover:bg-[#F7F3EE]"}`}>
                <t.icon className="w-4 h-4" />
                {t.label}
                <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
              </button>
            ))}
          </div>

          <div className="md:col-span-3">

            {/* Profile tab */}
            {tab === "profile" && (
              <div className="bg-white rounded-sm shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18]">My Profile</h2>
                  <button onClick={() => setEditMode(!editMode)} className="flex items-center gap-2 text-sm text-[#B07D45] hover:underline">
                    <Edit2 className="w-4 h-4" /> {editMode ? "Cancel" : "Edit"}
                  </button>
                </div>
                <div className="space-y-5">
                  {[
                    { label: "Full Name", key: "name" as const, type: "text" },
                    { label: "Email Address", key: "email" as const, type: "email" },
                    { label: "Phone Number", key: "phone" as const, type: "tel" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs text-[#7A7167] uppercase tracking-widest mb-1.5 block">{field.label}</label>
                      {editMode ? (
                        <Input type={field.type} value={profile[field.key]}
                          onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                          className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                      ) : (
                        <p className="text-[#1C1A18] text-sm py-2 border-b border-[#EDE8E0]">{profile[field.key]}</p>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <Button onClick={() => setEditMode(false)} className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm">Save Changes</Button>
                  )}
                </div>

                <div className="mt-8 bg-gradient-to-r from-[#1C1A18] to-[#3D3530] rounded-sm p-5 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#A09488] text-xs uppercase tracking-widest mb-1">Loyalty Points</p>
                      <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl">{(user.rewardPoints || 0).toLocaleString()} pts</p>
                    </div>
                    <Star className="w-10 h-10 text-[#B07D45]" />
                  </div>
                  <p className="text-[#A09488] text-xs mt-3">Gold Tier · Earn 1 pt per RM1 spent</p>
                </div>
              </div>
            )}

            {/* Orders tab */}
            {tab === "orders" && (
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18] mb-6">Order History</h2>
                <div className="space-y-4">
                  {ORDER_HISTORY.map(order => (
                    <div key={order.id} className="border border-[#EDE8E0] rounded-sm p-4 hover:border-[#D4C8BC] transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <p className="font-medium text-[#1C1A18] text-sm font-mono">{order.id}</p>
                          <p className="text-xs text-[#7A7167] mt-0.5">{order.date} · {order.items} item{order.items !== 1 ? "s" : ""}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1C1A18]">RM {order.total.toLocaleString()}</span>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <Link to={`/invoice/${order.id}`}>
                            <button className="flex items-center gap-1 text-xs text-[#7A7167] hover:text-[#1C1A18] border border-[#EDE8E0] rounded-sm px-2 py-1 hover:border-[#D4C8BC] transition-colors">
                              <FileText className="w-3 h-3" /> Invoice
                            </button>
                          </Link>
                          <Link to={`/track/${order.id}`}>
                            <button className="flex items-center gap-1 text-xs text-[#7A7167] hover:text-[#1C1A18] border border-[#EDE8E0] rounded-sm px-2 py-1 hover:border-[#D4C8BC] transition-colors">
                              <Truck className="w-3 h-3" /> Track
                            </button>
                          </Link>
                          {/* Only show Write Review if Delivered */}
                          {order.status === "Delivered" && (
                            <Link to="/reviews/write">
                              <button className="flex items-center gap-1 text-xs bg-[#B07D45] text-white rounded-sm px-3 py-1 hover:bg-[#9A6C38] transition-colors">
                                <Star className="w-3 h-3" /> Write Review
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Delivered note */}
                      {order.status === "Delivered" && (
                        <p className="text-xs text-green-700 mt-2 bg-green-50 rounded px-2 py-1">
                          ✓ Order delivered — you can now leave a review
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses tab */}
            {tab === "addresses" && (
              <div className="bg-white rounded-sm shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18]">Saved Addresses</h2>
                  <Button className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm text-sm h-9">+ Add Address</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Home", address: "No. 12, Jalan Bukit Bintang, 50450 Kuala Lumpur, Selangor", default: true },
                    { label: "Office", address: "Level 15, Menara Citibank, 165 Jalan Ampang, 50450 Kuala Lumpur", default: false },
                  ].map(a => (
                    <div key={a.label} className={`border rounded-sm p-4 relative ${a.default ? "border-[#B07D45]" : "border-[#D4C8BC]"}`}>
                      {a.default && <span className="absolute top-3 right-3 text-xs text-[#B07D45] bg-[#B07D45]/10 px-2 py-0.5 rounded-full">Default</span>}
                      <p className="font-medium text-sm text-[#1C1A18] mb-1">{a.label}</p>
                      <p className="text-xs text-[#7A7167] leading-relaxed">{a.address}</p>
                      <div className="flex gap-3 mt-3">
                        <button className="text-xs text-[#B07D45] hover:underline">Edit</button>
                        {!a.default && <button className="text-xs text-[#7A7167] hover:underline">Set as default</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings tab */}
            {tab === "settings" && (
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18] mb-6">Account Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: "Email Notifications", desc: "Receive order updates and promotions", enabled: true },
                    { label: "SMS Alerts", desc: "Get delivery status via SMS", enabled: false },
                    { label: "Birthday Rewards", desc: "Automatic birthday reward activation", enabled: true },
                  ].map(s => (
                    <div key={s.label} className="flex items-start justify-between py-3 border-b border-[#EDE8E0]">
                      <div>
                        <p className="text-sm font-medium text-[#1C1A18]">{s.label}</p>
                        <p className="text-xs text-[#7A7167] mt-0.5">{s.desc}</p>
                      </div>
                      <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${s.enabled ? "bg-[#B07D45]" : "bg-[#D4C8BC]"}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${s.enabled ? "translate-x-5" : "translate-x-1"}`} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 rounded-sm text-sm">Delete Account</Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}