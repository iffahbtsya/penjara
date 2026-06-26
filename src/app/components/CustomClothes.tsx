import { useState, useRef } from "react";
import { Upload, Type, Palette, Eye, ShoppingCart, Check, X, Shirt } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { LoginRequiredModal } from "./LoginRequiredModal";
import { toast } from "sonner";

const SHIRT_COLORS = [
  { name: "White", hex: "#FFFFFF", border: true },
  { name: "Black", hex: "#1C1A18" },
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Red", hex: "#C0392B" },
  { name: "Forest Green", hex: "#2D6A4F" },
  { name: "Sand", hex: "#D4A96A" },
  { name: "Charcoal", hex: "#4A4A4A" },
  { name: "Royal Blue", hex: "#2563EB" },
];

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const FONT_STYLES = ["Classic Serif", "Modern Sans", "Bold Block", "Script", "Monospace"];
const SHIRT_TYPES = ["T-Shirt", "Polo Shirt", "Hoodie"];
const VIEWS = ["Front", "Back"];

// SVG shirt shapes
function ShirtSVG({ type, color, hasBorder }: { type: string; color: string; hasBorder: boolean }) {
  const stroke = hasBorder ? "#D4C8BC" : "none";
  if (type === "Hoodie") {
    return (
      <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M80 25 Q95 10 110 10 Q125 10 140 25 L165 15 L200 50 L215 95 L180 100 L180 245 L40 245 L40 100 L5 95 L20 50 L55 15 Z"
          fill={color} stroke={stroke} strokeWidth="1.5" />
        {/* Hood */}
        <path d="M80 25 Q95 5 110 5 Q125 5 140 25 Q130 40 110 42 Q90 40 80 25Z"
          fill={color} stroke={stroke} strokeWidth="1" />
        {/* Pocket */}
        <rect x="75" y="170" width="70" height="45" rx="4" fill={color} stroke={hasBorder ? "#C4B8AC" : "rgba(255,255,255,0.15)"} strokeWidth="1" />
      </svg>
    );
  }
  if (type === "Polo Shirt") {
    return (
      <svg width="220" height="250" viewBox="0 0 220 250" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M75 20 L40 55 L20 45 L5 90 L40 95 L40 235 L180 235 L180 95 L215 90 L200 45 L180 55 L145 20 Q130 28 118 28 L118 70 L102 70 L102 28 Q90 28 75 20Z"
          fill={color} stroke={stroke} strokeWidth="1.5" />
        {/* Collar */}
        <path d="M102 28 L102 70 L118 70 L118 28 Q114 35 110 36 Q106 35 102 28Z"
          fill={hasBorder ? "#EDE8E0" : "rgba(0,0,0,0.15)"} />
        {/* Buttons */}
        {[38, 50, 62].map(y => (
          <circle key={y} cx="110" cy={y} r="2.5" fill={hasBorder ? "#D4C8BC" : "rgba(255,255,255,0.4)"} />
        ))}
      </svg>
    );
  }
  // Default T-Shirt
  return (
    <svg width="220" height="245" viewBox="0 0 220 245" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M75 20 L40 55 L20 45 L5 90 L40 95 L40 230 L180 230 L180 95 L215 90 L200 45 L180 55 L145 20 Q130 32 110 32 Q90 32 75 20Z"
        fill={color} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

export function CustomClothes() {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [shirtType, setShirtType] = useState(SHIRT_TYPES[0]);
  const [shirtColor, setShirtColor] = useState(SHIRT_COLORS[0]);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#1C1A18");
  const [fontStyle, setFontStyle] = useState(FONT_STYLES[0]);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [view, setView] = useState("Front");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [added, setAdded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const basePrice = shirtType === "Hoodie" ? 85 : shirtType === "Polo Shirt" ? 70 : 55;
  const textFee = text.trim() ? 15 : 0;
  const logoFee = logoPreview ? 20 : 0;
  const unitPrice = basePrice + textFee + logoFee;

  const getFontFamily = () => {
    switch (fontStyle) {
      case "Classic Serif": return "Georgia, serif";
      case "Script": return "cursive";
      case "Monospace": return "monospace";
      case "Bold Block": return "Impact, sans-serif";
      default: return "sans-serif";
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    addToCart({
      id: Date.now(),
      name: `Custom ${shirtType} (${shirtColor.name})`,
      price: unitPrice,
      image: logoPreview || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=300&fit=crop&auto=format",
      size,
      color: shirtColor.name,
      cat: "baju",
      customDesign: {
        text: text || undefined,
        font: fontStyle,
        textColor,
        logoUrl: logoPreview || undefined,
      },
    }, qty);
    toast.success("Custom design added to cart!");
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isWhite = shirtColor.hex === "#FFFFFF";

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}
        message="Please log in to save your design and add it to cart." />

      <div className="bg-[#1C1A18] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-2">Design Studio</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-white">Custom Clothing</h1>
          <p className="text-[#A09488] mt-2 text-sm">Upload logos, add text, pick colours — see your design live.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT — Controls */}
          <div className="space-y-5 order-2 lg:order-1">

            {/* Garment type */}
            <div className="bg-white rounded-sm p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-semibold text-[#1C1A18] mb-4"><Shirt className="w-4 h-4 text-[#B07D45]" /> Garment Type</h3>
              <div className="grid grid-cols-3 gap-2">
                {SHIRT_TYPES.map(type => (
                  <button key={type} onClick={() => setShirtType(type)}
                    className={`py-2.5 text-sm rounded-sm border transition-colors ${shirtType === type ? "bg-[#1C1A18] text-white border-[#1C1A18]" : "border-[#D4C8BC] text-[#7A7167] hover:border-[#1C1A18]"}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour */}
            <div className="bg-white rounded-sm p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-semibold text-[#1C1A18] mb-4"><Palette className="w-4 h-4 text-[#B07D45]" /> Garment Colour</h3>
              <div className="flex flex-wrap gap-3">
                {SHIRT_COLORS.map(c => (
                  <button key={c.name} onClick={() => setShirtColor(c)} title={c.name}
                    className={`w-9 h-9 rounded-full transition-all hover:scale-110 ${shirtColor.name === c.name ? "ring-2 ring-[#B07D45] ring-offset-2" : ""}`}
                    style={{ backgroundColor: c.hex, border: c.border ? "1px solid #D4C8BC" : "none" }} />
                ))}
              </div>
              <p className="text-xs text-[#7A7167] mt-3">Selected: <span className="font-medium text-[#1C1A18]">{shirtColor.name}</span></p>
            </div>

            {/* Logo upload */}
            <div className="bg-white rounded-sm p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-semibold text-[#1C1A18] mb-4">
                <Upload className="w-4 h-4 text-[#B07D45]" /> Upload Logo / Image <span className="text-xs font-normal text-[#7A7167]">(+RM20)</span>
              </h3>
              {logoPreview ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-sm p-3">
                  <img src={logoPreview} alt="logo" className="w-12 h-12 object-contain rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-green-700 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Uploaded</p>
                    <p className="text-xs text-[#7A7167] truncate">{logoName}</p>
                  </div>
                  <button onClick={() => { setLogoPreview(null); setLogoName(""); }} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D4C8BC] rounded-sm p-8 cursor-pointer hover:border-[#B07D45] transition-colors">
                  <Upload className="w-8 h-8 text-[#D4C8BC] mb-2" />
                  <p className="text-sm text-[#7A7167]">Click to upload PNG / JPG / SVG</p>
                  <p className="text-xs text-[#A09488] mt-1">Max 10MB</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              )}
            </div>

            {/* Custom text */}
            <div className="bg-white rounded-sm p-5 shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-[#1C1A18]">
                <Type className="w-4 h-4 text-[#B07D45]" /> Custom Text <span className="text-xs font-normal text-[#7A7167]">(+RM15)</span>
              </h3>
              <div>
                <Label className="text-xs text-[#7A7167] mb-1 block">Text / Slogan</Label>
                <Input value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Your Company Name" maxLength={30}
                  className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                <p className="text-xs text-[#A09488] mt-1 text-right">{text.length}/30</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1 block">Font Style</Label>
                  <select value={fontStyle} onChange={e => setFontStyle(e.target.value)}
                    className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3 text-sm text-[#1C1A18]">
                    {FONT_STYLES.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1 block">Text Colour</Label>
                  <div className="flex items-center gap-2 bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent" />
                    <span className="text-sm font-mono text-[#1C1A18]">{textColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Size & Qty */}
            <div className="bg-white rounded-sm p-5 shadow-sm">
              <h3 className="font-semibold text-[#1C1A18] mb-4">Size & Quantity</h3>
              <div className="mb-4">
                <Label className="text-xs text-[#7A7167] mb-2 block">Size</Label>
                <div className="flex flex-wrap gap-2">
                  {SHIRT_SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`w-12 h-9 text-sm rounded-sm border transition-colors ${size === s ? "bg-[#1C1A18] text-white border-[#1C1A18]" : "border-[#D4C8BC] text-[#7A7167] hover:border-[#1C1A18]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs text-[#7A7167] mb-2 block">Quantity</Label>
                <div className="flex items-center border border-[#D4C8BC] rounded-sm w-fit">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-[#EDE8E0] text-[#1C1A18] transition-colors">−</button>
                  <span className="w-12 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 hover:bg-[#EDE8E0] text-[#1C1A18] transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Live Preview */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-sm shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-semibold text-[#1C1A18]"><Eye className="w-4 h-4 text-[#B07D45]" /> Live Preview</h3>
                {/* Front / Back toggle */}
                <div className="flex gap-1 bg-[#F7F3EE] rounded-sm p-1">
                  {VIEWS.map(v => (
                    <button key={v} onClick={() => setView(v)}
                      className={`px-3 py-1 text-xs rounded-sm transition-colors ${view === v ? "bg-[#1C1A18] text-white" : "text-[#7A7167]"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview canvas */}
              <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#F7F3EE] rounded-sm p-6 relative">
                <div className="relative inline-block">
                  <ShirtSVG type={shirtType} color={shirtColor.hex} hasBorder={isWhite} />

                  {/* Logo overlay on shirt */}
                  {logoPreview && view === "Front" && (
                    <div className="absolute" style={{ top: "22%", left: "50%", transform: "translateX(-50%)" }}>
                      <img src={logoPreview} alt="logo preview" className="w-14 h-14 object-contain" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} />
                    </div>
                  )}

                  {/* Text overlay on shirt */}
                  {text && (
                    <div className="absolute" style={{
                      top: logoPreview && view === "Front" ? "52%" : "38%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "130px",
                      textAlign: "center",
                    }}>
                      <p style={{
                        color: textColor,
                        fontFamily: getFontFamily(),
                        fontSize: fontStyle === "Bold Block" ? "14px" : "12px",
                        fontWeight: fontStyle === "Bold Block" ? 900 : 600,
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}>{text}</p>
                    </div>
                  )}

                  {/* Back view placeholder */}
                  {view === "Back" && !text && !logoPreview && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-[#A09488]">Back — no design</p>
                    </div>
                  )}
                  {view === "Back" && text && (
                    <div className="absolute" style={{ top: "35%", left: "50%", transform: "translateX(-50%)", width: "130px", textAlign: "center" }}>
                      <p style={{
                        color: textColor,
                        fontFamily: getFontFamily(),
                        fontSize: fontStyle === "Bold Block" ? "16px" : "13px",
                        fontWeight: fontStyle === "Bold Block" ? 900 : 600,
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                      }}>{text}</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#7A7167] mt-3">{shirtType} · {shirtColor.name} · Size {size} · {view} View</p>
              </div>

              {/* Price summary */}
              <div className="mt-5 space-y-2 text-sm border-t border-[#EDE8E0] pt-4">
                <div className="flex justify-between text-[#7A7167]"><span>Base {shirtType}</span><span>RM {basePrice}</span></div>
                {text.trim() && <div className="flex justify-between text-[#7A7167]"><span>Custom text</span><span>+ RM {textFee}</span></div>}
                {logoPreview && <div className="flex justify-between text-[#7A7167]"><span>Logo print</span><span>+ RM {logoFee}</span></div>}
                <div className="flex justify-between text-[#7A7167]"><span>Qty</span><span>× {qty}</span></div>
                <div className="border-t border-[#D4C8BC] pt-2 flex justify-between font-semibold text-[#1C1A18]">
                  <span>Total</span><span>RM {(unitPrice * qty).toLocaleString()}</span>
                </div>
              </div>

              <Button onClick={handleAddToCart} className={`w-full h-11 rounded-sm mt-5 flex items-center justify-center gap-2 transition-colors text-white ${added ? "bg-green-600 hover:bg-green-700" : "bg-[#1C1A18] hover:bg-[#B07D45]"}`}>
                {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart — RM {(unitPrice * qty).toLocaleString()}</>}
              </Button>

              {!isLoggedIn && <p className="text-xs text-center text-[#A09488] mt-2">🔒 Login required to add to cart</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}