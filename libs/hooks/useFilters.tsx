import { useState } from 'react';

export interface Params {
  currentPage: number;
  pageSize: number;
}

export interface UseFiltersResult {
  url: URL;
  filters: Params;
  setFilters: React.Dispatch<React.SetStateAction<Params>>;
}

const buildApiUrl = (path: string, filters: Params, baseUrl: string): URL => {
  const { currentPage, pageSize } = filters;
  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.append('currentPage', `${currentPage}`);
  url.searchParams.append('pageSize', String(pageSize));
  return url;
};

const useFilters = (baseUrl: string, path: string): UseFiltersResult => {
  const [filters, setFilters] = useState<Params>({
    currentPage: 1,
    pageSize: 10,
  });

  const url = buildApiUrl(path, filters, baseUrl);

  return { url, filters, setFilters };
};

export default useFilters;
