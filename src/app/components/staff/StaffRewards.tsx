import { useState } from "react";
import { Star, Percent, Shield, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const STAFF_MEMBERS = [
  { id: "STF-001", name: "Ahmad Razif", role: "Senior Sales", points: 3200, discount: true },
  { id: "STF-002", name: "Nurul Ain", role: "Inventory Manager", points: 1850, discount: true },
  { id: "STF-003", name: "Kevin Tan", role: "Customer Service", points: 920, discount: false },
  { id: "STF-004", name: "Rashida Binti Musa", role: "Logistics", points: 2400, discount: true },
];

export function StaffRewards() {
  const [staffId, setStaffId] = useState("");
  const [verified, setVerified] = useState<typeof STAFF_MEMBERS[0] | null>(null);
  const [error, setError] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const handleVerify = () => {
    const found = STAFF_MEMBERS.find(s => s.id.toLowerCase() === staffId.toLowerCase().trim());
    if (found) { setVerified(found); setError(""); }
    else { setError("Staff ID not found. Please check and try again."); setVerified(null); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">Staff Rewards</h1>
        <p className="text-sm text-[#7A7167] mt-1">Manage staff discounts and loyalty points</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Staff ID verification */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-[#B07D45]" />
            <h2 className="font-medium text-[#1C1A18]">Staff Verification & Discount</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs text-[#7A7167] mb-1.5 block">Enter Staff ID</Label>
              <div className="flex gap-2">
                <Input value={staffId} onChange={e => setStaffId(e.target.value)} placeholder="e.g. STF-001"
                  className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm flex-1" />
                <Button onClick={handleVerify} className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm px-4">Verify</Button>
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {verified && (
              <div className="border border-green-200 bg-green-50 rounded-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium text-sm">Staff Verified</span>
                </div>
                <div className="space-y-1.5 text-sm mb-4">
                  <div className="flex gap-2"><span className="text-[#7A7167] w-28">Name:</span><span className="text-[#1C1A18] font-medium">{verified.name}</span></div>
                  <div className="flex gap-2"><span className="text-[#7A7167] w-28">Role:</span><span className="text-[#1C1A18]">{verified.role}</span></div>
                  <div className="flex gap-2"><span className="text-[#7A7167] w-28">Staff ID:</span><span className="text-[#1C1A18] font-mono">{verified.id}</span></div>
                  <div className="flex gap-2"><span className="text-[#7A7167] w-28">Points:</span><span className="text-[#1C1A18] font-semibold">{verified.points.toLocaleString()} pts</span></div>
                </div>
                {verified.discount && !discountApplied && (
                  <div className="bg-[#B07D45]/10 border border-[#B07D45]/30 rounded-sm p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-5 h-5 text-[#B07D45]" />
                      <span className="font-semibold text-[#1C1A18]">20% Staff Discount Available</span>
                    </div>
                    <p className="text-xs text-[#7A7167] mb-3">This staff member is eligible for the 20% employee purchase discount.</p>
                    <Button onClick={() => setDiscountApplied(true)} className="bg-[#B07D45] hover:bg-[#9A6C38] text-white rounded-sm text-sm w-full">Apply 20% Discount</Button>
                  </div>
                )}
                {discountApplied && (
                  <div className="bg-green-100 border border-green-300 rounded-sm p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 text-sm">20% discount applied to this transaction</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-[#7A7167] mt-4 bg-[#F7F3EE] rounded-sm p-3">
            Try: STF-001, STF-002, STF-003, or STF-004
          </p>
        </div>

        {/* All staff points */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Star className="w-5 h-5 text-[#B07D45]" />
            <h2 className="font-medium text-[#1C1A18]">Staff Rewards Leaderboard</h2>
          </div>
          <div className="space-y-3">
            {[...STAFF_MEMBERS].sort((a, b) => b.points - a.points).map((staff, i) => (
              <div key={staff.id} className="flex items-center gap-4 py-3 border-b border-[#EDE8E0]">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-[#B07D45] text-white" : i === 1 ? "bg-[#9BA4B4] text-white" : i === 2 ? "bg-[#A0785A] text-white" : "bg-[#EDE8E0] text-[#7A7167]"}`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1C1A18]">{staff.name}</p>
                  <p className="text-xs text-[#7A7167]">{staff.role} · {staff.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#1C1A18]">{staff.points.toLocaleString()} pts</p>
                  {staff.discount && <span className="text-xs text-[#B07D45]">Discount eligible</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Discount policy */}
          <div className="mt-6 bg-[#F7F3EE] rounded-sm p-4">
            <h3 className="text-sm font-medium text-[#1C1A18] mb-2">Staff Discount Policy</h3>
            <ul className="text-xs text-[#7A7167] space-y-1">
              <li>• All confirmed staff receive 20% discount on personal purchases</li>
              <li>• Discount applies to a maximum of RM 2,000 per month</li>
              <li>• Points earned at 3× rate for staff purchases</li>
              <li>• Discount cannot be combined with other promotions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
