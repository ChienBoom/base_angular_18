import { AuthConfig } from 'angular-oauth2-oidc';

export const authSSOConfig: AuthConfig = {
    // URL của Identity Provider (thay bằng URL thực tế của bạn, ví dụ Keycloak, Auth0, hoặc IdentityServer)
    issuer: 'https://auth.aratech.vn',

    // URL mà người dùng sẽ được chuyển hướng đến sau khi đăng nhập
    redirectUri: 'http://localhost:4200/login',

    // Client ID được đăng ký với Identity Provider
    clientId: '309501537648967686',

    // Loại phản hồi (dùng 'code' cho Authorization Code Flow + PKCE)
    responseType: 'code',

    // Các scope yêu cầu (tùy thuộc vào Identity Provider của bạn)
    scope: 'openid profile email offline_access',

    // // Bật chế độ debug để kiểm tra lỗi dễ dàng hơn
    // showDebugInformation: true,

    // // Tắt kiểm tra nghiêm ngặt tài liệu khám phá (nếu cần)
    // strictDiscoveryDocumentValidation: false,

    // // Bật refresh token tự động (nếu Identity Provider hỗ trợ)
    // useSilentRefresh: true,

    // Sử dụng OIDC
    oidc: true,

    //
    postLogoutRedirectUri: 'http://localhost:4200/logout',

    //
    requireHttps: false,
};
