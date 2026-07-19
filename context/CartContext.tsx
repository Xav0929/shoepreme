"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  createCart,
  addCartLines,
  removeCartLines,
  updateCartLines,
  getCart,
  updateCartBuyerIdentity,
} from "@/lib/shopify";
import { useSession } from "next-auth/react";

interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      handle: string;
      images: { edges: { node: { url: string; altText: string | null } }[] };
    };
    selectedOptions: { name: string; value: string }[];
  };
}

interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: { amount: string; currencyCode: string };
    subtotalAmount: { amount: string; currencyCode: string };
  };
  lines: { edges: { node: CartLine }[] };
}

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    merchandiseId: string,
    quantity?: number,
    openCartAfter?: boolean,
  ) => Promise<Cart>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  checkout: () => void;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem("sp_cart_id");
    if (savedCartId) {
      getCart(savedCartId)
        .then((c) => {
          if (c) setCart(c);
        })
        .catch(() => localStorage.removeItem("sp_cart_id"));
    }
  }, []);

  // Sync buyer email + Shopify customer access token onto the cart once we know who's logged in
  useEffect(() => {
    const email = session?.user?.email;
    const customerAccessToken = (session as any)?.shopifyAccessToken;
    if (!email || !cart?.id) return;
    console.log(
      "[buyerIdentity] email:",
      email,
      "hasToken:",
      !!customerAccessToken,
      "tokenPreview:",
      customerAccessToken?.slice?.(0, 15),
    );
    updateCartBuyerIdentity(cart.id, email, customerAccessToken)
      .then((updated) => {
        console.log(
          "[buyerIdentity] updated cart checkoutUrl:",
          updated?.checkoutUrl,
        );
        if (updated) setCart(updated);
      })
      .catch((err) => {
        console.error("[buyerIdentity] failed:", err);
      });
    // only re-run when cart id, email, or token changes, not on every cart update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.id, session?.user?.email, (session as any)?.shopifyAccessToken]);

  const addToCart = useCallback(
    async (merchandiseId: string, quantity = 1, openCartAfter = true) => {
      setIsLoading(true);
      try {
        let updatedCart: Cart;

        if (cart?.id) {
          const existingLine = cart.lines.edges
            .map((e) => e.node)
            .find((line) => line.merchandise.id === merchandiseId);

          if (existingLine) {
            updatedCart = await updateCartLines(cart.id, [
              {
                id: existingLine.id,
                quantity: existingLine.quantity + quantity,
              },
            ]);
          } else {
            updatedCart = await addCartLines(cart.id, [
              { merchandiseId, quantity },
            ]);
          }
        } else {
          updatedCart = await createCart([{ merchandiseId, quantity }]);
          localStorage.setItem("sp_cart_id", updatedCart.id);
        }

        setCart(updatedCart);
        if (openCartAfter) setIsOpen(true);
        return updatedCart;
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!cart?.id) return;
      setIsLoading(true);
      try {
        const updatedCart = await removeCartLines(cart.id, [lineId]);
        setCart(updatedCart);
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) return;
      if (quantity < 1) return;
      setIsLoading(true);
      try {
        const updatedCart = await updateCartLines(cart.id, [
          { id: lineId, quantity },
        ]);
        setCart(updatedCart);
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const checkout = useCallback(async () => {
    if (!cart?.checkoutUrl) return;

    // Check if logged in before allowing checkout
    const res = await fetch("/api/auth/session");
    const session = await res.json();

    if (!session?.user) {
      // Save current page so we can return after login
      const returnPath = window.location.pathname;
      window.location.href = `/account/login?checkout=1&return_to=${encodeURIComponent(returnPath)}`;
      return;
    }

    const url = new URL(cart.checkoutUrl);
    url.searchParams.set(
      "return_to",
      process.env.NEXT_PUBLIC_APP_URL ?? "https://shoepreme-k.com",
    );
    window.location.href = url.toString();
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        checkout,

        totalQuantity: cart?.totalQuantity ?? 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
