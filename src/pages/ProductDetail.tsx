import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/products";
import type { Product } from "../types/product";
import { useCart } from "../contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        setLoading(true);
        setProduct(null);
        setQuantity(1);
        const data = await getProductById(id);
        if (!data) {
          setError("Producto no encontrado.");
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError("No se pudo cargar el producto.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  function decreaseQuantity() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQuantity() {
    if (!product) return;
    setQuantity((q) => Math.min(product.stock, q + 1));
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-4 w-28 rounded-full shimmer mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl shimmer" />
          <div className="space-y-4 pt-2">
            <div className="h-3 w-24 rounded-full shimmer" />
            <div className="h-9 w-3/4 rounded-lg shimmer" />
            <div className="h-4 w-full rounded shimmer" />
            <div className="h-4 w-5/6 rounded shimmer" />
            <div className="h-8 w-1/3 rounded-lg shimmer mt-4" />
            <div className="h-12 w-48 rounded-full shimmer mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center animate-fade-in-up">
        <p className="font-display text-2xl text-pine-950 mb-3">
          {error || "Producto no encontrado."}
        </p>
        <p className="text-pine-950/60 mb-6">
          Puede que el producto ya no esté disponible.
        </p>
        <Link
          to="/catalog"
          className="inline-block bg-pine-800 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-pine-600 transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-pine-950/60 text-sm font-medium hover:text-pine-800 transition-colors animate-fade-in-up"
      >
        &larr; Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        <div
          className="group relative aspect-square overflow-hidden rounded-2xl bg-sand-50 border border-pine-800/10 shadow-sm animate-fade-in-up"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-pine-800">
            {product.category}
          </span>
          {product.stock === 0 && (
            <span className="absolute inset-0 bg-ink-900/50 flex items-center justify-center text-white font-display text-lg">
              Sin stock
            </span>
          )}
        </div>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-2">
            {product.category}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-pine-950 leading-tight">
            {product.name}
          </h1>
          <p className="text-pine-950/70 mt-4 leading-relaxed">
            {product.description}
          </p>

          <p className="font-display text-3xl font-semibold text-pine-950 mt-6">
            ${product.price.toLocaleString("es-AR")}
          </p>

          <p className="flex items-center gap-1.5 text-sm mt-2">
            <span
              className={`h-2 w-2 rounded-full ${
                product.stock > 0 ? "bg-pine-600" : "bg-red-500"
              }`}
            />
            <span className="text-pine-950/60">
              {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
            </span>
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mt-6">
              <span className="text-sm text-pine-950/60">Cantidad</span>
              <div className="flex items-center border border-pine-800/15 rounded-full overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center text-pine-950 hover:bg-sand-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  &minus;
                </button>
                <span className="w-8 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="w-9 h-9 flex items-center justify-center text-pine-950 hover:bg-sand-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            key={added ? "added" : "idle"}
            className={`mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-pop-in ${
              added
                ? "bg-pine-600 text-white"
                : "bg-pine-800 text-white hover:bg-pine-600"
            }`}
          >
            {added ? "¡Agregado! ✓" : "Agregar al carrito"}
          </button>
          <Link
            to="/cart"
            className="block mt-3 text-amber-500 text-sm font-medium hover:text-amber-400 transition-colors"
          >
            Ir al carrito &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}