import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/products", label: "Productos" },
    { to: "/admin/orders", label: "Órdenes" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-bold text-lg">Panel Admin</h2>
          <p className="text-xs text-gray-400 mt-1">{currentUser?.email}</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded text-sm ${
                location.pathname === link.to
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <Link to="/" className="block text-sm text-gray-400 hover:text-white mb-2">
            &larr; Volver al sitio
          </Link>
          <button
            onClick={logout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}