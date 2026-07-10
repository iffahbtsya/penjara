import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "What is Three Good Sales?",
    a: "Three Good Sales is a social enterprise e-commerce platform that sells quality handcrafted wood, metal, and clothing products. All our products are made by inmates from correctional facilities as part of a rehabilitation and skill-building programme."
  },
  {
    q: "How do I place an order?",
    a: "Simply browse our catalogue, add items to your cart, and proceed to checkout. You'll need to create a free account or log in before completing your purchase. We accept credit/debit cards, online banking (FPX), and e-wallets."
  },
  {
    q: "Can I cancel or modify my order?",
    a: "Yes! You can cancel or edit your delivery address as long as your order has not been shipped yet. Once the status changes to 'Shipped', no further modifications are possible. You can manage your orders from the My Account page."
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5–10 business days within Malaysia. You'll receive a tracking number via WhatsApp once your order has been dispatched. Free shipping is available for orders above RM500."
  },
  {
    q: "How do I earn and use reward points?",
    a: "You earn 1 reward point for every RM1 spent on delivered orders. Points can be redeemed at checkout for discounts (1 point = RM0.01). Visit the Rewards page to check your balance, tier status, and available vouchers."
  },
  {
    q: "Can I customise my clothing order?",
    a: "Absolutely! Visit our Custom Clothing page to design your own T-Shirt, Polo Shirt, or Hoodie. You can upload logos, add custom text, choose fonts and colours, and preview your design before adding to cart."
  },
  {
    q: "How do I submit a product review?",
    a: "You can leave a review for any product you've purchased and received. Go to My Account → Order History → find your delivered order → click 'Write Review'. Reviews can be edited or deleted at any time."
  },
  {
    q: "Is my payment information secure?",
    a: "Yes, all transactions are protected with 256-bit SSL encryption. We do not store your card details on our servers. Payments are processed through verified Malaysian payment gateways."
  },
  {
    q: "Do you support a social cause?",
    a: "Yes! Every purchase you make directly supports prison rehabilitation programmes in Malaysia. The income generated goes towards providing inmates with vocational skills, fair wages, and a path to reintegration into society."
  },
  {
    q: "How do I contact customer support?",
    a: "You can reach us at hello@threegoodsales.com or call +60 3-1234 5678 during business hours (Mon–Fri, 9am–6pm). You can also WhatsApp us and we'll respond within 24 hours."
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}
            className={`border rounded-sm transition-all duration-200 ${isOpen ? "border-[#B07D45] shadow-sm" : "border-[#EDE8E0] hover:border-[#D4C8BC]"}`}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left">
              <span className={`text-sm font-medium pr-4 ${isOpen ? "text-[#B07D45]" : "text-[#1C1A18]"}`}>
                {faq.q}
              </span>
              {isOpen
                ? <ChevronUp className="w-4 h-4 text-[#B07D45] flex-shrink-0" />
                : <ChevronDown className="w-4 h-4 text-[#7A7167] flex-shrink-0" />
              }
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <p className="text-sm text-[#7A7167] leading-relaxed border-t border-[#EDE8E0] pt-4">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}