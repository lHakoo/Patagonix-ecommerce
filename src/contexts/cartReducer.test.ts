import { describe, it, expect } from 'vitest';
import { cartReducer, initialCartState } from './cartReducer';
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

const mockProduct2: Product = {
  id: 'prod-2',
  name: 'Mochila Trekking',
  description: 'Mochila resistente',
  price: 38000,
  category: 'Accesorios',
  imageUrl: 'https://placehold.co/400x400',
  stock: 8,
};

describe('cartReducer', () => {
  it('empieza con un carrito vacío', () => {
    expect(initialCartState.items).toEqual([]);
  });

  it('ADD_ITEM agrega un producto nuevo al carrito', () => {
    const state = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct },
    });

    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe('prod-1');
    expect(state.items[0].quantity).toBe(1);
  });

  it('ADD_ITEM suma la cantidad si el producto ya está en el carrito', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, quantity: 2 },
    });

    const finalState = cartReducer(stateWithItem, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct, quantity: 3 },
    });

    expect(finalState.items).toHaveLength(1);
    expect(finalState.items[0].quantity).toBe(5);
  });

  it('ADD_ITEM con productos distintos crea ítems separados', () => {
    const stateWithFirst = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct },
    });

    const finalState = cartReducer(stateWithFirst, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct2 },
    });

    expect(finalState.items).toHaveLength(2);
  });

  it('REMOVE_ITEM elimina el producto correcto del carrito', () => {
    const stateWithTwo = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct },
    });
    const stateWithBoth = cartReducer(stateWithTwo, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct2 },
    });

    const finalState = cartReducer(stateWithBoth, {
      type: 'REMOVE_ITEM',
      payload: { productId: 'prod-1' },
    });

    expect(finalState.items).toHaveLength(1);
    expect(finalState.items[0].product.id).toBe('prod-2');
  });

  it('UPDATE_QUANTITY actualiza la cantidad de un ítem existente', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct },
    });

    const finalState = cartReducer(stateWithItem, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: 'prod-1', quantity: 10 },
    });

    expect(finalState.items[0].quantity).toBe(10);
  });

  it('UPDATE_QUANTITY con cantidad 0 elimina el ítem (caso límite)', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct },
    });

    const finalState = cartReducer(stateWithItem, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: 'prod-1', quantity: 0 },
    });

    expect(finalState.items).toHaveLength(0);
  });

  it('UPDATE_QUANTITY con cantidad negativa también elimina el ítem (caso límite)', () => {
    const stateWithItem = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct },
    });

    const finalState = cartReducer(stateWithItem, {
      type: 'UPDATE_QUANTITY',
      payload: { productId: 'prod-1', quantity: -5 },
    });

    expect(finalState.items).toHaveLength(0);
  });

  it('CLEAR_CART vacía completamente el carrito', () => {
    const stateWithItems = cartReducer(initialCartState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct },
    });

    const finalState = cartReducer(stateWithItems, { type: 'CLEAR_CART' });

    expect(finalState.items).toEqual([]);
  });

  it('no muta el estado original (inmutabilidad)', () => {
    const originalState = initialCartState;
    cartReducer(originalState, {
      type: 'ADD_ITEM',
      payload: { product: mockProduct },
    });

    expect(originalState.items).toEqual([]);
  });
});