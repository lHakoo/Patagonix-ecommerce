import { Link } from "react-router-dom";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-pine-800/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-square bg-sand-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-pine-800">
          {product.category}
        </span>
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-ink-900/50 flex items-center justify-center text-white text-sm font-semibold">
            Sin stock
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-pine-950 leading-snug">
          {product.name}
        </h3>
        <p className="text-pine-950/60 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold text-pine-950">
            ${product.price.toLocaleString("es-AR")}
          </span>
          <span className="text-xs text-pine-950/50">
            {product.stock > 0 ? `${product.stock} disp.` : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}