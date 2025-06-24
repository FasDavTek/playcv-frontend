import type { ICartItem } from './../../apps/video-cv/src/context/CartProvider';

export enum SESSION_STORAGE_KEYS {
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

export const GetItemsFromSessionStorage = <T = any>(key: SESSION_STORAGE_KEYS): T | undefined => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : undefined;
  } catch (error) {
    console.error(`Error reading from sessionStorage (key: ${key}):`, error);
    return undefined;
  }
};

export const AddToSessionStorage = <T = any>(item: T, key: SESSION_STORAGE_KEYS): void => {
  try {
    const currentData = GetItemsFromSessionStorage<T[]>(key);
    const updatedData = Array.isArray(currentData) ? [...currentData, item] : [item];
    sessionStorage.setItem(key, JSON.stringify(updatedData));
  } catch (error) {
    console.error(`Error adding to sessionStorage (key: ${key}):`, error);
  }
};

export const RemoveFromSessionStorage = (id: string, key: SESSION_STORAGE_KEYS): void => {
  try {
    const data = GetItemsFromSessionStorage<ICartItem[]>(key);
    if (Array.isArray(data)) {
      const updatedData = data.filter((item) => item.id !== id);
      sessionStorage.setItem(key, JSON.stringify(updatedData));
    }
  } catch (error) {
    console.error(`Error removing from sessionStorage (key: ${key}):`, error);
  }
};

export const ClearSessionStorageKey = (key: SESSION_STORAGE_KEYS): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing sessionStorage key (${key}):`, error);
  }
};

export const ClearAllSessionStorage = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing all sessionStorage:', error);
  }
};