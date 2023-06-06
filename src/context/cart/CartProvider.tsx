import { FC, PropsWithChildren, useContext, useEffect, useReducer } from 'react';
import { CartContext, cartReducer } from '.';
import { IAddress, ICartProduct } from 'interfaces';
import Cookies from 'js-cookie';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: IAddress;
}

export const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    const cookieProducts = Cookies.get('cart');
    const products = cookieProducts ? JSON.parse(cookieProducts) : [];
    dispatch({ type: 'LOAD_CART_FROM_COOKIES', payload: products });
  }, []);

  useEffect(() => {
    const cookieAddress = Cookies.get('address');
    const address = cookieAddress ? JSON.parse(cookieAddress) : undefined;
    dispatch({ type: 'LOAD_ADDRESS_FROM_COOKIES', payload: address });
  }, []);

  useEffect(() => {
    if (state.cart.length > 0) Cookies.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
    const subTotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0,
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSumary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (1 + taxRate),
    };
    dispatch({ type: 'UPDATE_ORDER_SUMARY', payload: orderSumary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some((p) => p._id === product._id && p.size === product.size);
    if (!productInCart)
      return dispatch({ type: 'UPDATE_PRODUCTS', payload: [...state.cart, product] });
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id || p.size !== product.size) return p;
      p.quantity += product.quantity;
      return p;
    });
    dispatch({ type: 'UPDATE_PRODUCTS', payload: updatedProducts });
  };

  const updateProductQuantity = (product: ICartProduct) => {
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id || p.size !== product.size) return p;
      p.quantity = product.quantity;
      return p;
    });
    dispatch({ type: 'CHANGE_PRODUCT_QUANTITY', payload: updatedProducts });
  };

  const removeCartProduct = (product: ICartProduct) => {
    const filteredProducts = state.cart.filter(
      (p) => !(p._id === product._id && p.size === product.size),
    );
    Cookies.set('cart', JSON.stringify(filteredProducts));
    dispatch({ type: 'REMOVE_PRODUCT', payload: filteredProducts });
  };

  const updateAddress = (address: IAddress) => {
    Cookies.set('address', JSON.stringify(address));
    dispatch({ type: 'UPDATE_ADDRESS', payload: address });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateProductQuantity,
        removeCartProduct,
        updateAddress,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within a CartProvider');
  return context;
}
