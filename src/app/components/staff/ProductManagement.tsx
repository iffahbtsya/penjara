import { useState, useRef } from "react";
import { Plus, Trash2, Edit2, Search, X, Upload, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const INITIAL_PRODUCTS = [
  { id: 1, name: "Teak Dining Table", cat: "kayu", price: 1200, stock: 8, image: "https://theteakline.com/wp-content/uploads/2026/02/opera-dining-table-2-the-teak-line.png" },
  { id: 2, name: "Mahogany Bookshelf", cat: "kayu", price: 890, stock: 5, image: "https://www.bigw.com.au/medias/sys_master/images/images/h79/h4a/97284761780254.jpg" },
  { id: 3, name: "Oak Side Table", cat: "kayu", price: 340, stock: 12, image: "https://images.thdstatic.com/productImages/f0cc09df-0472-41d9-9071-f994698460e7/svn/oak-lirago-end-side-tables-hd-tjs400-64_600.jpg" },
  { id: 4, name: "Wooden Jewellery Box", cat: "kayu", price: 95, stock: 20, image: "https://down-my.img.susercontent.com/file/6477a7db7e49696e609dc10d4426c8b4" },
  { id: 5, name: "Rattan Wall Decor", cat: "kayu", price: 180, stock: 15, image: "https://down-my.img.susercontent.com/file/cn-11134207-7ras8-m55f7yehpzc1a4" },
  { id: 6, name: "Steel Clothes Drying Rack", cat: "besi", price: 185, stock: 30, image: "https://images.thdstatic.com/productImages/61fb8e26-c53d-423e-890c-3eca8e1ddb9b/svn/white-37-boyel-living-clothes-drying-racks-bljz10467-64_1000.jpg" },
  { id: 7, name: "Industrial Shelf Unit", cat: "besi", price: 420, stock: 10, image: "https://m.media-amazon.com/images/I/81uSA7EeBEL._AC_UF894,1000_QL80_.jpg" },
  { id: 8, name: "Metal Locker Cabinet", cat: "besi", price: 650, stock: 7, image: "https://i5.walmartimages.com/asr/fcf64f30-28c1-4a11-bbec-0e97e018aaa6.144964fe56069ff12aebb3436a1e2187.jpeg" },
  { id: 9, name: "Iron Coat Rack", cat: "besi", price: 120, stock: 22, image: "https://images.thdstatic.com/productImages/f8867afdb47b41f58578f80bf56f71db/svn/black-umbrella-stands-ph00559b498-64_1000.jpg" },
  { id: 10, name: "Steel Workbench", cat: "besi", price: 780, stock: 6, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShohWysB3tj7VrqYTo-u7-CnA1XlJJod_pmrhDkQPlFZXFQDbHC32qK8sF&s=10" },
  { id: 11, name: "Classic Cotton Polo", cat: "baju", price: 65, stock: 50, image: "https://m.media-amazon.com/images/I/81Qk6j07qEL._AC_UY1000_.jpg" },
  { id: 12, name: "Heavy Duty Work Shirt", cat: "baju", price: 89, stock: 40, image: "https://heavydutywear.ca/cdn/shop/files/4074NB_1.jpg?v=1738621840&width=900" },
  { id: 13, name: "Linen Casual Shirt", cat: "baju", price: 78, stock: 35, image: "https://image.made-in-china.com/2f0j00MSOkwcbGiqcn/Men-s-High-Quality-Linen-Long-Sleeve-Linen-Summer-Loose-Casual-Cotton-Shirt-for-Man.jpg" },
  { id: 14, name: "Custom Print T-Shirt", cat: "baju", price: 55, stock: 60, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=300&fit=crop&auto=format" },
  { id: 15, name: "Formal Batik Shirt", cat: "baju", price: 110, stock: 25, image: "https://poya.com.my/cdn/shop/articles/Screenshot_2024-01-15_at_10.44.26_AM.png?v=1705286673" },
];

const CAT_LABELS: Record<string, string> = { kayu: "Wood", besi: "Metal", baju: "Clothing" };
const CAT_COLORS: Record<string, string> = { kayu: "bg-amber-100 text-amber-800", besi: "bg-slate-100 text-slate-700", baju: "bg-rose-100 text-rose-700" };

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&auto=format";

interface Product { id: number; name: string; cat: string; price: number; stock: number; image: string; }

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", cat: "kayu", price: "", stock: "" });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageName, setImageName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setForm({ name: "", cat: "kayu", price: "", stock: "" });
    setImagePreview("");
    setImageName("");
    setEditProduct(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({ name: p.name, cat: p.cat, price: String(p.price), stock: String(p.stock) });
    setImagePreview(p.image);
    setImageName("");
    setEditProduct(p);
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) return;
    const finalImage = imagePreview || DEFAULT_IMAGE;
    if (editProduct) {
      setProducts(ps => ps.map(p => p.id === editProduct.id
        ? { ...p, name: form.name, cat: form.cat, price: Number(form.price), stock: Number(form.stock), image: finalImage }
        : p
      ));
    } else {
      setProducts(ps => [...ps, {
        id: Date.now(),
        name: form.name,
        cat: form.cat,
        price: Number(form.price),
        stock: Number(form.stock),
        image: finalImage,
      }]);
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
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="border-0 bg-transparent focus:ring-0 text-sm p-0 h-auto" />
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
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg text-[#1C1A18]">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-[#7A7167]" /></button>
            </div>
            <div className="p-6 space-y-4">

              {/* Image upload — now functional */}
              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Product Image</Label>
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-sm border border-[#D4C8BC]" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-[#1C1A18] text-xs px-2 py-1 rounded shadow border border-[#D4C8BC] hover:bg-[#F7F3EE]">
                        Change
                      </button>
                      <button onClick={() => { setImagePreview(""); setImageName(""); }}
                        className="bg-white text-red-500 text-xs px-2 py-1 rounded shadow border border-red-200 hover:bg-red-50">
                        Remove
                      </button>
                    </div>
                    {imageName && (
                      <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> {imageName}
                      </p>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D4C8BC] rounded-sm p-8 cursor-pointer hover:border-[#B07D45] transition-colors">
                    <Upload className="w-7 h-7 text-[#D4C8BC] mb-2" />
                    <p className="text-sm text-[#7A7167]">Click to upload product image</p>
                    <p className="text-xs text-[#A09488] mt-1">PNG, JPG, WEBP accepted</p>
                  </label>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>

              <div>
                <Label className="text-xs text-[#7A7167] mb-1.5 block">Product Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Teak Coffee Table"
                  className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
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
                  <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="0" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-[#7A7167] mb-1.5 block">Stock Quantity</Label>
                  <Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                    placeholder="0" className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-10 text-sm" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 border-[#D4C8BC] rounded-sm text-sm">Cancel</Button>
                <Button onClick={handleSave} disabled={!form.name || !form.price || !form.stock}
                  className="flex-1 bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm text-sm disabled:opacity-50">
                  {editProduct ? "Save Changes" : "Add Product"}
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
            <p className="text-sm text-[#7A7167] mb-5">Are you sure? This action cannot be undone.</p>
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