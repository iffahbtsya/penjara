import { useState } from "react";
import { Star, Percent, Shield, CheckCircle, Ticket, History, Copy, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

const STAFF_MEMBERS = [
  { id: "STF-001", name: "Ahmad Razif", role: "Senior Sales", points: 3200 },
  { id: "STF-002", name: "Nurul Ain", role: "Inventory Manager", points: 1850 },
  { id: "STF-003", name: "Kevin Tan", role: "Customer Service", points: 920 },
  { id: "STF-004", name: "Rashida Binti Musa", role: "Logistics", points: 2400 },
];

const VOUCHER_HISTORY_INIT = [
  { code: "STF20-A1B2C3", generatedDate: "10 Jun 2026", used: true, discount: "20%", usedDate: "11 Jun 2026" },
  { code: "STF20-D4E5F6", generatedDate: "5 May 2026", used: true, discount: "20%", usedDate: "6 May 2026" },
];

const PURCHASE_HISTORY = [
  { id: "TGS-STF-001", date: "11 Jun 2026", items: 2, original: 850, discount: 170, paid: 680 },
  { id: "TGS-STF-002", date: "6 May 2026", items: 1, original: 340, discount: 68, paid: 272 },
  { id: "TGS-STF-003", date: "18 Apr 2026", items: 3, original: 1200, discount: 240, paid: 960 },
];

function generateVoucherCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "STF20-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function StaffRewards() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"verify" | "vouchers" | "history">("verify");
  const [staffId, setStaffId] = useState("");
  const [verified, setVerified] = useState<typeof STAFF_MEMBERS[0] | null>(null);
  const [error, setError] = useState("");
  const [generatedVoucher, setGeneratedVoucher] = useState<string | null>(null);
  const [voucherHistory, setVoucherHistory] = useState(VOUCHER_HISTORY_INIT);
  const [copied, setCopied] = useState(false);

  const handleVerify = () => {
    const found = STAFF_MEMBERS.find(s => s.id.toLowerCase() === staffId.toLowerCase().trim());
    if (found) {
      setVerified(found);
      setError("");
      toast.success(`Staff verified: ${found.name}`);
    } else {
      setError("Staff ID not found. Please check and try again.");
      setVerified(null);
    }
  };

  const handleGenerateVoucher = () => {
    if (!verified) return;
    const code = generateVoucherCode();
    setGeneratedVoucher(code);
    setVoucherHistory(prev => [{
      code,
      generatedDate: new Date().toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }),
      used: false,
      discount: "20%",
      usedDate: "",
    }, ...prev]);
    toast.success("Voucher generated successfully!");
  };

  const handleCopy = () => {
    if (!generatedVoucher) return;
    navigator.clipboard.writeText(generatedVoucher);
    setCopied(true);
    toast.success("Voucher code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const totalSaved = PURCHASE_HISTORY.reduce((s, p) => s + p.discount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">Staff Rewards & Benefits</h1>
        <p className="text-sm text-[#7A7167] mt-1">Staff ID verification, voucher generation, and purchase history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Staff Discount", value: "20%", sub: "on all personal purchases", color: "text-[#B07D45]" },
          { label: "Total Saved (You)", value: `RM ${totalSaved.toLocaleString()}`, sub: "across all purchases", color: "text-green-700" },
          { label: "Your Staff Points", value: (user ? 3200 : 0).toLocaleString(), sub: "pts · 3× earn rate", color: "text-[#1C1A18]" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-sm shadow-sm p-5">
            <p className="text-xs text-[#7A7167] uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-[#A09488] mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-white rounded-sm p-1 shadow-sm mb-8 w-fit">
        {([
          { id: "verify", label: "Verify & Generate" },
          { id: "vouchers", label: "Voucher History" },
          { id: "history", label: "Purchase History" },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm rounded-sm transition-colors ${tab === t.id ? "bg-[#1C1A18] text-white" : "text-[#7A7167] hover:bg-[#F7F3EE]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Verify tab */}
      {tab === "verify" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Staff ID verification */}
          <div className="bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-5 h-5 text-[#B07D45]" />
              <h2 className="font-medium text-[#1C1A18]">Staff ID Verification</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Enter Staff ID</Label>
                <div className="flex gap-2">
                  <Input value={staffId} onChange={e => setStaffId(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleVerify()}
                    placeholder="e.g. STF-001"
                    className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm flex-1" />
                  <Button onClick={handleVerify} className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm px-5">Verify</Button>
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>

              {verified && (
                <div className="border border-green-200 bg-green-50 rounded-sm p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium text-sm">Staff Verified</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2"><span className="text-[#7A7167] w-28">Name:</span><span className="text-[#1C1A18] font-medium">{verified.name}</span></div>
                    <div className="flex gap-2"><span className="text-[#7A7167] w-28">Role:</span><span className="text-[#1C1A18]">{verified.role}</span></div>
                    <div className="flex gap-2"><span className="text-[#7A7167] w-28">Staff ID:</span><span className="text-[#1C1A18] font-mono">{verified.id}</span></div>
                    <div className="flex gap-2"><span className="text-[#7A7167] w-28">Points:</span><span className="font-semibold text-[#1C1A18]">{verified.points.toLocaleString()} pts</span></div>
                  </div>

                  {/* Voucher generation */}
                  <div className="border-t border-green-200 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Percent className="w-5 h-5 text-[#B07D45]" />
                      <span className="font-semibold text-[#1C1A18] text-sm">Generate 20% Staff Voucher</span>
                    </div>
                    <p className="text-xs text-[#7A7167] mb-4">Generate a one-time use voucher code for 20% off your purchase. Valid for 7 days.</p>

                    {!generatedVoucher ? (
                      <Button onClick={handleGenerateVoucher} className="w-full bg-[#B07D45] hover:bg-[#9A6C38] text-white rounded-sm h-10">
                        Generate Voucher Code
                      </Button>
                    ) : (
                      <div className="bg-white border border-[#B07D45] rounded-sm p-4">
                        <p className="text-xs text-[#7A7167] mb-2">Your voucher code:</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-bold text-xl text-[#1C1A18] flex-1">{generatedVoucher}</p>
                          <button onClick={handleCopy} className="p-2 border border-[#D4C8BC] rounded-sm hover:bg-[#F7F3EE] transition-colors">
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-[#7A7167]" />}
                          </button>
                        </div>
                        <p className="text-xs text-[#B07D45] mt-2">✓ 20% off · Valid for 7 days · One-time use</p>
                        <Button onClick={handleGenerateVoucher} variant="outline" className="w-full mt-3 border-[#D4C8BC] text-[#7A7167] rounded-sm text-xs h-8">
                          Generate New Code
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-[#F7F3EE] rounded-sm p-3 text-xs text-[#7A7167]">
                <p className="font-medium text-[#1C1A18] mb-1">Test Staff IDs:</p>
                <p>STF-001, STF-002, STF-003, STF-004</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-5 h-5 text-[#B07D45]" />
              <h2 className="font-medium text-[#1C1A18]">Staff Points Leaderboard</h2>
            </div>
            <div className="space-y-3 mb-6">
              {[...STAFF_MEMBERS].sort((a, b) => b.points - a.points).map((staff, i) => (
                <div key={staff.id} className="flex items-center gap-4 py-3 border-b border-[#EDE8E0]">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? "bg-[#B07D45] text-white" : i === 1 ? "bg-[#9BA4B4] text-white" : i === 2 ? "bg-[#A0785A] text-white" : "bg-[#EDE8E0] text-[#7A7167]"}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1C1A18]">{staff.name}</p>
                    <p className="text-xs text-[#7A7167]">{staff.role} · {staff.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1C1A18]">{staff.points.toLocaleString()} pts</p>
                    <span className="text-xs text-[#B07D45]">20% eligible</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#F7F3EE] rounded-sm p-4">
              <h3 className="text-sm font-medium text-[#1C1A18] mb-2">Discount Policy</h3>
              <ul className="text-xs text-[#7A7167] space-y-1">
                <li>• All confirmed staff receive 20% discount on personal purchases</li>
                <li>• Maximum discount of RM 2,000 per month per staff</li>
                <li>• Staff earn points at 3× rate</li>
                <li>• Cannot be combined with other promotions</li>
                <li>• Voucher must be used within 7 days of generation</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Voucher history tab */}
      {tab === "vouchers" && (
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Ticket className="w-5 h-5 text-[#B07D45]" />
            <h2 className="font-medium text-[#1C1A18]">Voucher History</h2>
          </div>
          <div className="space-y-3">
            {voucherHistory.map((v, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-[#EDE8E0]">
                <div>
                  <p className="font-mono font-semibold text-[#1C1A18]">{v.code}</p>
                  <p className="text-xs text-[#7A7167] mt-0.5">Generated: {v.generatedDate}</p>
                  {v.used && v.usedDate && <p className="text-xs text-[#7A7167]">Used: {v.usedDate}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-[#B07D45]/10 text-[#B07D45] border-0">{v.discount} OFF</Badge>
                  <Badge className={`border-0 ${v.used ? "bg-[#EDE8E0] text-[#7A7167]" : "bg-green-100 text-green-700"}`}>
                    {v.used ? "Used" : "Active"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchase history tab */}
      {tab === "history" && (
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-[#B07D45]" />
            <h2 className="font-medium text-[#1C1A18]">Purchase History</h2>
          </div>
          <div className="space-y-4">
            {PURCHASE_HISTORY.map(p => (
              <div key={p.id} className="border border-[#EDE8E0] rounded-sm p-5">
                <div className="flex flex-wrap justify-between gap-2 mb-3">
                  <div>
                    <p className="font-mono font-medium text-[#1C1A18] text-sm">{p.id}</p>
                    <p className="text-xs text-[#7A7167]">{p.date} · {p.items} item{p.items !== 1 ? "s" : ""}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 h-fit">Staff Purchase</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-[#7A7167] mb-1">Original Price</p>
                    <p className="text-[#1C1A18] line-through">RM {p.original.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#7A7167] mb-1">Discount (20%)</p>
                    <p className="text-green-700 font-medium">- RM {p.discount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#7A7167] mb-1">Total Paid</p>
                    <p className="text-[#1C1A18] font-semibold">RM {p.paid.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-[#F7F3EE] rounded-sm p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-[#7A7167]">Total Saved with Staff Discount</p>
              <p className="text-xl font-semibold text-green-700">RM {totalSaved.toLocaleString()}</p>
            </div>
            <Percent className="w-8 h-8 text-[#B07D45]" />
          </div>
        </div>
      )}
    </div>
  );
}