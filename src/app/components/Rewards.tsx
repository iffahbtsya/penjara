import { Star, Gift, Cake, Ticket, ChevronRight, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const VOUCHERS = [
  { code: "WOOD10", desc: "10% off Wood Products", expiry: "30 Jul 2024", used: false },
  { code: "FREESHIP", desc: "Free Shipping on next order", expiry: "31 Aug 2024", used: false },
  { code: "BDAY20", desc: "20% Birthday Discount", expiry: "18 Jun 2024", used: true },
];

const HISTORY = [
  { action: "Purchase — TGS-847291", points: "+120", date: "12 Jun 2024" },
  { action: "Birthday Bonus", points: "+200", date: "17 Jun 2024" },
  { action: "Voucher Redeemed — BDAY20", points: "-0", date: "10 May 2024" },
  { action: "Purchase — TGS-651082", points: "+42", date: "3 May 2024" },
];

const TIERS = [
  { name: "Bronze", range: "0 – 999 pts", perks: ["1 pt per RM1 spent", "Birthday voucher"] },
  { name: "Silver", range: "1,000 – 2,499 pts", perks: ["1.5 pts per RM1", "Free shipping once/month", "Birthday voucher"] },
  { name: "Gold", range: "2,500 – 4,999 pts", perks: ["2 pts per RM1", "Free shipping always", "Double points month", "Early access"] },
  { name: "Platinum", range: "5,000+ pts", perks: ["3 pts per RM1", "Exclusive products", "Priority support", "Annual gift"] },
];

export function Rewards() {
  const currentPoints = 2450;
  const tierProgress = ((currentPoints - 1000) / (2500 - 1000)) * 100;

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1C1A18] to-[#3D3530] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="w-10 h-10 text-[#B07D45] mx-auto mb-4" />
          <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-2">Loyalty Program</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-white mb-4">Three Good Rewards</h1>
          <p className="text-[#A09488] max-w-md mx-auto">Earn points with every purchase. Redeem for discounts, vouchers, and exclusive benefits.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Points card */}
        <div className="bg-gradient-to-r from-[#1C1A18] to-[#6B4226] rounded-sm p-8 text-white">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-[#A09488] text-sm uppercase tracking-widest mb-1">Your Balance</p>
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl mb-1">{currentPoints.toLocaleString()}</p>
              <p className="text-[#A09488] text-sm">points</p>
            </div>
            <div className="text-right">
              <Badge className="bg-[#B07D45] text-white border-0 text-sm px-3 py-1 mb-2">Gold Tier</Badge>
              <p className="text-[#A09488] text-sm">50 pts to Platinum</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-[#A09488] mb-2">
              <span>Gold (2,500 pts)</span>
              <span>Platinum (5,000 pts)</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#B07D45] rounded-full transition-all" style={{ width: `${Math.min(100, tierProgress)}%` }} />
            </div>
            <p className="text-xs text-[#A09488] mt-2">2,550 more points to reach Platinum status</p>
          </div>
        </div>

        {/* Birthday reward */}
        <div className="bg-gradient-to-r from-[#B07D45]/20 to-[#D4A574]/20 border border-[#B07D45]/30 rounded-sm p-6 flex items-center gap-6">
          <Cake className="w-12 h-12 text-[#B07D45] flex-shrink-0" />
          <div className="flex-1">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18] mb-1">Birthday Reward</h3>
            <p className="text-sm text-[#7A7167]">Happy Birthday! Your special 20% discount is active this month.</p>
          </div>
          <Button className="bg-[#B07D45] hover:bg-[#9A6C38] text-white rounded-sm">Use Now</Button>
        </div>

        {/* Vouchers */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Ticket className="w-5 h-5 text-[#B07D45]" />
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18]">My Vouchers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VOUCHERS.map(v => (
              <div key={v.code} className={`border rounded-sm p-4 relative ${v.used ? "opacity-50 border-[#D4C8BC]" : "border-[#B07D45]/40 bg-[#FBF8F4]"}`}>
                {v.used && <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-400 border-2 border-red-400 rounded px-2 text-xs rotate-[-15deg] font-semibold">USED</span>
                </div>}
                <p className="font-mono font-semibold text-[#1C1A18] text-sm mb-1">{v.code}</p>
                <p className="text-xs text-[#7A7167] mb-2">{v.desc}</p>
                <p className="text-xs text-[#A09488]">Expires: {v.expiry}</p>
                {!v.used && (
                  <Button className="mt-3 w-full bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm text-xs h-8">Apply to Cart</Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tiers */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-[#B07D45]" />
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18]">Loyalty Tiers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((tier, i) => {
              const isActive = tier.name === "Gold";
              return (
                <div key={tier.name} className={`border rounded-sm p-5 ${isActive ? "border-[#B07D45] bg-[#FBF8F4]" : "border-[#EDE8E0]"}`}>
                  {isActive && <Badge className="bg-[#B07D45] text-white border-0 text-xs mb-3">Current</Badge>}
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className={`text-lg mb-1 ${isActive ? "text-[#B07D45]" : "text-[#1C1A18]"}`}>{tier.name}</p>
                  <p className="text-xs text-[#7A7167] mb-3">{tier.range}</p>
                  <ul className="space-y-1">
                    {tier.perks.map(p => (
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

        {/* Points history */}
        <div className="bg-white rounded-sm shadow-sm p-6">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl text-[#1C1A18] mb-5">Points History</h2>
          <div className="space-y-3">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#EDE8E0]">
                <div>
                  <p className="text-sm text-[#1C1A18]">{h.action}</p>
                  <p className="text-xs text-[#A09488]">{h.date}</p>
                </div>
                <span className={`text-sm font-semibold ${h.points.startsWith("+") ? "text-green-700" : "text-[#7A7167]"}`}>{h.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
