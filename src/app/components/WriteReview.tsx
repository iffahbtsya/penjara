import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Star, Upload, X, Check, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

// Simulated past reviews
const PAST_REVIEWS_INIT = [
  { id: 1, product: "Teak Dining Table", orderId: "TGS-847291", rating: 5, title: "Absolutely stunning!", comment: "The quality is incredible. Worth every ringgit. The grain patterns are beautiful and it fits perfectly in my dining room.", date: "12 Jun 2024", image: null as string | null },
  { id: 2, product: "Classic Cotton Polo", orderId: "TGS-651082", rating: 4, title: "Great quality shirt", comment: "Fabric is comfortable and the fit is true to size. Colour is as shown. Would buy again.", date: "3 May 2024", image: null as string | null },
];

// Products eligible for review (delivered orders)
const ELIGIBLE_PRODUCTS = [
  { id: 1, name: "Teak Dining Table", orderId: "TGS-847291", image: "https://images.unsplash.com/photo-1530018352490-c6eef07fd7e0?w=100&h=80&fit=crop&auto=format" },
  { id: 11, name: "Classic Cotton Polo", orderId: "TGS-651082", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=100&h=80&fit=crop&auto=format" },
];

export function WriteReview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"write" | "history">("write");
  const [pastReviews, setPastReviews] = useState(PAST_REVIEWS_INIT);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState(ELIGIBLE_PRODUCTS[0]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [imageName, setImageName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setComment("");
    setImageName("");
    setEditingId(null);
  };

  const handleEdit = (review: typeof PAST_REVIEWS_INIT[0]) => {
    setTab("write");
    setEditingId(review.id);
    const product = ELIGIBLE_PRODUCTS.find(p => p.name === review.product);
    if (product) setSelectedProduct(product);
    setRating(review.rating);
    setTitle(review.title);
    setComment(review.comment);
  };

  const handleDelete = (id: number) => {
    setPastReviews(prev => prev.filter(r => r.id !== id));
    toast.success("Review deleted.");
  };

  const handleSubmit = () => {
    if (!rating) { toast.error("Please select a star rating."); return; }
    if (!title.trim()) { toast.error("Please enter a review title."); return; }
    if (comment.trim().length < 20) { toast.error("Review must be at least 20 characters."); return; }

    if (editingId) {
      setPastReviews(prev => prev.map(r => r.id === editingId
        ? { ...r, rating, title, comment, date: new Date().toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) }
        : r
      ));
      toast.success("Review updated successfully!");
    } else {
      setPastReviews(prev => [{
        id: Date.now(),
        product: selectedProduct.name,
        orderId: selectedProduct.orderId,
        rating, title, comment,
        date: new Date().toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }),
        image: imageName || null,
      }, ...prev]);
      toast.success("Review submitted! Thank you.");
      setSubmitted(true);
    }
    resetForm();
    setTimeout(() => { setTab("history"); setSubmitted(false); }, 1500);
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <div className="bg-[#1C1A18] py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/catalogue" className="flex items-center gap-1 text-[#A09488] text-sm hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <p className="text-[#B07D45] text-sm uppercase tracking-widest mb-2">Your Voice Matters</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-white">Product Reviews</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-sm p-1 shadow-sm mb-8 w-fit">
          {(["write", "history"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); resetForm(); }}
              className={`px-5 py-2 text-sm rounded-sm transition-colors capitalize ${tab === t ? "bg-[#1C1A18] text-white" : "text-[#7A7167] hover:bg-[#F7F3EE]"}`}>
              {t === "write" ? (editingId ? "Edit Review" : "Write Review") : `My Reviews (${pastReviews.length})`}
            </button>
          ))}
        </div>

        {tab === "write" && (
          <div className="bg-white rounded-sm shadow-sm p-8 space-y-6">
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-sm p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">Review submitted! Redirecting to your review history...</p>
              </div>
            )}

            {/* Product selector */}
            {!editingId && (
              <div>
                <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-3 block">Select Product to Review</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ELIGIBLE_PRODUCTS.map(p => (
                    <button key={p.id} onClick={() => setSelectedProduct(p)}
                      className={`flex items-center gap-3 p-3 border rounded-sm text-left transition-colors ${selectedProduct.id === p.id ? "border-[#B07D45] bg-[#B07D45]/5" : "border-[#D4C8BC] hover:border-[#1C1A18]"}`}>
                      <img src={p.image} alt={p.name} className="w-14 h-12 object-cover rounded-sm flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#1C1A18]">{p.name}</p>
                        <p className="text-xs text-[#7A7167]">Order {p.orderId}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {editingId && (
              <div className="bg-[#F7F3EE] rounded-sm p-3 text-sm text-[#7A7167]">
                Editing review for <span className="font-medium text-[#1C1A18]">{selectedProduct.name}</span>
              </div>
            )}

            {/* Star rating */}
            <div>
              <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-3 block">Your Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110">
                    <Star className={`w-9 h-9 ${star <= (hoverRating || rating) ? "fill-[#B07D45] text-[#B07D45]" : "text-[#D4C8BC]"}`} />
                  </button>
                ))}
                {(hoverRating || rating) > 0 && (
                  <span className="text-sm text-[#B07D45] ml-2 font-medium">{ratingLabels[hoverRating || rating]}</span>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-2 block">Review Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarise your experience..." className="bg-[#F7F3EE] border-[#D4C8BC] rounded-sm h-11 text-sm" />
            </div>

            {/* Comment */}
            <div>
              <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-2 block">Your Review</Label>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Share details about the product quality, delivery, and your overall experience (min. 20 characters)..."
                rows={5}
                className="w-full bg-[#F7F3EE] border border-[#D4C8BC] rounded-sm px-3 py-2.5 text-sm text-[#1C1A18] resize-none focus:outline-none focus:border-[#B07D45] placeholder:text-[#A09488]"
              />
              <p className="text-xs text-[#A09488] mt-1 text-right">{comment.length} characters</p>
            </div>

            {/* Image upload */}
            {!editingId && (
              <div>
                <Label className="text-xs text-[#7A7167] uppercase tracking-widest mb-2 block">Add Photo (Optional)</Label>
                <label className="flex items-center gap-3 border border-dashed border-[#D4C8BC] rounded-sm p-4 cursor-pointer hover:border-[#B07D45] transition-colors">
                  <Upload className="w-5 h-5 text-[#7A7167]" />
                  <span className="text-sm text-[#7A7167]">{imageName || "Upload photo of your product"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setImageName(e.target.files?.[0]?.name || "")} />
                </label>
                {imageName && (
                  <div className="flex items-center gap-2 mt-2">
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">{imageName}</span>
                    <button onClick={() => setImageName("")}><X className="w-3 h-3 text-[#7A7167]" /></button>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit} className="bg-[#1C1A18] hover:bg-[#B07D45] text-white rounded-sm h-11 px-8 transition-colors">
                {editingId ? "Update Review" : "Submit Review"}
              </Button>
              {editingId && (
                <Button onClick={() => { resetForm(); setTab("history"); }} variant="outline" className="border-[#D4C8BC] text-[#7A7167] rounded-sm h-11">
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-4">
            {pastReviews.length === 0 && (
              <div className="bg-white rounded-sm shadow-sm p-12 text-center">
                <Star className="w-12 h-12 text-[#D4C8BC] mx-auto mb-4" />
                <p className="text-[#7A7167]">You haven't written any reviews yet.</p>
                <button onClick={() => setTab("write")} className="text-[#B07D45] text-sm mt-2 hover:underline">Write your first review</button>
              </div>
            )}
            {pastReviews.map(review => (
              <div key={review.id} className="bg-white rounded-sm shadow-sm p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-[#1C1A18]">{review.product}</p>
                    <p className="text-xs text-[#7A7167]">Order {review.orderId} · {review.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(review)} className="p-2 text-[#7A7167] hover:text-[#B07D45] border border-[#EDE8E0] rounded-sm transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="p-2 text-[#7A7167] hover:text-red-500 border border-[#EDE8E0] rounded-sm transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-[#B07D45] text-[#B07D45]" : "text-[#D4C8BC]"}`} />
                  ))}
                </div>
                <p className="font-medium text-sm text-[#1C1A18] mb-1">{review.title}</p>
                <p className="text-sm text-[#7A7167] leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}