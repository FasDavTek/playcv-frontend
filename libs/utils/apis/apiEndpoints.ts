export enum apiEndpoints {
    // authentication flow
    AUTH_LOGIN = '/api/v1/auth/user/login',
    AUTH_REGISTER = '/api/v1/auth/user/register',
    PROFILE = '/api/v1/auth/user/profile',
    UPDATE_PROFILE = '/api/v1/auth/user/profile/update',

    // video upload flow
    VIDEO_STATUS = '/api/v1/payment/check/upload-request',
    VIDEO_UPLOAD = '/api/v1/video/upload-edit',
}