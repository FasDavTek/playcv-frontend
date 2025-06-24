import { useQuery, useQueryClient } from "react-query";
import { getData } from '../../libs/utils/apis/apiMethods';
import CONFIG from '../../libs/utils/helpers/config';
import { apiEndpoints } from '../../libs/utils/apis/apiEndpoints';

export const getAllCountry = async () => {
    const data = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_COUNTRIES}`);
    return data;
};

export const useAllCountry = () => {
    // return useQuery(['AllCountry'], getAllCountry, {
    //     refetchOnWindowFocus: false, // Refetch on window focus
    //     retry: 1,
    // });


    const queryClient = useQueryClient()
    const query = useQuery(["AllCountry"], getAllCountry, {
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const refetch = () => queryClient.invalidateQueries(["AllCountry"])

    return { ...query, refetch }
};