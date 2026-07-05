import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Package, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginProps {
  onLogin: (user: { name: string; email: string; role: "customer" | "staff" }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      if (form.email === "staff@tgs.com" && form.password === "staff123") {
        onLogin({ name: "Ahmad Razif", email: form.email, role: "staff" });
        navigate("/staff/dashboard");
      } else {
        onLogin({ name: "Jane Doe", email: form.email, role: "customer" });
        navigate("/");
      }
    }, 800);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1C1A18] flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2 text-white">
          <Package className="w-6 h-6 text-[#B07D45]" />
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl">SEREPOS</span>
        </Link>
        <div>
          <blockquote style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-white leading-snug italic mb-4">
            "Every product tells a story of <span className="text-[#B07D45]">resilience</span>."
          </blockquote>
          <p className="text-[#A09488]">SEREPOS – Seremban Prison Online Sales System</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-white">500+</div>
            <div className="text-xs text-[#7A7167]">Products</div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-semibold text-white">2,400+</div>
            <div className="text-xs text-[#7A7167]">Customers</div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-semibold text-white">4.8★</div>
            <div className="text-xs text-[#7A7167]">Rating</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 max-w-lg mx-auto lg:mx-0 lg:px-16">
        {!forgot ? (
          <>
            <Link to="/" className="flex items-center gap-1 text-sm text-[#7A7167] hover:text-[#1C1A18] mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="mb-8">
              <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18] mb-2">Welcome back</h1>
              <p className="text-[#7A7167] text-sm">New here? <Link to="/register" className="text-[#B07D45] hover:underline">Create an account</Link></p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-sm text-[#1C1A18] mb-1.5 block">Email Address</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="bg-white border-[#D4C8BC] focus:border-[#B07D45] rounded-sm h-11"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <Label className="text-sm text-[#1C1A18]">Password</Label>
                  <button type="button" onClick={() => setForgot(true)} className="text-xs text-[#B07D45] hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Your password"
                    className="bg-white border-[#D4C8BC] focus:border-[#B07D45] rounded-sm h-11 pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7167]">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-[#1C1A18] hover:bg-[#B07D45] text-white h-11 rounded-sm transition-colors">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-xs text-[#7A7167] mt-6 text-center">
              Staff login: staff@tgs.com / staff123
            </p>
          </>
        ) : (
          <div>
            <button onClick={() => { setForgot(false); setForgotSent(false); }} className="flex items-center gap-1 text-sm text-[#7A7167] hover:text-[#1C1A18] mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </button>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18] mb-2">Reset Password</h1>
            <p className="text-[#7A7167] text-sm mb-8">Enter your email and we'll send you a reset link.</p>
            {!forgotSent ? (
              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <Label className="text-sm text-[#1C1A18] mb-1.5 block">Email Address</Label>
                  <Input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-white border-[#D4C8BC] rounded-sm h-11"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#1C1A18] hover:bg-[#B07D45] text-white h-11 rounded-sm">Send Reset Link</Button>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-sm">
                <p className="font-medium mb-1">Reset link sent!</p>
                <p className="text-sm">Check your inbox at <strong>{forgotEmail}</strong> for the password reset link.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
