import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orders";
import type { Order } from "../types/order";

const statusLabels: Record<Order["status"], string> = {
  pending: "Pendiente",
  processing: "En proceso",
  completed: "Completada",
  cancelled: "Cancelada",
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getOrderById(id);
        if (!data) {
          setError("Orden no encontrada.");
        } else {
          setOrder(data);
        }
      } catch (err) {
        setError("No se pudo cargar la orden.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">Cargando...</div>;
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 mb-4">{error || "Orden no encontrada."}</p>
        <Link to="/orders" className="text-blue-600">Ver mis órdenes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">¡Gracias por tu compra! 🎉</h1>
      <p className="text-gray-500 mb-6">
        Orden #{order.id.slice(0, 8)} — {statusLabels[order.status]}
      </p>

      <div className="border rounded-lg p-4 mb-4">
        {order.items.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm py-1">
            <span>{item.product.name} x{item.quantity}</span>
            <span>${(item.product.price * item.quantity).toLocaleString("es-AR")}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold border-t mt-3 pt-3">
          <span>Total</span>
          <span>${order.total.toLocaleString("es-AR")}</span>
        </div>
      </div>

      <Link to="/catalog" className="text-blue-600">Seguir comprando</Link>
    </div>
  );
}