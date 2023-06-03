import { ICartProduct } from 'interfaces';
import { CartState } from './CartProvider';

type CartActionType =
  | {
      type: 'LOAD_FROM_COOKIES' | 'UPDATE_PRODUCTS' | 'CHANGE_PRODUCT_QUANTITY' | 'REMOVE_PRODUCT';
      payload: ICartProduct[];
    }
  | {
      type: 'UPDATE_ORDER_SUMARY';
      payload: { numberOfItems: number; subTotal: number; tax: number; total: number };
    };

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case 'LOAD_FROM_COOKIES':
      return { ...state, cart: action.payload };
    case 'UPDATE_PRODUCTS':
      return { ...state, cart: action.payload };
    case 'CHANGE_PRODUCT_QUANTITY':
      return { ...state, cart: action.payload };
    case 'REMOVE_PRODUCT':
      return { ...state, cart: action.payload };
    case 'UPDATE_ORDER_SUMARY':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
