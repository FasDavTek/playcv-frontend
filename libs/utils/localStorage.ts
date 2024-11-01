import { ICartItem } from './../../apps/video-cv/src/context/CartProvider';

export const GetItemsFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  const parsedData = data ? JSON.parse(data) : [];
  return parsedData;
};

// REFACTOR:
export const AddToLocalStorage = (item: any, key: string) => {
  const data = GetItemsFromLocalStorage(key);
  // const joinedData = data ? [...data, item] : [item];
  // localStorage.setItem(key, JSON.stringify(joinedData));
  const updatedData = Array.isArray(data) ? [...data, item] : [item];
  localStorage.setItem(key, JSON.stringify(updatedData));
  // return joinedData;
};

export const RemoveFromLocalStorage = (id: string, key: string) => {
  const data = GetItemsFromLocalStorage(key);
  // const filteredData = data ? data.filter((item: any) => item.id !== id) : [];
  const updatedData = data.filter((item: ICartItem) => item.id !== id);
  // localStorage.setItem(key, JSON.stringify(filteredData));
  localStorage.setItem(key, JSON.stringify(updatedData));
};



export enum LOCAL_STORAGE_KEYS {
  TOKEN = "token",
  USER = "user",
  SUB_ACCOUNTS = "subaccounts",
  USER_BIO_DATA_ID = "userBiodataId",
  INSURED_USER_BIO_DATA_ID = "insuredUserBiodataId",
  DETAILS = "details",
  IS_USER_EXIST = "isUserExist",
  PROFILE = "profile",
  SIGNUP_DATA = "signupData",
}



// export const GetItemsFromLocalStorage = (key: string) => {
//   const data = localStorage.getItem(key);
//   const parsedData = data ? JSON.parse(data) : null;
//   return parsedData;
// };

// // REFACTOR:
// export const AddToLocalStorage = (item: any, key: string) => {
//   const data = GetItemsFromLocalStorage(key);
//   // const joinedData = data ? [...data, item] : [item];
//   // localStorage.setItem(key, JSON.stringify(joinedData));
//   const updatedData = [...data, item];
//   localStorage.setItem(key, JSON.stringify(updatedData));
//   // return joinedData;
// };

// export const RemoveFromLocalStorage = (id: string, key: string) => {
//   const data = GetItemsFromLocalStorage(key);
//   // const filteredData = data ? data.filter((item: any) => item.id !== id) : [];
//   const updatedData = data.filter((item: any) => item.id !== id);
//   // localStorage.setItem(key, JSON.stringify(filteredData));
//   localStorage.setItem(key, JSON.stringify(updatedData));
// };
