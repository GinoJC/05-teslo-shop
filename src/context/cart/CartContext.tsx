import { createContext } from 'react';
import { IAddress, ICartProduct } from 'interfaces';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: IAddress;
  addProductToCart: (product: ICartProduct) => void;
  updateProductQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: IAddress) => void;
}

export const CartContext = createContext({} as ContextProps);
