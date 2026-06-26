import { useState } from "react";
import { useNavigate } from "react-router";
import { Star, Gift, Cake, Ticket, History, ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const VOUCHERS = [
  { code: "WOOD10", desc: "10% off Wood Products", expiry: "30 Jul 2026", used: false },
  { code: "FREESHIP", desc: "Free Shipping on next order", expiry: "31 Aug 2026", used: false },
  { code: "BDAY20", desc: "20% Birthday Discount", expiry: "18 Jun 2026", used: true },
];

const TIERS = [
  { name: "Bronze", min: 0, max: 999, perks: ["1 pt per RM1 spent", "Birthday voucher"] },
  { name: "Silver", min: 1000, max: 2499, perks: ["1.5 pts per RM1", "Free shipping once/month", "Birthday voucher"] },
  { name: "Gold", min: 2500, max: 4999, perks: ["2 pts per RM1", "Free shipping always", "Double points month", "Early access"] },
  { name: "Platinum", min: 5000, max: Infinity, perks: ["3 pts per RM1", "Exclusive products", "Priority support", "Annual gift"] },
];

function getTier(points: number) {
  return TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
}
function getNextTier(points: number) {
  const idx = TIERS.findIndex(t => points >= t.min && points <= t.max);
  return TIERS[idx + 1] || null;
}

export function Rewards() {
  const { user, updatePoints } = useAuth();
  const navigate = useNavigate();
  const points = user?.rewardPoints || 0;
  const tier = getTier(points);
  const nextTier = getNextTier(points);
  const tierProgress = nextTier ? ((points - tier.min) / (nextTier.min - tier.min)) * 100 : 100;

  const [redeemAmount, setRedeemAmount] = useState("");
  const [tab, setTab] = useState<"overview" | "redeem" | "vouchers" | "history">("overview");
  const [bdayUsed, setBdayUsed] = useState(false);

  const HISTORY = [
    { action: "Purchase — TGS-847291", points: "+1200", date: "12 Jun 2026" },
    { action: "Purchase — TGS-651082", points: "+420", date: "3 May 2026" },
    { action: "Birthday Bonus", points: "+200", date: "17 Jun 2026" },
    { action: "Points Redeemed", points: "-500", date: "10 May 2026" },
  ];

  const handleRedeem = () => {
    const amount = parseInt(redeemAmount);
    if (!amount || amount <= 0) { toast.error("Please enter a valid amount."); return; }
    if (amount > points) { toast.error(`You only have ${points} points available.`); return; }
    if (amount > 5000) { toast.error("Maximum redemption is 5,000 points per transaction."); return; }
    updatePoints(points - amount);
    toast.success(`${amount} points redeemed! RM${(amount * 0.01).toFixed(2)} discount applied.`);
    setRedeemAmount("");
  };

  const handleUseBirthday = () => {
    if (bdayUsed) { toast.error("Birthday reward already used this month."); return; }
    setBdayUsed(true);
    toast.success("Birthday voucher BDAY20 activated! Use it at checkout for 20% off.");
    navigate("/catalogue");
  };

  const handleApplyVoucher = (code: string) => {
    toast.success(`Voucher ${code} copied! Apply it at checkout.`);
    navigator.clipboard.writeText(code).catch(() => {});
  };

  const tierColors: Record<string, string> = {
    Bronze: "from-amber-700 to-amber-600",
    Silver: "from-slate-500 to-slate-400",
    Gold: "from-[#B07D45] to-[#D4A574]",
    Platinum: "from-slate-700 to-slate-500",
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <div className="bg-gradient-to-br from-[#1C1A18] to-[#3D3530] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="w-10 h-10 text-[#B07D45] mx-auto mb-4" />
          <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-2">Loyalty Program</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-white mb-4">Three Good Rewards</h1>
          <p className="text-[#A09488] max-w-md mx-auto text-sm">Earn points with every purchase. Redeem for discounts and exclusive benefits.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Points card */}
        <div className={`bg-gradient-to-r ${tierColors[tier.name]} rounded-sm p-8 text-white shadow-lg`}>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-white/60 text-sm uppercase tracking-widest mb-1">Your Balance</p>
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-6xl mb-1">{points.toLocaleString()}</p>
              <p className="text-white/60 text-sm">points · worth RM {(points * 0.01).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-white border-0 text-sm px-4 py-1.5 mb-2">{tier.name} Tier</Badge>
              {nextTier && <p className="text-white/60 text-sm">{(nextTier.min - points).toLocaleString()} pts to {nextTier.name}</p>}
            </div>
          </div>
          {nextTier && (
            <div className="mt-6">
              <div className="flex justify-between text-xs text-white/60 mb-2">
                <span>{tier.name} ({tier.min.toLocaleString()} pts)</span>
                <span>{nextTier.name} ({nextTier.min.toLocaleString()} pts)</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${Math.min(100, tierProgress)}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-sm p-1 shadow-sm w-fit flex-wrap">
          {([
            { id: "overview", label: "Overview" },
            { id: "redeem", label: "Redeem Points" },
            { id: "vouchers", label: "My Vouchers" },
            { id: "history", label: "History" },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm rounded-sm transition-colors ${tab === t.id ? "bg-[#1C1A18] text-white" : "text-[#7A7167] hover:bg-[#F7F3EE]"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <>
            {/* Birthday reward */}
            <div className="bg-gradient-to-r from-[#B07D45]/20 to-[#D4A574]/20 border border-[#B07D45]/30 rounded-sm p-6 flex flex-wrap items-center gap-6">
              <Cake className="w-12 h-12 text-[#B07D45] flex-shrink-0" />
              <div className="flex-1">
                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18] mb-1">Birthday Reward</h3>
                <p className="text-sm text-[#7A7167]">
                  {bdayUsed
                    ? "Birthday voucher activated! Use code BDAY20 at checkout for 20% off."
                    : "Celebrate your birthday with a special 20% discount — auto-activated during your birthday month."}
                </p>
              </div>
              <Button
                onClick={handleUseBirthday}
                disabled={bdayUsed}
                className={`rounded-sm text-white ${bdayUsed ? "bg-green-600 cursor-default" : "bg-[#B07D45] hover:bg-[#9A6C38]"}`}>
                {bdayUsed ? "✓ Activated" : "Use Now"}
              </Button>
            </div>

            {/* Tiers */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-[#B07D45]" />
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18]">Loyalty Tiers</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TIERS.map(t => {
                  const isActive = t.name === tier.name;
                  return (
                    <div key={t.name} className={`border rounded-sm p-5 ${isActive ? "border-[#B07D45] bg-[#FBF8F4]" : "border-[#EDE8E0]"}`}>
                      {isActive && <Badge className="bg-[#B07D45] text-white border-0 text-xs mb-3">Current</Badge>}
                      <p style={{ fontFamily: "'Playfair Display', serif" }} className={`text-lg mb-1 ${isActive ? "text-[#B07D45]" : "text-[#1C1A18]"}`}>{t.name}</p>
                      <p className="text-xs text-[#7A7167] mb-3">{t.min.toLocaleString()} – {t.max === Infinity ? "∞" : t.max.toLocaleString()} pts</p>
                      <ul className="space-y-1">
                        {t.perks.map(p => (
                          <li key={p} className="text-xs text-[#7A7167] flex items-start gap-1">
                            <span className="text-[#B07D45] mt-0.5">✓</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick redeem CTA */}
            <button onClick={() => setTab("redeem")} className="w-full bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm p-5 flex items-center justify-between transition-colors group">
              <div className="flex items-center gap-4">
                <Gift className="w-8 h-8 text-[#B07D45] group-hover:text-white transition-colors" />
                <div className="text-left">
                  <p className="font-medium">Redeem Your Points</p>
                  <p className="text-sm text-white/60">1 point = RM 0.01 off your next order</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Redeem */}
        {tab === "redeem" && (
          <div className="bg-white rounded-sm shadow-sm p-8 max-w-lg">
            <div className="flex items-center gap-2 mb-6">
              <Gift className="w-5 h-5 text-[#B07D45]" />
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18]">Redeem Points</h2>
            </div>
            <div className="bg-[#F7F3EE] rounded-sm p-4 mb-6 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-[#7A7167]">Available Points</span><span className="font-semibold text-[#1C1A18]">{points.toLocaleString()} pts</span></div>
              <div className="flex justify-between"><span className="text-[#7A7167]">Equivalent Value</span><span className="text-[#B07D45]">RM {(points * 0.01).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-[#7A7167]">Max per transaction</span><span className="text-[#7A7167]">5,000 pts</span></div>
            </div>
            <div className="mb-6">
              <label className="text-xs text-[#7A7167] uppercase tracking-widest mb-2 block">Points to Redeem</label>
              <div className="flex gap-2">
                <Input type="number" value={redeemAmount} onChange={e => setRedeemAmount(e.target.value)}
                  placeholder="Enter points amount" max={Math.min(points, 5000)}
                  className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-11 text-sm flex-1" />
                <Button onClick={() => setRedeemAmount(String(Math.min(points, 5000)))} variant="outline" className="border-[#D4C8BC] text-[#7A7167] rounded-sm text-sm">Max</Button>
              </div>
              {redeemAmount && parseInt(redeemAmount) > 0 && (
                <p className="text-sm text-[#B07D45] mt-2">= RM {(parseInt(redeemAmount) * 0.01).toFixed(2)} discount</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {[100, 250, 500, 1000].map(amt => (
                <button key={amt} onClick={() => setRedeemAmount(String(Math.min(amt, points)))}
                  disabled={points < amt}
                  className={`px-3 py-1.5 border rounded-sm text-sm transition-colors ${points >= amt ? "border-[#D4C8BC] text-[#7A7167] hover:border-[#B07D45] hover:text-[#B07D45]" : "border-[#EDE8E0] text-[#C4B8AC] cursor-not-allowed"}`}>
                  {amt} pts
                </button>
              ))}
            </div>
            <Button onClick={handleRedeem} disabled={!redeemAmount || parseInt(redeemAmount) <= 0}
              className="w-full bg-[#B07D45] hover:bg-[#9A6C38] text-white h-11 rounded-sm">
              Redeem Points
            </Button>
            <p className="text-xs text-center text-[#7A7167] mt-3">Points redemption applies at your next checkout</p>
          </div>
        )}

        {/* Vouchers */}
        {tab === "vouchers" && (
          <div className="bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Ticket className="w-5 h-5 text-[#B07D45]" />
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18]">My Vouchers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VOUCHERS.map(v => (
                <div key={v.code} className={`border rounded-sm p-5 relative ${v.used ? "opacity-50 border-[#D4C8BC]" : "border-[#B07D45]/40 bg-[#FBF8F4]"}`}>
                  {v.used && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-red-400 border-2 border-red-400 rounded px-3 py-1 text-xs font-semibold rotate-[-15deg]">USED</span>
                    </div>
                  )}
                  <p className="font-mono font-bold text-[#1C1A18] text-base mb-1">{v.code}</p>
                  <p className="text-sm text-[#7A7167] mb-3">{v.desc}</p>
                  <p className="text-xs text-[#A09488] mb-3">Expires: {v.expiry}</p>
                  {!v.used && (
                    <Button onClick={() => handleApplyVoucher(v.code)}
                      className="w-full bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm text-xs h-8">
                      Copy & Apply at Checkout
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {tab === "history" && (
          <div className="bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-[#B07D45]" />
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18]">Points History</h2>
            </div>
            <div className="space-y-3">
              {HISTORY.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#EDE8E0]">
                  <div>
                    <p className="text-sm text-[#1C1A18]">{h.action}</p>
                    <p className="text-xs text-[#A09488]">{h.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${h.points.startsWith("+") ? "text-green-700" : "text-red-500"}`}>{h.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}