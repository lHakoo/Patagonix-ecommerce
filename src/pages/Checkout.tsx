import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { createOrder } from "../services/orders";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (!currentUser) {
      setError("Necesitás iniciar sesión para completar la compra.");
      return;
    }
    if (items.length === 0) return;

    setError("");
    setLoading(true);
    try {
      const orderId = await createOrder(currentUser.uid, items, totalPrice);
      clearCart();
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setError("No se pudo completar la compra. Intentá de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">No tenés productos para pagar.</p>
        <Link to="/catalog" className="text-blue-600">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="border rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-3">Resumen del pedido</h2>
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm py-1">
            <span>{item.product.name} x{item.quantity}</span>
            <span>${(item.product.price * item.quantity).toLocaleString("es-AR")}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold border-t mt-3 pt-3">
          <span>Total</span>
          <span>${totalPrice.toLocaleString("es-AR")}</span>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <p className="text-sm text-gray-600">
          💳 Este es un checkout simulado — no se procesa ningún pago real.
        </p>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Confirmar compra"}
      </button>
    </div>
  );
}