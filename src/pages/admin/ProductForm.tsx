import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, updateProduct, getProductById } from "../../services/products";

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("");

  const [loadingData, setLoadingData] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode || !id) return;

    async function loadProduct() {
      try {
        const product = await getProductById(id!);
        if (!product) {
          setError("Producto no encontrado.");
          return;
        }
        setName(product.name);
        setDescription(product.description);
        setPrice(String(product.price));
        setCategory(product.category);
        setImageUrl(product.imageUrl);
        setStock(String(product.stock));
      } catch (err) {
        setError("No se pudo cargar el producto.");
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    }
    loadProduct();
  }, [id, isEditMode]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const priceNum = Number(price);
    const stockNum = Number(stock);

    if (!name || !description || !category || !imageUrl) {
      setError("Completá todos los campos.");
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      setError("El precio tiene que ser un número válido.");
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError("El stock tiene que ser un número válido.");
      return;
    }

    const productData = {
      name,
      description,
      price: priceNum,
      category,
      imageUrl,
      stock: stockNum,
    };

    setSaving(true);
    try {
      if (isEditMode && id) {
        await updateProduct(id, productData);
      } else {
        await createProduct(productData);
      }
      navigate("/admin/products");
    } catch (err) {
      setError("No se pudo guardar el producto.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loadingData) {
    return <p className="text-gray-500">Cargando...</p>;
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Editar producto" : "Nuevo producto"}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL de imagen</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="https://..."
            required
          />
        </div>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Vista previa"
            className="w-32 h-32 object-cover rounded border"
          />
        )}

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Guardando..." : isEditMode ? "Guardar cambios" : "Crear producto"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 rounded border hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}