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
    if (!currentUser || items.length === 0) return;

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
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-2xl text-pine-950 mb-2">No tenés productos para pagar</p>
        <Link to="/catalog" className="text-pine-800 font-medium hover:text-amber-500 transition-colors">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-white border border-pine-800/10 rounded-2xl p-8">
          <p className="font-display text-2xl text-pine-950 mb-2">Iniciá sesión para continuar</p>
          <p className="text-pine-950/60 mb-6 text-sm">
            Tu carrito te espera — solo necesitás una cuenta para completar la compra.
          </p>
          <Link
            to="/login"
            className="inline-block w-full px-6 py-3 rounded-full bg-pine-950 text-white font-medium hover:bg-pine-800 transition-colors"
          >
            Ingresar
          </Link>
          <p className="text-sm text-pine-950/50 mt-4">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="text-pine-800 font-medium hover:text-amber-500">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-2">
        Último paso
      </p>
      <h1 className="font-display text-4xl font-semibold text-pine-950 mb-8">Checkout</h1>

      <div className="bg-white border border-pine-800/10 rounded-2xl p-6 mb-4">
        <h2 className="font-semibold text-pine-950 mb-4">Resumen del pedido</h2>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm text-pine-950/80">
              <span>{item.product.name} <span className="text-pine-950/40">x{item.quantity}</span></span>
              <span className="font-medium">${(item.product.price * item.quantity).toLocaleString("es-AR")}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center border-t border-pine-800/10 mt-4 pt-4">
          <span className="font-display text-lg text-pine-950">Total</span>
          <span className="font-display text-2xl font-semibold text-pine-950">
            ${totalPrice.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-lg">💳</span>
        <p className="text-sm text-pine-950/80">
          Este es un checkout simulado — no se procesa ningún pago real.
        </p>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-pine-950 text-white py-4 rounded-full font-medium hover:bg-pine-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Procesando..." : "Confirmar compra"}
      </button>
    </div>
  );
}