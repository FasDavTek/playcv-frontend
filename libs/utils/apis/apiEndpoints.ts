export enum apiEndpoints {
    // authentication flow
    AUTH_LOGIN = '/api/v1/auth/user/login',
    AUTH_REGISTER = '/api/v1/auth/user/register',
    PROFILE = '/api/v1/auth/user/profile',

    // video upload flow
    VIDEO_STATUS = '/api/v1/video/check/upload-request',
    VIDEO_UPLOAD = '/api/v1/video/upload-edit',
    AUTH_VIDEO_LIST = '/api/v1/video/auth/fetch/all',
    EMPLOYER_AUTH_VIDEO_LIST = '/api/v1/video/employer/auth/fetch/all',
    ALL_VIDEO_LIST = '/api/v1/video/fetch/all',
    VIDEO_BY_ID = '/api/v1/video/get/{videoId}',
    VIDEO_CATEGORY = '/api/v1/video/categories',
    VIDEO_UPLOAD_TYPE = '/api/v1/video/uploadtype',

    // payment flow
    PAYMENT = '/api/v1/payment',

    // admin
    MANAGE_VIDEO = '/api/v1/admin/video/manage',
    MANAGE_ADS = '/api/v1/admin/ad/manage',
    CREATE_SUB_ADMIN = '/api/v1/admin/create-sub-admin',
    GET_USERS = '/api/v1/admin/get/users/list',
    GET_USER = '/api/v1/admin/get/user/profile/:useremail',
    CREATE_AD_TYPE = '',

    // add ads flow
    ADD_ADS = '/api/v1/ads/create-edit',
    ALL_ADS = '/api/v1/ads/fetch/all',
    ALL_AUTH_ADS = '/api/v1/ads//auth/fetch/all',
    ADS_TYPE = '/api/v1/ads/types/get',
    ADS_BY_ID = '/api/v1/ads/get/:{adId}',
    ADS_STATUS = '/api/v1/ads/check/ad-request',
}