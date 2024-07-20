import {
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';

import { GetItemsFromLocalStorage, RemoveFromLocalStorage, AddToLocalStorage, } from '@video-cv/utils';
export interface ICartItem {
  name: string;
  id: string;
  imageSrc: string;
  price: number;
}

interface IState {
  cart: ICartItem[];
};

const CART_KEY = 'VIDEO-CV-CART';

const initialState: IState = {
  cart: GetItemsFromLocalStorage(CART_KEY) ?? [],
};

export const CartContext = createContext<{ cartState: IState; dispatch: React.Dispatch<any> } | undefined>(undefined);

const CartReducer = (
  state: IState,
  action: { type: string; payload: ICartItem }
): IState => {
  // TODO: find out why it is being added twice
  switch (action.type) {
    case 'ADD_TO_CART': {
      console.log('add to cart type', action);
      const newItem = action.payload;
      const updatedCart = [...state.cart, newItem];
      AddToLocalStorage(updatedCart, CART_KEY);
      return {
        ...state,
        cart: updatedCart,
      };
    }
    case 'REMOVE_FROM_CART': {
      const filteredList = state.cart.filter(
        (item) => item.id !== action.payload.id
      );
      // REFACTOR: think through and see if we can pass filteredList
      // instead of action.payload.id
      RemoveFromLocalStorage(action.payload.id, CART_KEY);
      return {
        ...state,
        cart: filteredList,
      };
    }
    case 'CLEAR_CART': {
      localStorage.removeItem(CART_KEY);
      return {
        ...state,
        cart: [],
      };
    }

    default:
      return state;
  }
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, dispatch] = useReducer(CartReducer, initialState);
  console.log('cartState', cartState);

  return (
    <CartContext.Provider value={{ cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;


