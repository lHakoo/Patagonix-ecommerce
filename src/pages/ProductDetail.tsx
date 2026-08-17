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

  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        setLoading(true);
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
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-200 rounded" />
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 mb-4">{error || "Producto no encontrado."}</p>
        <Link to="/catalog" className="text-blue-600">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/catalog" className="text-blue-600 text-sm">&larr; Volver al catálogo</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-80 object-cover rounded-lg"
        />
        <div>
          <span className="text-xs text-gray-500 uppercase">{product.category}</span>
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <p className="text-gray-600 mt-3">{product.description}</p>
          <p className="text-2xl font-bold mt-4">
            ${product.price.toLocaleString("es-AR")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added ? "¡Agregado! ✓" : "Agregar al carrito"}
          </button>
          <Link to="/cart" className="block mt-3 text-blue-600 text-sm">
            Ir al carrito &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}