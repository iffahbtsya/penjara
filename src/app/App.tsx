import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ProductProvider } from "./context/ProductContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { StaffLayout } from "./components/staff/StaffLayout";
import { Welcome } from "./components/Welcome";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Catalogue } from "./components/Catalogue";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { Payment } from "./components/Payment";
import { Invoice } from "./components/Invoice";
import { MyAccount } from "./components/MyAccount";
import { Rewards } from "./components/Rewards";
import { CustomClothes } from "./components/CustomClothes";
import { OrderTracking } from "./components/OrderTracking";
import { WriteReview } from "./components/WriteReview";
import { StaffDashboard } from "./components/staff/StaffDashboard";
import { ProductManagement } from "./components/staff/ProductManagement";
import { StaffOrders } from "./components/staff/StaffOrders";
import { StaffReports } from "./components/staff/StaffReports";
import { StaffRewards } from "./components/staff/StaffRewards";
import { StaffAccount } from "./components/staff/StaffAccount";

function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const handleLogout = () => { logout(); toast.success("Signed out."); };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cartCount} isLoggedIn={!!user} isStaff={user?.role === "staff"} onLogout={handleLogout} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function CustomerRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

function StaffRoute({ children }: { children: React.ReactNode }) {
  const { isStaff } = useAuth();
  return isStaff ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user, login, logout } = useAuth();
  const { clearCart } = useCart();

  const handleLogin = (u: { name: string; email: string; role: "customer" | "staff" }) => {
    login(u); toast.success(`Welcome back, ${u.name}!`);
  };
  const handleRegister = (u: { name: string; email: string; role: string }) => {
    login({ ...u, role: "customer" }); toast.success(`Welcome, ${u.name}!`);
  };
  const handleLogout = () => { logout(); clearCart(); toast.success("Signed out."); };

  return (
    <Routes>
      <Route path="/" element={<CustomerLayout><Welcome /></CustomerLayout>} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/catalogue" element={<CustomerLayout><Catalogue /></CustomerLayout>} />
      <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
      <Route path="/custom-clothes" element={<CustomerLayout><CustomClothes /></CustomerLayout>} />
      <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="/payment" element={<CustomerRoute><CustomerLayout><Payment /></CustomerLayout></CustomerRoute>} />
      <Route path="/invoice/:orderId" element={<CustomerRoute><CustomerLayout><Invoice /></CustomerLayout></CustomerRoute>} />
      <Route path="/track/:orderId" element={<CustomerRoute><CustomerLayout><OrderTracking /></CustomerLayout></CustomerRoute>} />
      <Route path="/reviews/write" element={<CustomerRoute><CustomerLayout><WriteReview /></CustomerLayout></CustomerRoute>} />
      <Route path="/account" element={<CustomerRoute><CustomerLayout><MyAccount /></CustomerLayout></CustomerRoute>} />
      <Route path="/rewards" element={<CustomerRoute><CustomerLayout><Rewards /></CustomerLayout></CustomerRoute>} />
      <Route path="/staff/dashboard" element={<StaffRoute><StaffLayout staffName={user?.name || ""} onLogout={handleLogout}><StaffDashboard /></StaffLayout></StaffRoute>} />
      <Route path="/staff/products" element={<StaffRoute><StaffLayout staffName={user?.name || ""} onLogout={handleLogout}><ProductManagement /></StaffLayout></StaffRoute>} />
      <Route path="/staff/orders" element={<StaffRoute><StaffLayout staffName={user?.name || ""} onLogout={handleLogout}><StaffOrders /></StaffLayout></StaffRoute>} />
      <Route path="/staff/reports" element={<StaffRoute><StaffLayout staffName={user?.name || ""} onLogout={handleLogout}><StaffReports /></StaffLayout></StaffRoute>} />
      <Route path="/staff/rewards" element={<StaffRoute><StaffLayout staffName={user?.name || ""} onLogout={handleLogout}><StaffRewards /></StaffLayout></StaffRoute>} />
      <Route path="/staff/account" element={<StaffRoute><StaffLayout staffName={user?.name || ""} onLogout={handleLogout}><StaffAccount staffName={user?.name || ""} /></StaffLayout></StaffRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <ProductProvider>
              <Toaster position="top-right" richColors />
              <AppRoutes />
            </ProductProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}