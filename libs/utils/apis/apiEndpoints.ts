export enum apiEndpoints {
    // authentication flow
    AUTH_LOGIN = '/api/v1/auth/user/login',
    AUTH_REGISTER = '/api/v1/auth/user/register',
    PROFILE = '/api/v1/auth/user/profile',

    // video upload flow
    VIDEO_STATUS = '/api/v1/video/check/upload-request',
    VIDEO_UPLOAD = '/api/v1/video/upload-edit',
    AUTH_VIDEO_LIST = '/api/v1/video/auth/fetch/all',
    ALL_VIDEO_LIST = '/api/v1/video/fetch/all',
    VIDEO_BY_ID = '/api/v1/video/get/{videoId}',
    VIDEO_CATEGORY = '/api/v1/video/categories',
    VIDEO_UPLOAD_TYPE = '/api/v1/video/uploadtype',

    // payment flow
    PAYMENT = '/api/v1/payment',
}