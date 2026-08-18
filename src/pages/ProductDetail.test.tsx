import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { CartProvider, useCart } from '../contexts/CartContext';
import type { Product } from '../types/product';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Zapatillas Running Pro',
  description: 'Zapatillas livianas para running',
  price: 45000,
  category: 'Calzado',
  imageUrl: 'https://placehold.co/400x400',
  stock: 15,
};

const mockGetProductById = vi.fn();
vi.mock('../services/products', () => ({
  getProductById: (...args: unknown[]) => mockGetProductById(...args),
}));

// Componente auxiliar que muestra el estado del carrito, para poder
// verificar desde afuera que "Agregar al carrito" funcionó de verdad.
function CartSpy() {
  const { items, totalItems } = useCart();
  return (
    <div data-testid="cart-spy">
      {totalItems} ítems - {items[0]?.product.name ?? 'vacío'}
    </div>
  );
}

function renderWithProviders() {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={['/product/prod-1']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <CartSpy />
      </MemoryRouter>
    </CartProvider>
  );
}

describe('Flujo de integración: agregar producto al carrito', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el producto y lo agrega al carrito al hacer clic', async () => {
    mockGetProductById.mockResolvedValue(mockProduct);
    const user = userEvent.setup();

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Zapatillas Running Pro')).toBeInTheDocument();
    });

    expect(screen.getByTestId('cart-spy')).toHaveTextContent('0 ítems - vacío');

    const addButton = screen.getByRole('button', { name: /agregar al carrito/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-spy')).toHaveTextContent('1 ítems - Zapatillas Running Pro');
    });

    expect(screen.getByText('¡Agregado! ✓')).toBeInTheDocument();
  });

  it('deshabilita el botón cuando no hay stock', async () => {
    mockGetProductById.mockResolvedValue({ ...mockProduct, stock: 0 });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Zapatillas Running Pro')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /agregar al carrito/i });
    expect(addButton).toBeDisabled();
  });

  it('muestra un mensaje de error si el producto no existe', async () => {
    mockGetProductById.mockResolvedValue(null);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Producto no encontrado.')).toBeInTheDocument();
    });
  });
});