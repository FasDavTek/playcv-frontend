import { useState, useEffect, useRef, useCallback } from 'react';
import { getData } from '../utils/apis/apiMethods';
import CONFIG from '../utils/helpers/config';
import { apiEndpoints } from '../utils/apis/apiEndpoints';

interface MiscQueryParams {
    page?: number;
    limit?: number;
    download?: boolean;
    resource: string;
    enabled?: boolean;
    structureType?: 'full' | 'data';
}

interface MiscItem {
    id: string;
    name: string;
    institutionName: string;
    courseName: string;
    title?: string;
    content?: string;
}

interface UseAllMiscResult {
    data: MiscItem[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>
}

export const useAllMisc = (params: MiscQueryParams): UseAllMiscResult => {
    const [data, setData] = useState<MiscItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const hasFetched = useRef(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         // if (params.enabled === false || hasFetched.current) {
    //         //     setData([]);
    //         //     setIsLoading(false);
    //         //     return;
    //         // }

    //         try {
    //             setIsLoading(true);
    //             const queryParams = new URLSearchParams({
    //                 ...(params.page !== undefined && { page: params.page.toString() }),
    //                 ...(params.limit !== undefined && { limit: params.limit.toString() }),
    //                 ...(params.download !== undefined && { download: params.download.toString() }),
    //                 resource: params.resource,
    //             });

    //             const url = `${CONFIG.BASE_URL}${apiEndpoints.GET_MISC}?${queryParams.toString()}`;
    //             const response = await getData(url);

    //             console.log(response);

    //             // const result = await response.json();

    //             // console.log(result);

    //             if (params.structureType === 'data') {
    //                 setData(response.data); // Use the data property
    //             } else {
    //                 setData(response); // Use the full response
    //             }
    //             hasFetched.current = true;
    //         } catch (err) {
    //             setError(err instanceof Error ? err : new Error('An error occurred while fetching data'));
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [params.page, params.limit, params.download, params.resource, params.enabled]);

    // return { data, isLoading, error };



    const fetchData = useCallback(async () => {
        try {
          setIsLoading(true)
          const queryParams = new URLSearchParams({
            ...(params.page !== undefined && { page: params.page.toString() }),
            ...(params.limit !== undefined && { limit: params.limit.toString() }),
            ...(params.download !== undefined && { download: params.download.toString() }),
            resource: params.resource,
          })
    
          const url = `${CONFIG.BASE_URL}${apiEndpoints.GET_MISC}?${queryParams.toString()}`
          const response = await getData(url)
    
          if (params.structureType === "data") {
            setData(response.data)
          } else {
            setData(response)
          }
          hasFetched.current = false
        } catch (err) {
          setError(err instanceof Error ? err : new Error("An error occurred while fetching data"))
        } finally {
          setIsLoading(false)
        }
    }, [params.page, params.limit, params.download, params.resource, params.structureType])

    useEffect(() => {
      if (params.enabled !== false && !hasFetched.current) {
          fetchData()
      }
    }, [fetchData, params.enabled])

    const refetch = useCallback(() => {
      return fetchData()
    }, [fetchData])

    return { data, isLoading, error, refetch }
};