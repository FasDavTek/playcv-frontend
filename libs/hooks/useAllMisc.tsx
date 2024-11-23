// import { useQuery, QueryFunction } from "@tanstack/react-query";
// import { getData, postData } from '../utils/apis/apiMethods';
// import CONFIG from '../utils/helpers/config';
// import { apiEndpoints } from '../utils/apis/apiEndpoints';

// interface MiscQueryParams {
//     page?: number;
//     limit?: number;
//     download?: boolean;
//     resource: string;
// }

// interface UseAllMiscResult<T> {
//     data: T | null;
//     isLoading: boolean;
//     error: Error | null;
// }

// export const getAllMisc = async (params: MiscQueryParams) => {
//     const queryParams = new URLSearchParams({
//         ...(params.page !== undefined && { page: params.page.toString() }),
//         ...(params.limit !== undefined && { limit: params.limit.toString() }),
//         ...(params.download !== undefined && { download: params.download.toString() }),
//         resource: params.resource,
//     });

    
//     const data = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_MISC}?${queryParams.toString()}`);
//     return data;
// };

// export const useAllMisc = (params: MiscQueryParams) => {
//     return useQuery({
//         queryKey: ['AllMisc', params],
//         queryFn: () => getAllMisc(params),
//         refetchOnWindowFocus: false,
//         retry: 1,
//     });
// };










import { useState, useEffect } from 'react';
import { getData } from '../utils/apis/apiMethods';
import CONFIG from '../utils/helpers/config';
import { apiEndpoints } from '../utils/apis/apiEndpoints';

interface MiscQueryParams {
    page?: number;
    limit?: number;
    download?: boolean;
    resource: string;
}

interface MiscItem {
    id: string;
    name: string;
}

interface UseAllMiscResult {
    data: MiscItem[];
    isLoading: boolean;
    error: Error | null;
}

export const useAllMisc = (params: MiscQueryParams): UseAllMiscResult => {
    const [data, setData] = useState<MiscItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const queryParams = new URLSearchParams({
                    ...(params.page !== undefined && { page: params.page.toString() }),
                    ...(params.limit !== undefined && { limit: params.limit.toString() }),
                    ...(params.download !== undefined && { download: params.download.toString() }),
                    resource: params.resource,
                });

                const url = `${CONFIG.BASE_URL}${apiEndpoints.GET_MISC}?${queryParams.toString()}`;
                const response = await getData(url);
                
                if (!response.Success) {
                    throw new Error('Failed to fetch data');
                }

                const result = await response.json();

                setData(result.data || []);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An error occurred while fetching data'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.page, params.limit, params.download, params.resource]);

    return { data, isLoading, error };
};