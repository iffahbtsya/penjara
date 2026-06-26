import { useState } from "react";
import { Upload, Type, Palette, ShoppingCart, Check } from "lucide-react";
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

export function CustomClothes() {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [shirtType, setShirtType] = useState(SHIRT_TYPES[0]);
  const [shirtColor, setShirtColor] = useState(SHIRT_COLORS[0]);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#1C1A18");
  const [fontStyle, setFontStyle] = useState(FONT_STYLES[0]);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [logoName, setLogoName] = useState("");
  const [added, setAdded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const basePrice = shirtType === "Hoodie" ? 85 : shirtType === "Polo Shirt" ? 70 : 55;
  const textPrice = text ? 15 : 0;
  const logoPrice = logoName ? 20 : 0;
  const unitPrice = basePrice + textPrice + logoPrice;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    addToCart({
      id: Date.now(),
      name: `Custom ${shirtType} (${shirtColor.name})`,
      price: unitPrice,
      image: "",
      size,
      color: shirtColor.name,
      cat: "baju",
      customDesign: {
        text,
        font: fontStyle,
        textColor,
        logoUrl: logoName || undefined,
      },
    }, qty);
    setAdded(true);
    toast.success("Custom design added to cart!");
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to save your design and add it to cart."
      />

      <div className="bg-[#1C1A18] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-2">Design Studio</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-white">Custom Clothing</h1>
          <p className="text-[#A09488] mt-2 text-sm">Personalise your garment — upload logos, add text, choose colours.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — controls */}
          <div className="space-y-6">
            {/* Shirt type */}
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <h3 className="font-semibold text-[#1C1A18] mb-4">1. Choose Garment Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {SHIRT_TYPES.map(type => (
                  <button key={type} onClick={() => setShirtType(type)}
                    className={`py-3 text-sm rounded-sm border transition-colors ${shirtType === type ? "bg-[#1C1A18] text-white border-[#1C1A18]" : "border-[#D4C8BC] text-[#7A7167] hover:border-[#1C1A18]"}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Shirt colour */}
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <h3 className="font-semibold text-[#1C1A18] mb-4">2. Garment Colour</h3>
              <div className="flex flex-wrap gap-3">
                {SHIRT_COLORS.map(color => (
                  <button key={color.name} onClick={() => setShirtColor(color)} title={color.name}
                    className={`w-9 h-9 rounded-full transition-all ${shirtColor.name === color.name ? "ring-2 ring-[#B07D45] ring-offset-2" : ""} ${color.border ? "border border-[#D4C8BC]" : ""}`}
                    style={{ backgroundColor: color.hex }} />
                ))}
              </div>
              <p className="text-xs text-[#7A7167] mt-3">Selected: <span className="font-medium text-[#1C1A18]">{shirtColor.name}</span></p>
            </div>

            {/* Upload logo */}
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <h3 className="font-semibold text-[#1C1A18] mb-4">3. Upload Logo / Image <span className="text-xs text-[#7A7167] font-normal">(+RM20)</span></h3>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D4C8BC] rounded-sm p-8 cursor-pointer hover:border-[#B07D45] transition-colors">
                <Upload className="w-8 h-8 text-[#7A7167] mb-2" />
                <span className="text-sm text-[#7A7167]">{logoName || "Click to upload PNG / JPG / SVG"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setLogoName(e.target.files?.[0]?.name || "")} />
              </label>
              {logoName && <p className="text-xs text-green-700 mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> {logoName}</p>}
            </div>

            {/* Custom text */}
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <h3 className="font-semibold text-[#1C1A18] mb-4">4. Custom Text <span className="text-xs text-[#7A7167] font-normal">(+RM15)</span></h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1 block">Text</Label>
                  <Input value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Company Name, Slogan..." className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-[#7A7167] mb-1 block">Font Style</Label>
                    <select value={fontStyle} onChange={e => setFontStyle(e.target.value)} className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3 text-sm text-[#1C1A18]">
                      {FONT_STYLES.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs text-[#7A7167] mb-1 block">Text Colour</Label>
                    <div className="flex items-center gap-2 bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3">
                      <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer" />
                      <span className="text-sm text-[#1C1A18]">{textColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Size & Qty */}
            <div className="bg-white rounded-sm p-6 shadow-sm">
              <h3 className="font-semibold text-[#1C1A18] mb-4">5. Size & Quantity</h3>
              <div className="mb-4">
                <Label className="text-xs text-[#7A7167] mb-2 block">Size</Label>
                <div className="flex flex-wrap gap-2">
                  {SHIRT_SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`w-12 h-10 text-sm rounded-sm border transition-colors ${size === s ? "bg-[#1C1A18] text-white border-[#1C1A18]" : "border-[#D4C8BC] text-[#7A7167] hover:border-[#1C1A18]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs text-[#7A7167] mb-2 block">Quantity</Label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 border border-[#D4C8BC] rounded-sm hover:bg-[#EDE8E0] text-[#1C1A18]">−</button>
                  <span className="w-10 text-center font-medium">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-9 h-9 border border-[#D4C8BC] rounded-sm hover:bg-[#EDE8E0] text-[#1C1A18]">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right — preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-sm shadow-sm p-8">
              <h3 className="font-semibold text-[#1C1A18] mb-6">Live Preview</h3>
              <div className="aspect-square bg-[#F7F3EE] rounded-sm flex flex-col items-center justify-center mb-6 relative overflow-hidden" style={{ backgroundColor: shirtColor.hex === "#FFFFFF" ? "#F7F3EE" : shirtColor.hex + "22" }}>
                {/* Shirt silhouette */}
                <div className="w-48 h-48 relative flex items-center justify-center">
                  <div className="w-full h-full rounded-sm flex items-center justify-center" style={{ backgroundColor: shirtColor.hex, border: shirtColor.border ? "1px solid #D4C8BC" : "none" }}>
                    {logoName && (
                      <div className="absolute top-6 w-12 h-12 bg-white/30 rounded border border-white/50 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-white/70" />
                      </div>
                    )}
                    {text && (
                      <p className="text-center px-4 text-sm font-medium" style={{ color: textColor, fontFamily: fontStyle === "Classic Serif" ? "serif" : fontStyle === "Script" ? "cursive" : "sans-serif" }}>
                        {text}
                      </p>
                    )}
                    {!text && !logoName && (
                      <p className="text-xs text-white/40 text-center px-4">Your design preview appears here</p>
                    )}
                  </div>
                </div>
                <p className="absolute bottom-3 text-xs text-[#7A7167]">{shirtType} · Size {size}</p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between text-[#7A7167]"><span>Base {shirtType}</span><span>RM {basePrice}</span></div>
                {text && <div className="flex justify-between text-[#7A7167]"><span>Custom Text</span><span>+RM {textPrice}</span></div>}
                {logoName && <div className="flex justify-between text-[#7A7167]"><span>Logo Upload</span><span>+RM {logoPrice}</span></div>}
                <div className="flex justify-between text-[#7A7167]"><span>Quantity</span><span>× {qty}</span></div>
                <div className="border-t border-[#D4C8BC] pt-2 flex justify-between font-semibold text-[#1C1A18]">
                  <span>Total</span>
                  <span>RM {(unitPrice * qty).toLocaleString()}</span>
                </div>
              </div>

              <Button onClick={handleAddToCart} className={`w-full h-11 rounded-sm flex items-center justify-center gap-2 transition-colors ${added ? "bg-green-600 hover:bg-green-700" : "bg-[#1C1A18] hover:bg-[#B07D45]"} text-white`}>
                {added ? <><Check className="w-4 h-4" /> Added to Cart!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
              </Button>

              {!isLoggedIn && (
                <p className="text-xs text-center text-[#7A7167] mt-3">🔒 Login required to add to cart</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}