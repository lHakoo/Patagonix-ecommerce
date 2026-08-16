import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import Catalog from "./pages/Catalog";

function Home() {
  const { currentUser, logout } = useAuth();
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;