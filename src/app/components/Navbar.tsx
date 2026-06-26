import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingCart, User, Menu, X, Package, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  cartCount?: number;
  isLoggedIn?: boolean;
  isStaff?: boolean;
  onLogout?: () => void;
}

export function Navbar({ cartCount = 0, isLoggedIn = false, isStaff = false, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-[#1C1A18] text-[#F7F3EE] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#B07D45]" />
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold tracking-tight">
              Three Good Sales
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-[#B07D45] transition-colors">Home</Link>
            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1 hover:text-[#B07D45] transition-colors">
                Products <ChevronDown className="w-3 h-3" />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 bg-white text-[#1C1A18] shadow-lg rounded-md py-2 w-44 z-50">
                  <Link to="/catalogue" className="block px-4 py-2 hover:bg-[#F7F3EE] text-sm">All Products</Link>
                  <Link to="/catalogue?cat=kayu" className="block px-4 py-2 hover:bg-[#F7F3EE] text-sm">Wood (Kayu)</Link>
                  <Link to="/catalogue?cat=besi" className="block px-4 py-2 hover:bg-[#F7F3EE] text-sm">Metal (Besi)</Link>
                  <Link to="/catalogue?cat=baju" className="block px-4 py-2 hover:bg-[#F7F3EE] text-sm">Clothing (Baju)</Link>
                </div>
              )}
            </div>
            <Link to="/custom-clothes" className="hover:text-[#B07D45] transition-colors">Custom Clothes</Link>
            {isLoggedIn && <Link to="/rewards" className="hover:text-[#B07D45] transition-colors">Rewards</Link>}
            {isStaff && <Link to="/staff/dashboard" className="hover:text-[#B07D45] transition-colors text-[#B07D45]">Staff Dashboard</Link>}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="relative p-2 hover:text-[#B07D45] transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#B07D45] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
                  )}
                </Link>
                <Link to="/account" className="p-2 hover:text-[#B07D45] transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={onLogout} className="text-sm hover:text-[#B07D45] transition-colors">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-[#F7F3EE] hover:text-[#B07D45] hover:bg-transparent text-sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#B07D45] hover:bg-[#9A6C38] text-white text-sm px-4 py-2 rounded-md">Create Account</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 flex flex-col gap-3 text-sm">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-[#B07D45]">Home</Link>
            <Link to="/catalogue" onClick={() => setMenuOpen(false)} className="hover:text-[#B07D45]">All Products</Link>
            <Link to="/catalogue?cat=kayu" onClick={() => setMenuOpen(false)} className="hover:text-[#B07D45]">Wood Products</Link>
            <Link to="/catalogue?cat=besi" onClick={() => setMenuOpen(false)} className="hover:text-[#B07D45]">Metal Products</Link>
            <Link to="/catalogue?cat=baju" onClick={() => setMenuOpen(false)} className="hover:text-[#B07D45]">Clothing</Link>
            <Link to="/custom-clothes" onClick={() => setMenuOpen(false)} className="hover:text-[#B07D45]">Custom Clothes</Link>
            {isLoggedIn && <Link to="/rewards" onClick={() => setMenuOpen(false)} className="hover:text-[#B07D45]">Rewards</Link>}
            {isLoggedIn && <Link to="/cart" onClick={() => setMenuOpen(false)} className="hover:text-[#B07D45]">Cart ({cartCount})</Link>}
            {isLoggedIn && <Link to="/account" onClick={() => setMenuOpen(false)} className="hover:text-[#B07D45]">My Account</Link>}
            {!isLoggedIn && (
              <div className="flex gap-3 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="text-[#F7F3EE] hover:text-[#B07D45] hover:bg-transparent">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="bg-[#B07D45] text-white">Create Account</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
