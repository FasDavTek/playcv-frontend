export const GetItemsFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  const parsedData = data ? JSON.parse(data) : null;
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
  const updatedData = data.filter((item: any) => item.id !== id);
  // localStorage.setItem(key, JSON.stringify(filteredData));
  localStorage.setItem(key, JSON.stringify(updatedData));
};







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
