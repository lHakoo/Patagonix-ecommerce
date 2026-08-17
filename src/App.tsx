import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import { useCart } from "./contexts/CartContext";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import Orders from "./pages/Orders";
import AdminLayout from "./components/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";

function Home() {
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Patagonix Ecommerce</h1>
      {currentUser ? (
        <>
          <p>Hola, {currentUser.displayName || currentUser.email} ({currentUser.role})</p>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
            Cerrar sesión
          </button>
        </>
      ) : (
        <p>No hay sesión iniciada</p>
      )}
      <div className="flex gap-4">
        <Link to="/catalog" className="text-blue-600">Ver catálogo</Link>
        <Link to="/cart" className="text-blue-600">Ver carrito ({totalItems})</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;