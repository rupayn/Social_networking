export const USER_ID_KEY = (id: string) => `user:id:${id}`;
export const USER_EMAIL_KEY = (email: string) => `user:email:${email}`;
export const USER_ALL_KEY = `user:all`;
export const REFRESH_KEY = (token: string) => `session:refresh:${token}`;
export const USER_EMAIL_PASS_KEY = (email: string) => `user:email:password:${email}`;
export const RESET_PASSWORD_CODE_KEY = (id: string) => `${id}-reset-password-code`;
export const SHORT_SESSION_KEY = (token: string) => `shortSession-${token}`;
