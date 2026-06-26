import { useState } from "react";
import { User, Edit2, BarChart3, Package, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface StaffAccountProps {
  staffName: string;
}

export function StaffAccount({ staffName }: StaffAccountProps) {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: staffName,
    email: "staff@tgs.com",
    phone: "+60 12-987 6543",
    staffId: "STF-001",
    role: "Senior Sales",
    department: "Customer Relations",
    joined: "15 March 2022",
  });

  const STATS = [
    { icon: ShoppingBag, label: "Orders Processed", value: "1,204" },
    { icon: Package, label: "Products Managed", value: "15" },
    { icon: BarChart3, label: "Reports Generated", value: "48" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">Staff Account</h1>
        <p className="text-sm text-[#7A7167] mt-1">Your profile and work summary</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1C1A18] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {staffName.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18]">{profile.name}</h2>
                  <p className="text-sm text-[#7A7167]">{profile.role} · {profile.department}</p>
                  <p className="text-xs text-[#A09488] mt-0.5">Staff ID: {profile.staffId}</p>
                </div>
              </div>
              <button onClick={() => setEditMode(!editMode)} className="flex items-center gap-1.5 text-sm text-[#B07D45] hover:underline">
                <Edit2 className="w-4 h-4" /> {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name", key: "name" as const, type: "text" },
                { label: "Email Address", key: "email" as const, type: "email" },
                { label: "Phone Number", key: "phone" as const, type: "tel" },
                { label: "Role", key: "role" as const, type: "text" },
              ].map(field => (
                <div key={field.key}>
                  <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-1.5 block">{field.label}</Label>
                  {editMode ? (
                    <Input type={field.type} value={profile[field.key]} onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                      className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                  ) : (
                    <p className="text-[#1C1A18] text-sm py-2 border-b border-[#EDE8E0]">{profile[field.key]}</p>
                  )}
                </div>
              ))}
              <div>
                <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-1.5 block">Department</Label>
                <p className="text-[#1C1A18] text-sm py-2 border-b border-[#EDE8E0]">{profile.department}</p>
              </div>
              <div>
                <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-1.5 block">Date Joined</Label>
                <p className="text-[#1C1A18] text-sm py-2 border-b border-[#EDE8E0]">{profile.joined}</p>
              </div>
            </div>

            {editMode && (
              <div className="flex gap-3 mt-5">
                <Button onClick={() => setEditMode(false)} className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm">Save Changes</Button>
                <Button onClick={() => setEditMode(false)} variant="outline" className="border-[#D4C8BC] rounded-sm">Cancel</Button>
              </div>
            )}
          </div>

          {/* Change password */}
          <div className="bg-white rounded-sm shadow-sm p-6">
            <h3 className="font-medium text-[#1C1A18] mb-4">Change Password</h3>
            <div className="space-y-4 max-w-sm">
              {["Current Password", "New Password", "Confirm New Password"].map(f => (
                <div key={f}>
                  <Label className="text-xs text-[#7A7167] mb-1.5 block">{f}</Label>
                  <Input type="password" placeholder="••••••••" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
              ))}
              <Button className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm text-sm">Update Password</Button>
            </div>
          </div>
        </div>

        {/* Side stats */}
        <div className="space-y-5">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-sm shadow-sm p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#B07D45]/10 rounded-sm flex items-center justify-center">
                <s.icon className="w-5 h-5 text-[#B07D45]" />
              </div>
              <div>
                <p className="text-xl font-semibold text-[#1C1A18]">{s.value}</p>
                <p className="text-xs text-[#7A7167]">{s.label}</p>
              </div>
            </div>
          ))}

          {/* Recent activity */}
          <div className="bg-white rounded-sm shadow-sm p-5">
            <h3 className="text-sm font-medium text-[#1C1A18] mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: "Updated order TGS-847291 status to Delivered", time: "2h ago" },
                { action: "Added new product: Mahogany Side Table", time: "5h ago" },
                { action: "Generated June sales report", time: "1d ago" },
                { action: "Processed staff discount for STF-002", time: "2d ago" },
              ].map((a, i) => (
                <div key={i} className="border-b border-[#EDE8E0] pb-3">
                  <p className="text-xs text-[#1C1A18]">{a.action}</p>
                  <p className="text-xs text-[#A09488] mt-0.5">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
