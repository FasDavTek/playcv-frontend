import { useQuery } from "react-query";
import { getData, postData } from '../../libs/utils/apis/apiMethods';
import CONFIG from '../../libs/utils/helpers/config';
import { apiEndpoints } from '../../libs/utils/apis/apiEndpoints';

export const getAllState = async () => {
    const data = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_STATE}`);
    return data;
};

export const useAllState = () => {
    return useQuery(['AllState'], getAllState, {
        refetchOnWindowFocus: false, // Refetch on window focus
        retry: 1,
    });
};