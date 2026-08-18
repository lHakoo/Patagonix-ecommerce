import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from './CartContext';
import { CartTestWrapper } from '../test/test-utils';
import type { Product } from '../types/product';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Zapatillas Running Pro',
  description: 'Zapatillas livianas',
  price: 45000,
  category: 'Calzado',
  imageUrl: 'https://placehold.co/400x400',
  stock: 15,
};

describe('useCart', () => {
  it('empieza con el carrito vacío', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartTestWrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('addItem agrega un producto y actualiza los totales', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartTestWrapper });

    act(() => {
      result.current.addItem(mockProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(90000);
  });

  it('removeItem saca el producto y resetea los totales', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartTestWrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
    });
    act(() => {
      result.current.removeItem('prod-1');
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('updateQuantity recalcula el precio total correctamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartTestWrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
    });
    act(() => {
      result.current.updateQuantity('prod-1', 3);
    });

    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(135000);
  });

  it('clearCart vacía todo el carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartTestWrapper });

    act(() => {
      result.current.addItem(mockProduct, 5);
    });
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('lanza un error si se usa useCart fuera de un CartProvider', () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart debe usarse dentro de un CartProvider');
  });
});