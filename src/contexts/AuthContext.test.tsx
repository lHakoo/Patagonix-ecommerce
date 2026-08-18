import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

vi.mock('../services/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}));

const mockOnAuthStateChanged = vi.fn();
const mockSignOut = vi.fn();
const mockSignInWithEmailAndPassword = vi.fn();
const mockCreateUserWithEmailAndPassword = vi.fn();
const mockSignInWithPopup = vi.fn();

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignInWithEmailAndPassword(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUserWithEmailAndPassword(...args),
  signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
  GoogleAuthProvider: vi.fn(),
}));

const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lanza un error si se usa fuera de un AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth debe usarse dentro de un AuthProvider');
  });

   it('termina en loading false y currentUser null cuando no hay sesión', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return () => {};
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currentUser).toBeNull();
  });

  it('carga el usuario con su rol desde Firestore cuando hay sesión', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ uid: 'user-1', email: 'test@test.com', displayName: 'Test User' });
      return () => {};
    });

    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: 'admin' }),
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currentUser).toEqual({
      uid: 'user-1',
      email: 'test@test.com',
      displayName: 'Test User',
      role: 'admin',
    });
  });

  it('asigna rol customer por defecto a un usuario nuevo sin documento en Firestore', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ uid: 'user-2', email: 'nuevo@test.com', displayName: null });
      return () => {};
    });

    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });
    mockSetDoc.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currentUser?.role).toBe('customer');
    expect(mockSetDoc).toHaveBeenCalled();
  });
});