export enum apiEndpoints {
    // authentication flow
    AUTH_LOGIN = '/api/v1/auth/user/login',
    AUTH_REGISTER = '/api/v1/auth/user/register',
    PROFILE = '/api/v1/auth/user/profile',

    // video upload flow
    ALL_VIDEO_LIST = '/api/v1/video/fetch/all',
    AUTH_VIDEO_LIST = '/api/v1/video/auth/fetch/all',
    EMPLOYER_AUTH_VIDEO_LIST = '/api/v1/video/employer/auth/fetch/all',
    VIDEO_BY_ID = '/api/v1/video/get/{videoId}',
    VIDEO_UPLOAD = '/api/v1/video/upload-edit',
    VIDEO_CATEGORY = '/api/v1/video/categories',
    VIDEO_UPLOAD_TYPE = '/api/v1/video/uploadtype/get',
    VIDEO_STATUS = '/api/v1/video/check/upload-request',

    // payment flow
    PAYMENT = '/api/v1/payment/checkout',
    FETCH_ALL_PAYMENTS = '/api/v1/payment/fetch/transactions/all',
    CHECKOUT_DETAILS = '/api/v1/payment/get/{checkoutId}',
    PAYMENT_DETAILS = '/api/v1/payment/get-details/{paymentId}',

    // admin
    MANAGE_VIDEO = '/api/v1/admin/video/manage',
    MANAGE_ADS = '/api/v1/admin/ad/manage',
    CREATE_SUB_ADMIN = '/api/v1/admin/create-sub-admin',
    GET_USERS = '/api/v1/admin/get/users/list',
    GET_USER = '/api/v1/admin/get/user/profile/:useremail',
    CREATE_PROF_EMP_USER = '/api/v1/admin/user/create-prof-emp',
    MANAGE_PROF_EMP_USER = '/api/v1/admin/user/manage-prof-emp',
    CREATE_AD_TYPE = '/api/v1/ads/types/create-edit',
    CREATE_VIDEO_TYPE = '/api/v1/video/uploadtype/create-edit',

    // create ads flow
    ADD_ADS = '/api/v1/ads/create-edit',
    ALL_ADS = '/api/v1/ads/fetch/all',
    ALL_AUTH_ADS = '/api/v1/ads/auth/fetch/all',
    ADS_TYPE = '/api/v1/ads/types/get',
    ADS_BY_ID = '/api/v1/ads/get/:{adId}',
    ADS_STATUS = '/api/v1/ads/check/ad-request',

    // vacancy flow
    OPEN_VACANCY = '/api/v1/vacancy/create-edit',
    VACANCY_LIST = '/api/v1/vacancy/fetch/all',
    VACANCY_BY_ID = '/api/v1/vacancy/get/{vacancyEmail}',

    // misc
    COUNTRIES = '/api/v1/helper/location/countries/get',
    STATE = '/api/v1/helper/location/states/get',
    FAQ = '/api/v1/helper/get/faq',
    GET_MISC = '/api/v1/helper/resource/get',
}