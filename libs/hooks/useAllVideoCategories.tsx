// import { useQuery } from '@tanstack/react-query';
// import { getData } from '../utils/apis/apiMethods';
// import CONFIG from '../utils/helpers/config';
// import { apiEndpoints } from '../utils/apis/apiEndpoints';
// import { SESSION_STORAGE_KEYS } from '../utils/sessionStorage';
// import { toast } from 'react-toastify';

// export const getAllVideoCategory = async ({
//     queryKey,
// }: {
//     queryKey: any;
// }) => {
//     const { page, size } = queryKey[1];

//     const data = await getData(
//         `${CONFIG.BASE_URL}${apiEndpoints.VIDEO_CATEGORY}`
//     );
//     console.log('Video Categories', data);
//     return data;
// };

// export const useAllVideoCategory = ({
//     page,
//     size,
// }: {
//     page: number;
//     size: number;
// }) => {
//     return useQuery(
//         ['AllVideoCategory', { page, size }],
//         getAllVideoCategory,
//     )
// }