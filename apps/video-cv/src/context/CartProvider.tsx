// import { useContext, createContext, ReactNode, useEffect, useReducer, } from 'react';

// import { GetItemsFromSessionStorage, RemoveFromSessionStorage, AddToSessionStorage, } from '@video-cv/utils';
// export interface ICartItem {
//   name: string;
//   id: string;
//   imageSrc: string;
//   price: number;
//   uploader: string;
// }

// interface IState {
//   cart: ICartItem[];
// };

// const CART_KEY = 'VIDEO-CV-CART';

// const initialState: IState = {
//   cart: GetItemsFromSessionStorage(CART_KEY) ?? [],
// };

// export const CartContext = createContext<{ cartState: IState; dispatch: React.Dispatch<any> } | undefined>(undefined);

// const CartReducer = ( state: IState, action: { type: string; payload: ICartItem }): IState => {
//   // TODO: find out why it is being added twice
//   switch (action.type) {
//     case 'ADD_TO_CART': {
//       const newItem = action.payload;
//       // const updatedCart = [...state.cart, newItem];
//       const existingItemIndex = state.cart.findIndex((item) => item.id === newItem.id)

//       if (existingItemIndex !== -1) {
//         // Item already exists, don't add it again
//         return state
//       }

//       const updatedCart = [...state.cart, newItem]
//       AddToSessionStorage(updatedCart, CART_KEY);
//       return {
//         ...state,
//         cart: updatedCart,
//       };
//     }
//     case 'REMOVE_FROM_CART': {
//       const filteredList = state.cart.filter((item) => item.id !== action.payload.id);
//       // REFACTOR: think through and see if we can pass filteredList
//       // instead of action.payload.id
//       RemoveFromSessionStorage(action.payload.id, CART_KEY);
//       return {
//         ...state,
//         cart: filteredList,
//       };
//     }
//     case 'CLEAR_CART': {
//       sessionStorage.removeItem(CART_KEY);
//       return {
//         ...state,
//         cart: [],
//       };
//     }

//     default:
//       return state;
//   }
// };

// const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cartState, dispatch] = useReducer(CartReducer, initialState);
//   console.log('cartState', cartState);

//   return (
//     <CartContext.Provider value={{ cartState, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export default CartProvider;









import { useContext, createContext, ReactNode, useEffect, useReducer, useMemo } from 'react';
import { getData, postData } from './../../../../libs/utils/apis/apiMethods';
import { toast } from 'react-toastify';
import { useAuth } from './AuthProvider';
import { apiEndpoints } from './../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../libs/utils/helpers/config';
import { SESSION_STORAGE_KEYS } from './../../../../libs/utils/sessionStorage';

export interface ICartItem {
  name: string;
  id: any;
  imageSrc: string;
  price: number;
  uploader: string;
  type: string;
  videoCvId: any;
}

interface IState {
  cart: ICartItem[];
}

const initialState: IState = {
  cart: [],
};

export const CartContext = createContext<{ cartState: IState; dispatch: React.Dispatch<any> } | undefined>(undefined);

const CartReducer = (state: IState, action: { type: string; payload: any }): IState => {
  let newState;
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
      };
    case 'ADD_TO_CART':
      const newItem = action.payload;
      const isDuplicate = state.cart.some((item) => item.videoCvId === newItem.videoCvId);

      if (isDuplicate) {
        return state;
      }

      return {
        ...state,
        cart: [...state.cart, newItem],
      };
    case 'REMOVE_FROM_CART':
      const idsToRemove = Array.isArray(action.payload) ? action.payload.map(item => item.id) : [action.payload.id];

      return {
        ...state,
        cart: state.cart.filter(item => !idsToRemove.includes(item.id)),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, dispatch] = useReducer(CartReducer, initialState);
  const { authState } = useAuth();

  // Fetch cart items from the backend when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
      if (authState.isAuthenticated && authState?.user?.userTypeId === 2) {
        try {
          const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_MY_CART}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.code === '00') {
            dispatch({ type: 'SET_CART', payload: response.data });
          }

        }
        catch (err) {
          // console.error('Unable to load cart items');
          return;
        }
      }
    };

    fetchCart();
  }, [authState.isAuthenticated, authState.user]);


  const contextValue = useMemo(() => ({
    cartState,
    dispatch
  }), [cartState]);

  return (
    <CartContext.Provider /* value={{ cartState, dispatch }} */ value={contextValue} >
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