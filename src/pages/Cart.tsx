import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
        <Link to="/catalog" className="text-blue-600">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Carrito</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 border rounded-lg p-4"
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-gray-500">
                ${item.product.price.toLocaleString("es-AR")} c/u
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="border rounded w-8 h-8 flex items-center justify-center hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="border rounded w-8 h-8 flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <p className="font-semibold w-24 text-right">
              ${(item.product.price * item.quantity).toLocaleString("es-AR")}
            </p>

            <button
              onClick={() => removeItem(item.product.id)}
              className="text-red-500 text-sm hover:underline"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 border-t pt-4">
        <button onClick={clearCart} className="text-sm text-gray-500 hover:underline">
          Vaciar carrito
        </button>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">${totalPrice.toLocaleString("es-AR")}</p>
        </div>
      </div>

      <Link
        to="/checkout"
        className="mt-6 block text-center bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
      >
        Ir a checkout
      </Link>
    </div>
  );
}