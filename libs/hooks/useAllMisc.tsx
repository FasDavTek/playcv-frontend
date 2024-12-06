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
    title?: string;
    content?: string;
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

                console.log(response);

                // const result = await response.json();

                // console.log(result);

                setData(response.data || []);
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