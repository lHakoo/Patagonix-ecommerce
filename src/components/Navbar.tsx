import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-sand-50/90 backdrop-blur border-b border-pine-800/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/catalog" className="font-display text-xl font-semibold text-pine-950 tracking-tight">
          Patagonix
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <Link
            to="/catalog"
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive("/catalog") ? "bg-pine-800 text-white" : "text-pine-950 hover:bg-pine-800/10"
            }`}
          >
            Catálogo
          </Link>
          {currentUser && (
            <Link
              to="/orders"
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive("/orders") ? "bg-pine-800 text-white" : "text-pine-950 hover:bg-pine-800/10"
              }`}
            >
              Mis órdenes
            </Link>
          )}
          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              className="px-3 py-2 rounded-full text-sm font-medium text-pine-950 hover:bg-pine-800/10 transition-colors"
            >
              Panel admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-pine-800 text-white hover:bg-pine-600 transition-colors"
            aria-label="Ver carrito"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-amber-500 text-pine-950 text-xs font-bold flex items-center justify-center animate-pop-in">
                {totalItems}
              </span>
            )}
          </Link>

          {currentUser ? (
            <button
              onClick={logout}
              className="text-sm font-medium text-pine-950 hover:text-amber-500 transition-colors"
            >
              Salir
            </button>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded-full bg-pine-950 text-white hover:bg-pine-800 transition-colors"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}