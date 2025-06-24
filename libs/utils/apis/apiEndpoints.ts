export enum apiEndpoints {
    // authentication flow
    AUTH_LOGIN = '/api/v1/auth/user/login',
    AUTH_REGISTER = '/api/v1/auth/user/register',
    PROFILE = '/api/v1/auth/user/profile/update',
    GET_PROFILE = '/api/v1/auth/user/profile',
    VERIFY_MAIL = '/api/v1/auth/user/confirmemail',
    RESEND_MAIL_CONFIRMATION = '/api/v1/auth/ResendConfrimationEmail',
    FORGOT_PASSWORD_GENERATE_TOKEN = '/api/v1/auth/forgot_password/generate_token',
    FORGOT_PASSWORD_CONFIRM_TOKEN = '/api/v1/auth/forgot_password/confirm_token',
    FORGOT_PASSWORD_RESET_PASSWORD = '/api/v1/auth/forgot_password/reset_password',
    RESEND_2FA = '/api/v1/auth/resend/2FA',

    // video upload flow
    ALL_VIDEO_LIST = '/api/v1/video/fetch/all',
    AUTH_VIDEO_LIST = '/api/v1/video/auth/fetch/all',
    EMPLOYER_AUTH_VIDEO_LIST = '/api/v1/video/employer/auth/fetch/all',
    VIDEO_BY_ID = '/api/v1/video/get',
    VIDEO_UPLOAD = '/api/v1/video/upload-edit',
    VIDEO_CATEGORY = '/api/v1/video/categories',
    VIDEO_UPLOAD_TYPE = '/api/v1/video/uploadtype/get',
    VIDEO_STATUS = '/api/v1/video/check/upload-request',
    VIDEO_VIEWS = `/api/v1/video/add-view`,
    PROFESSIONAL_MANAGE_VIDEO = '/api/v1/video/manage',
    ADD_TO_WATCH_HISTORY = '/api/v1/video/watch-history/add',
    GET_WATCH_HISTORY = '/api/v1/video/watch-history/get',
    DELETE_FROM_WATCH_HISTORY = '/api/v1/video/watch-history/remove',

    // payment flow
    PAYMENT = '/api/v1/payment/checkout',
    FETCH_ALL_PAYMENTS = '/api/v1/payment/fetch/transactions/all',
    CHECKOUT_DETAILS = '/api/v1/payment/get',
    PAYMENT_DETAILS = '/api/v1/payment/get-details',

    // cart flow
    ADD_TO_CART = '/api/v1/cart/add',
    FETCH_MY_CART = '/api/v1/cart',
    REMOVE_FROM_CART = '/api/v1/cart/remove',

    // admin
    MANAGE_VIDEO = '/api/v1/admin/video/manage',
    MANAGE_ADS = '/api/v1/admin/ad/manage',
    MANAGE_JOBS = '/api/v1/admin/vacancy/manage',
    CREATE_SUB_ADMIN = '/api/v1/admin/create-sub-admin',
    GET_USERS = '/api/v1/admin/get/users/list',
    GET_USER = '/api/v1/admin/get/user/profile',
    CREATE_PROF_EMP_USER = '/api/v1/admin/user/create-prof-emp',
    MANAGE_PROF_EMP_USER = '/api/v1/admin/user/manage-prof-emp',
    APPROVE_EMPLOYER_USER = '/api/v1/admin/employer/manage',
    CREATE_AD_TYPE = '/api/v1/ads/adtypes/create-edit',
    CREATE_VIDEO_TYPE = '/api/v1/video/uploadtype/create-edit',
    UPDATE_USER = '/api/v1/admin/appuser/profile/update',

    // create ads flow
    ADD_ADS = '/api/v1/ads/create-edit',
    ALL_ADS = '/api/v1/ads/fetch/all',
    ALL_AUTH_ADS = '/api/v1/ads/auth/fetch/all',
    ADS_TYPE = '/api/v1/ads/types/get',
    ADS_BY_ID = '/api/v1/ads/get',
    ADS_STATUS = '/api/v1/ads/check/ad-request',
    RANDOM_ADS = '/api/v1/ads/get/rad',
    RANDOM_ADS_COUNT = '/api/v1/ads/avc',
    EMPLOYER_MANAGE_ADS = '/api/v1/ads/manage',

    // vacancy flow
    OPEN_VACANCY = '/api/v1/vacancy/create-edit',
    VACANCY_LIST = '/api/v1/vacancy/fetch/all',
    VACANCY_BY_ID = '/api/v1/vacancy/get',

    // misc
    COUNTRY = '/api/v1/helper/location/countries/create-edit',
    GET_COUNTRIES = '/api/v1/helper/location/countries/get',
    STATE = '/api/v1/helper/location/state/create-edit',
    GET_STATE = '/api/v1/helper/location/states/get',
    FAQ = '/api/v1/helper/faq/create-edit',
    GET_MISC = '/api/v1/helper/resource/get',
    COURSE = '/api/v1/helper/course/create-edit',
    CATEGORY = '/api/v1/helper/video-category/create-edit',
    INDUSTRY = '/api/v1/helper/industry/create-edit',
    INSTITUTION = '/api/v1/helper/institution/create-edit',
    DEGREECLASS = '/api/v1/helper/degree-class/create-edit',
    QUALIFICATION = '/api/v1/helper/qualification/create-edit',
    SITETESTIMONIAL = '/api/v1/helper/site-testimonial/create-edit',
    CVGUIDELINE = '/api/v1/helper/cv-guideline/create-edit',
}