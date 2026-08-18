import type { ReactNode } from "react";
import { CartProvider } from "../contexts/CartContext";

export function CartTestWrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}