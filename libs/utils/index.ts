import { Dayjs } from 'dayjs';

import {
  GetItemsFromSessionStorage,
  AddToSessionStorage,
  RemoveFromSessionStorage,
} from './sessionStorage';

export { GetItemsFromSessionStorage, AddToSessionStorage, RemoveFromSessionStorage };

/**
 *
 * @param dateString - in this format: 2023-06-16T15:50:27.596Z
 * @param returnIsToday - when true, it returns date - in this format: "8:58 PM, Today", else returns default format
 * @returns date - in this format: 8:58 PM, Jun 7, 2023
 */
export function formatDate(
  dateString?: string | Dayjs | null | Date,
  returnIsToday: boolean = true
) {
  if (!dateString || typeof dateString !== 'string') return '-';
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const time = date.toLocaleTimeString('en-US', options);

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday && returnIsToday) {
    return `${time}, Today`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return `${time}, ${formattedDate}`;
  }
}


export const handleDate = (inputDate?: any) => {
  if (
    inputDate === null ||
    inputDate === undefined ||
    inputDate === "" ||
    !inputDate
  ) {
    return null;
  } else {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
};