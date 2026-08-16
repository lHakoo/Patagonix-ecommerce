import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <span className="text-xs text-gray-500 uppercase">{product.category}</span>
        <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold">${product.price.toLocaleString("es-AR")}</span>
          <span className="text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
          </span>
        </div>
      </div>
    </div>
  );
}