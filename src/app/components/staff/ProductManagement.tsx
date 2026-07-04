import { useState, useRef } from "react";
import { Plus, Trash2, Edit2, Search, X, Upload, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useProducts } from "../../context/ProductContext";
import { toast } from "sonner";

const CAT_LABELS: Record<string, string> = { kayu: "Wood", besi: "Metal", baju: "Clothing" };
const CAT_COLORS: Record<string, string> = { kayu: "bg-amber-100 text-amber-800", besi: "bg-slate-100 text-slate-700", baju: "bg-rose-100 text-rose-700" };
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&auto=format";

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", cat: "kayu", price: "", stock: "", description: "", material: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setForm({ name: "", cat: "kayu", price: "", stock: "", description: "", material: "" });
    setImagePreview(""); setImageName(""); setEditId(null); setShowForm(true);
  };

  const openEdit = (p: typeof products[0]) => {
    setForm({ name: p.name, cat: p.cat, price: String(p.price), stock: String(p.stock), description: p.description || "", material: p.material || "" });
    setImagePreview(p.image); setImageName(""); setEditId(p.id); setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Please enter a product name."); return; }
    if (!form.price || Number(form.price) <= 0) { toast.error("Please enter a valid price."); return; }
    if (!form.stock || Number(form.stock) < 0) { toast.error("Please enter a valid stock quantity."); return; }

    const finalImage = imagePreview || DEFAULT_IMAGE;

    if (editId) {
      const existing = products.find(p => p.id === editId)!;
      updateProduct({ ...existing, name: form.name, cat: form.cat as any, price: Number(form.price), stock: Number(form.stock), image: finalImage, description: form.description, material: form.material });
      toast.success("Product updated!");
    } else {
      addProduct({ name: form.name, cat: form.cat as any, price: Number(form.price), stock: Number(form.stock), image: finalImage, description: form.description, material: form.material });
      toast.success("Product added to catalogue!");
    }
    setShowForm(false);
  };

  const confirmDelete = (id: number) => { deleteProduct(id); setDeleteId(null); toast.success("Product deleted."); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18]">Products</h1>
          <p className="text-sm text-[#7A7167] mt-1">{products.length} products in catalogue</p>
        </div>
        <Button onClick={openAdd} className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-sm shadow-sm p-4 mb-6 flex items-center gap-3">
        <Search className="w-4 h-4 text-[#7A7167]" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="border-0 bg-transparent focus:ring-0 text-sm p-0 h-auto" />
        {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-[#7A7167]" /></button>}
      </div>

      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F7F3EE]">
            <tr>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider text-[#7A7167] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-[#7A7167] text-sm">No products found.</td></tr>
            )}
            {filtered.map(p => (
              <tr key={p.id} className="border-t border-[#F0EDE8] hover:bg-[#F7F3EE] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-sm overflow-hidden bg-[#EDE8E0] flex-shrink-0">
                      <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-[#1C1A18]">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><Badge className={`${CAT_COLORS[p.cat]} border-0 text-xs`}>{CAT_LABELS[p.cat]}</Badge></td>
                <td className="px-5 py-3 font-medium text-[#1C1A18]">RM {p.price.toLocaleString()}</td>
                <td className="px-5 py-3 text-[#1C1A18]">{p.stock}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock <= 5 ? "bg-red-100 text-red-600" : p.stock <= 10 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                    {p.stock <= 5 ? "Critical" : p.stock <= 10 ? "Low" : "In Stock"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded text-[#7A7167] hover:bg-[#EDE8E0] hover:text-[#1C1A18] transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded text-[#7A7167] hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-sm w-full max-w-md shadow-xl my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0]">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg text-[#1C1A18]">{editId ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-[#7A7167]" /></button>
            </div>
            <div className="p-6 space-y-4">

              {/* Image upload — FUNCTIONAL */}
              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Product Image</Label>
                {imagePreview ? (
                  <div className="relative rounded-sm overflow-hidden border border-[#D4C8BC]">
                    <img src={imagePreview} alt="preview" className="w-full h-44 object-cover" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-[#1C1A18] text-xs px-2 py-1 rounded shadow border border-[#D4C8BC] hover:bg-[#F7F3EE]">
                        Change
                      </button>
                      <button type="button" onClick={() => { setImagePreview(""); setImageName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="bg-white text-red-500 text-xs px-2 py-1 rounded shadow border border-red-200 hover:bg-red-50">
                        Remove
                      </button>
                    </div>
                    {imageName && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Check className="w-3 h-3" /> {imageName}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#D4C8BC] rounded-sm p-8 text-center cursor-pointer hover:border-[#B07D45] hover:bg-[#FBF8F4] transition-colors">
                    <Upload className="w-8 h-8 text-[#D4C8BC] mx-auto mb-2" />
                    <p className="text-sm text-[#7A7167]">Click to upload product image</p>
                    <p className="text-xs text-[#A09488] mt-1">PNG, JPG, WEBP · Max 10MB</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={handleImageUpload}
                  onClick={e => { (e.target as HTMLInputElement).value = ""; }} />
              </div>

              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Product Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Teak Coffee Table" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Category *</Label>
                <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}
                  className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3 text-sm text-[#1C1A18]">
                  <option value="kayu">Wood (Kayu)</option>
                  <option value="besi">Metal (Besi)</option>
                  <option value="baju">Clothing (Baju)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1.5 block">Price (RM) *</Label>
                  <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="0" min="0" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1.5 block">Stock Qty *</Label>
                  <Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                    placeholder="0" min="0" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
              </div>

              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Material</Label>
                <Input value={form.material} onChange={e => setForm({ ...form, material: e.target.value })}
                  placeholder="e.g. Solid Teak Wood" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
              </div>

              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Description</Label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short product description..." rows={3}
                  className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm px-3 py-2 text-sm text-[#1C1A18] resize-none focus:outline-none focus:border-[#B07D45]" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 border-[#D4C8BC] rounded-sm text-sm">Cancel</Button>
                <Button onClick={handleSave} className="flex-1 bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm text-sm">
                  {editId ? "Save Changes" : "Add Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-sm shadow-xl p-6">
            <h3 className="font-semibold text-[#1C1A18] mb-2">Delete Product</h3>
            <p className="text-sm text-[#7A7167] mb-5">Are you sure? This cannot be undone and will remove the product from the catalogue.</p>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteId(null)} variant="outline" className="flex-1 border-[#D4C8BC] rounded-sm">Cancel</Button>
              <Button onClick={() => confirmDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-sm">Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}