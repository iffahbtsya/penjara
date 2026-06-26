import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Package, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface RegisterProps {
  onRegister: (user: { name: string; email: string; role: string }) => void;
}

export function Register({ onRegister }: RegisterProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (!form.phone.match(/^\+?[0-9\s\-]{8,}$/)) e.phone = "Enter a valid phone number";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      onRegister({ name: form.name, email: form.email, role: "customer" });
      navigate("/");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1C1A18] flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2 text-white">
          <Package className="w-6 h-6 text-[#B07D45]" />
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl">Three Good Sales</span>
        </Link>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl text-white mb-4 leading-snug">
            Join a community making a <span className="italic text-[#B07D45]">difference</span>
          </h2>
          <p className="text-[#A09488] leading-relaxed">
            Create your account to shop quality crafted products, earn rewards, and support meaningful rehabilitation programs.
          </p>
        </div>
        <p className="text-[#7A7167] text-sm">© 2024 Three Good Sales</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 max-w-lg mx-auto lg:mx-0 lg:px-16">
        <Link to="/" className="flex items-center gap-1 text-sm text-[#7A7167] hover:text-[#1C1A18] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="mb-8">
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl text-[#1C1A18] mb-2">Create your account</h1>
          <p className="text-[#7A7167] text-sm">Already have an account? <Link to="/login" className="text-[#B07D45] hover:underline">Sign in</Link></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-sm text-[#1C1A18] mb-1.5 block">Full Name</Label>
            <Input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              className="bg-white border-[#D4C8BC] focus:border-[#B07D45] rounded-sm h-11"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label className="text-sm text-[#1C1A18] mb-1.5 block">Email Address</Label>
            <Input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
              className="bg-white border-[#D4C8BC] focus:border-[#B07D45] rounded-sm h-11"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label className="text-sm text-[#1C1A18] mb-1.5 block">Phone Number</Label>
            <Input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+60 12-345 6789"
              className="bg-white border-[#D4C8BC] focus:border-[#B07D45] rounded-sm h-11"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label className="text-sm text-[#1C1A18] mb-1.5 block">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                className="bg-white border-[#D4C8BC] focus:border-[#B07D45] rounded-sm h-11 pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7167]">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <Label className="text-sm text-[#1C1A18] mb-1.5 block">Confirm Password</Label>
            <Input
              type="password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="Re-enter your password"
              className="bg-white border-[#D4C8BC] focus:border-[#B07D45] rounded-sm h-11"
            />
            {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
          </div>

          <p className="text-xs text-[#7A7167]">By creating an account you agree to our <a href="#" className="text-[#B07D45] hover:underline">Terms of Service</a> and <a href="#" className="text-[#B07D45] hover:underline">Privacy Policy</a>.</p>

          <Button type="submit" disabled={loading} className="w-full bg-[#1C1A18] hover:bg-[#B07D45] text-white h-11 rounded-sm transition-colors">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
