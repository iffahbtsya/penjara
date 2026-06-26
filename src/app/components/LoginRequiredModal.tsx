import { useNavigate } from "react-router";
import { Lock, X } from "lucide-react";
import { Button } from "./ui/button";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function LoginRequiredModal({ isOpen, onClose, message }: LoginRequiredModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-md mx-4 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A7167] hover:text-[#1C1A18] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#F7F3EE] rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#B07D45]" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-2xl text-[#1C1A18] mb-3"
          >
            Login Required
          </h2>
          <p className="text-[#7A7167] text-sm">
            {message || "Please log in or create an account to continue."}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => { navigate("/login"); onClose(); }}
            className="w-full bg-[#1C1A18] hover:bg-[#B07D45] text-white h-11 rounded-sm transition-colors"
          >
            Login
          </Button>
          <Button
            onClick={() => { navigate("/register"); onClose(); }}
            variant="outline"
            className="w-full border-[#1C1A18] text-[#1C1A18] hover:bg-[#F7F3EE] h-11 rounded-sm"
          >
            Create Account
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-[#7A7167] hover:text-[#1C1A18] h-11"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}