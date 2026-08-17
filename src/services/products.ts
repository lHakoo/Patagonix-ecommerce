import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../types/product";

const PRODUCTS_COLLECTION = "products";

export async function getAllProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Product, "id">),
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...(docSnap.data() as Omit<Product, "id">) };
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

export async function createProduct(data: Omit<Product, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), data);
  return docRef.id;
}

export async function updateProduct(id: string, data: Omit<Product, "id">): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), data);
}