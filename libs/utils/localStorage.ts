import type { ICartItem } from './../../apps/video-cv/src/context/CartProvider';

export const GetItemsFromLocalStorage = (key: any) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

export const AddToLocalStorage = (items: any, key: string): void => {
  const data = GetItemsFromLocalStorage(key);
  const updatedData = Array.isArray(data) ? [...data, items] : [items];
  localStorage.setItem(key, JSON.stringify(updatedData))
}

export const RemoveFromLocalStorage = (id: string, key: string): void => {
  const data = GetItemsFromLocalStorage(key)
  const updatedData = data.filter((item: ICartItem) => item.id !== id)
  localStorage.setItem(key, JSON.stringify(updatedData))
}








export enum LOCAL_STORAGE_KEYS {
  TOKEN = "token",
  USER = "user",
  USER_EMAIL = "userEmail",
  SUB_ACCOUNTS = "subaccounts",
  USER_BIO_DATA_ID = "userBiodataId",
  INSURED_USER_BIO_DATA_ID = "insuredUserBiodataId",
  DETAILS = "details",
  IS_USER_EXIST = "isUserExist",
  PROFILE = "profile",
  SIGNUP_DATA = "signupData",
  VIEWED_VIDEOS = "viewedVideos",
  AD_DURATION = "adDuration",
}