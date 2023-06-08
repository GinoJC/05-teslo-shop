import { IShippingAddress, ICartProduct } from 'interfaces';
import { CartState } from './CartProvider';

type CartActionType =
  | {
      type:
        | 'LOAD_CART_FROM_COOKIES'
        | 'UPDATE_PRODUCTS'
        | 'CHANGE_PRODUCT_QUANTITY'
        | 'REMOVE_PRODUCT';
      payload: ICartProduct[];
    }
  | {
      type: 'UPDATE_ORDER_SUMARY';
      payload: { numberOfItems: number; subTotal: number; tax: number; total: number };
    }
  | { type: 'LOAD_ADDRESS_FROM_COOKIES'; payload: IShippingAddress }
  | { type: 'UPDATE_ADDRESS'; payload: IShippingAddress }
  | { type: 'ORDER_COMPLETE' };

export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case 'LOAD_CART_FROM_COOKIES':
      return { ...state, isLoaded: true, cart: action.payload };
    case 'LOAD_ADDRESS_FROM_COOKIES':
    case 'UPDATE_ADDRESS':
      return { ...state, shippingAddress: action.payload };
    case 'UPDATE_PRODUCTS':
      return { ...state, cart: action.payload };
    case 'CHANGE_PRODUCT_QUANTITY':
      return { ...state, cart: action.payload };
    case 'REMOVE_PRODUCT':
      return { ...state, cart: action.payload };
    case 'UPDATE_ORDER_SUMARY':
      return { ...state, ...action.payload };
    case 'ORDER_COMPLETE':
      return { ...state, cart: [], numberOfItems: 0, subTotal: 0, tax: 0, total: 0 };
    default:
      return state;
  }
};
