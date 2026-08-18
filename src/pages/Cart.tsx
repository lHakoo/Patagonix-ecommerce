import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-2xl text-pine-950 mb-2">Tu carrito está vacío</p>
        <p className="text-pine-950/60 mb-6">Todavía no agregaste nada para el camino.</p>
        <Link
          to="/catalog"
          className="inline-block px-6 py-3 rounded-full bg-pine-950 text-white font-medium hover:bg-pine-800 transition-colors"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-2">
        Tu equipo
      </p>
      <h1 className="font-display text-4xl font-semibold text-pine-950 mb-8">Carrito</h1>

      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div
            key={item.product.id}
            className="animate-fade-in-up flex items-center gap-4 bg-white border border-pine-800/10 rounded-2xl p-4"
            style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-pine-950 truncate">{item.product.name}</h3>
              <p className="text-sm text-pine-950/50">
                ${item.product.price.toLocaleString("es-AR")} c/u
              </p>
            </div>

            <div className="flex items-center gap-1 bg-sand-50 rounded-full p-1 border border-pine-800/10">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-pine-950 hover:bg-white transition-colors"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium text-pine-950">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-pine-950 hover:bg-white transition-colors"
              >
                +
              </button>
            </div>

            <p className="font-semibold text-pine-950 w-24 text-right hidden sm:block">
              ${(item.product.price * item.quantity).toLocaleString("es-AR")}
            </p>

            <button
              onClick={() => removeItem(item.product.id)}
              className="text-pine-950/40 hover:text-red-500 transition-colors text-sm"
              aria-label="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-pine-800/10 rounded-2xl p-6 flex items-center justify-between">
        <button onClick={clearCart} className="text-sm text-pine-950/50 hover:text-red-500 transition-colors">
          Vaciar carrito
        </button>
        <div className="text-right">
          <p className="text-sm text-pine-950/50">Total</p>
          <p className="font-display text-3xl font-semibold text-pine-950">
            ${totalPrice.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      <Link
        to="/checkout"
        className="mt-4 block text-center bg-pine-950 text-white py-4 rounded-full font-medium hover:bg-pine-800 transition-colors"
      >
        Ir a checkout
      </Link>
    </div>
  );
}