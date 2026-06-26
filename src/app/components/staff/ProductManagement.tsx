import { useState } from "react";
import { Plus, Trash2, Edit2, Search, X, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const INITIAL_PRODUCTS = [
  { id: 1, name: "Teak Dining Table", cat: "kayu", price: 1200, stock: 8, image: "https://images.unsplash.com/photo-1530018352490-c6eef07fd7e0?w=100&h=80&fit=crop&auto=format" },
  { id: 2, name: "Mahogany Bookshelf", cat: "kayu", price: 890, stock: 5, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=100&h=80&fit=crop&auto=format" },
  { id: 6, name: "Steel Drying Rack", cat: "besi", price: 185, stock: 30, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=80&fit=crop&auto=format" },
  { id: 7, name: "Industrial Shelf Unit", cat: "besi", price: 420, stock: 10, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=80&fit=crop&auto=format" },
  { id: 11, name: "Classic Cotton Polo", cat: "baju", price: 65, stock: 50, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=100&h=80&fit=crop&auto=format" },
  { id: 12, name: "Heavy Duty Work Shirt", cat: "baju", price: 89, stock: 40, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=100&h=80&fit=crop&auto=format" },
];

const CAT_LABELS: Record<string, string> = { kayu: "Wood", besi: "Metal", baju: "Clothing" };
const CAT_COLORS: Record<string, string> = { kayu: "bg-amber-100 text-amber-800", besi: "bg-slate-100 text-slate-700", baju: "bg-rose-100 text-rose-700" };

interface Product { id: number; name: string; cat: string; price: number; stock: number; image: string; }

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", cat: "kayu", price: "", stock: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ name: "", cat: "kayu", price: "", stock: "" }); setEditProduct(null); setShowForm(true); };
  const openEdit = (p: Product) => { setForm({ name: p.name, cat: p.cat, price: String(p.price), stock: String(p.stock) }); setEditProduct(p); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) return;
    if (editProduct) {
      setProducts(ps => ps.map(p => p.id === editProduct.id ? { ...p, name: form.name, cat: form.cat, price: Number(form.price), stock: Number(form.stock) } : p));
    } else {
      setProducts(ps => [...ps, { id: Date.now(), name: form.name, cat: form.cat, price: Number(form.price), stock: Number(form.stock), image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=80&fit=crop&auto=format" }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => { setProducts(ps => ps.filter(p => p.id !== id)); setDeleteId(null); };

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

      {/* Search */}
      <div className="bg-white rounded-sm shadow-sm p-4 mb-6 flex items-center gap-3">
        <Search className="w-4 h-4 text-[#7A7167]" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="border-0 bg-transparent focus:ring-0 text-sm p-0 h-auto" />
      </div>

      {/* Table */}
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
                <td className="px-5 py-3">
                  <Badge className={`${CAT_COLORS[p.cat]} border-0 text-xs`}>{CAT_LABELS[p.cat]}</Badge>
                </td>
                <td className="px-5 py-3 font-medium text-[#1C1A18]">RM {p.price.toLocaleString()}</td>
                <td className="px-5 py-3 text-[#1C1A18]">{p.stock}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock <= 5 ? "bg-red-100 text-red-600" : p.stock <= 10 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                    {p.stock <= 5 ? "Critical" : p.stock <= 10 ? "Low" : "In Stock"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded text-[#7A7167] hover:bg-[#EDE8E0] hover:text-[#1C1A18] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded text-[#7A7167] hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E0]">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg text-[#1C1A18]">{editProduct ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-[#7A7167]" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image upload placeholder */}
              <div className="border-2 border-dashed border-[#D4C8BC] rounded-sm p-6 text-center">
                <Upload className="w-6 h-6 text-[#D4C8BC] mx-auto mb-1" />
                <p className="text-xs text-[#7A7167]">Click to upload product image</p>
              </div>
              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Product Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Teak Coffee Table" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Category</Label>
                <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}
                  className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm h-10 px-3 text-sm text-[#1C1A18]">
                  <option value="kayu">Wood (Kayu)</option>
                  <option value="besi">Metal (Besi)</option>
                  <option value="baju">Clothing (Baju)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1.5 block">Price (RM)</Label>
                  <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1.5 block">Stock Quantity</Label>
                  <Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 border-[#D4C8BC] rounded-sm text-sm">Cancel</Button>
                <Button onClick={handleSave} className="flex-1 bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm text-sm">{editProduct ? "Save Changes" : "Add Product"}</Button>
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
            <p className="text-sm text-[#7A7167] mb-5">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteId(null)} variant="outline" className="flex-1 border-[#D4C8BC] rounded-sm">Cancel</Button>
              <Button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-sm">Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
