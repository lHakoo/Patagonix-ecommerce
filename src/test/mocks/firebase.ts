import { vi } from 'vitest';

export const mockAuth = {
  currentUser: null,
};

export const mockOnAuthStateChanged = vi.fn((_auth, callback) => {
  callback(null);
  return () => {};
});

export const mockSignInWithEmailAndPassword = vi.fn();
export const mockCreateUserWithEmailAndPassword = vi.fn();
export const mockSignInWithPopup = vi.fn();
export const mockSignOut = vi.fn();

export const mockGetDoc = vi.fn();
export const mockSetDoc = vi.fn();
export const mockDoc = vi.fn();