import {
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';

import {
  GetItemsFromLocalStorage,
  RemoveFromLocalStorage,
  AddToLocalStorage,
} from '@video-cv/utils';

export const CartContext = createContext<any>(null); // Specify the context type
const CART_KEY = 'VIDEO-CV-CART';

interface ICartItem {
  name: string;
  id: string;
  imageSrc: string;
  price: string;
}

interface IState {
  cart: ICartItem[];
}

const initialState: IState = {
  cart: GetItemsFromLocalStorage(CART_KEY) ?? [],
};

const CartReducer = (
  state: IState,
  action: { type: string; payload: ICartItem }
): IState => {
  // TODO: find out why it is being added twice
  switch (action.type) {
    case 'ADD_TO_CART': {
      console.log('add to cart type', action);
      AddToLocalStorage(action.payload, CART_KEY);
      return {
        ...state,
        cart: [...state.cart, action.payload],
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
        cart: [...filteredList],
      };
    }
    case 'CLEAR_CART': {
      localStorage.clear();
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

export default CartProvider;

export const useCart = () => {
  return useContext(CartContext);
};
