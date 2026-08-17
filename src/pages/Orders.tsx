import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "../services/orders";
import { useAuth } from "../contexts/AuthContext";
import type { Order } from "../types/order";

const statusLabels: Record<Order["status"], string> = {
  pending: "Pendiente",
  processing: "En proceso",
  completed: "Completada",
  cancelled: "Cancelada",
};

const statusColors: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!currentUser) return;
      try {
        setLoading(true);
        const data = await getUserOrders(currentUser.uid);
        setOrders(data);
      } catch (err) {
        setError("No se pudieron cargar tus órdenes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Necesitás iniciar sesión para ver tus órdenes.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">Cargando...</div>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Todavía no hiciste ninguna compra.</p>
        <Link to="/catalog" className="text-blue-600">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis órdenes</h1>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">Orden #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("es-AR")}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </span>
              <p className="font-bold mt-1">${order.total.toLocaleString("es-AR")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}