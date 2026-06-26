import { Link } from "react-router";
import { Package, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1C1A18] text-[#F7F3EE] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#B07D45]" />
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold">Three Good Sales</span>
            </div>
            <p className="text-sm text-[#A09488] leading-relaxed">
              Quality products crafted with purpose. Supporting rehabilitation through meaningful industry.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#B07D45] mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-[#A09488]">
              <li><Link to="/catalogue?cat=kayu" className="hover:text-[#F7F3EE] transition-colors">Wood Products</Link></li>
              <li><Link to="/catalogue?cat=besi" className="hover:text-[#F7F3EE] transition-colors">Metal Products</Link></li>
              <li><Link to="/catalogue?cat=baju" className="hover:text-[#F7F3EE] transition-colors">Clothing</Link></li>
              <li><Link to="/custom-clothes" className="hover:text-[#F7F3EE] transition-colors">Custom Clothes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#B07D45] mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-[#A09488]">
              <li><Link to="/" className="hover:text-[#F7F3EE] transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-[#F7F3EE] transition-colors">Our Mission</Link></li>
              <li><Link to="/rewards" className="hover:text-[#F7F3EE] transition-colors">Loyalty Rewards</Link></li>
              <li><Link to="/" className="hover:text-[#F7F3EE] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-[#B07D45] mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-[#A09488]">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@threegoodsales.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +60 3-1234 5678</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> Kuala Lumpur, Malaysia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-[#7A7167]">© 2024 Three Good Sales. All rights reserved.</p>
          <p className="text-xs text-[#7A7167]">Crafted with purpose. Built for impact.</p>
        </div>
      </div>
    </footer>
  );
}
