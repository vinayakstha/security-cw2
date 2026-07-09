export const API = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GETCURRENTUSER: "api/user/me",
    UPDATEPROFILE: "/api/user/update-profile",
    REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    TOTP: {
      SETUP: "/api/auth/totp/setup",
      VERIFY_ENABLE: "/api/auth/totp/verify-enable",
      DISABLE: "/api/auth/totp/disable",
      LOGIN_VERIFY: "/api/auth/totp/login-verify",
    },
  },
  ADMIN: {
    CATEGORY: {
      CREATE: "/api/admin/category",
      GETALL: "api/admin/category",
      GETONE: (categoryId: string) => `/api/admin/category/${categoryId}`,
      UPDATE: (categoryId: string) => `/api/admin/category/${categoryId}`,
      DELETE: (categoryId: string) => `/api/admin/category/${categoryId}`,
    },
    SERVICE: {
      CREATE: "/api/admin/service",
      GETALL: "/api/admin/service",
      GETONE: (serviceId: string) => `/api/admin/service/${serviceId}`,
      UPDATE: (serviceId: string) => `/api/admin/service/${serviceId}`,
      DELETE: (serviceId: string) => `/api/admin/service/${serviceId}`,
      GET_SERVICE_BY_CATEGORY: (categoryId: string) =>
        `api/admin/service/category${categoryId}`,
    },
    BOOKING: {
      GETALL: "/api/admin/booking",
      GETONE: (bookingId: string) => `/api/admin/booking/${bookingId}`,
      UPDATE: (bookingId: string) => `/api/admin/booking/${bookingId}/status`,
    },
    USER: {
      CREATE: "/api/admin/users/",
      GET_ALL: "/api/admin/users/",
      GET_ONE: (userId: string) => `/api/admin/users/${userId}`,
      UPDATE: (userId: string) => `/api/admin/users/${userId}`,
      DELETE: (userId: string) => `/api/admin/users/${userId}`,
    },
  },

  USER: {
    CATEGORY: {
      GETALL: "/api/category",
      GETONE: (categoryId: string) => `/api/category/${categoryId}`,
    },
    SERVICE: {
      GETALL: "/api/service",
      GETONE: (serviceId: string) => `/api/service/${serviceId}`,
      GETALLBYCATEGORY: (categoryId: string) =>
        `/api/service/category/${categoryId}`,
    },
    BOOKING: {
      CREATE: "/api/booking",
      GETALLBYUSER: "/api/booking",
      DELETE: (bookingId: string) => `/api/booking/${bookingId}`,
    },
    FAVOURITE: {
      CREATE: "/api/favourite",
      DELETE: (favouriteId: string) => `/api/favourite/${favouriteId}`,
      GETALLBYUSER: "/api/favourite",
    },
    PAYMENT: {
      INITIATE: "/api/khalti/initiate",
      VERIFY: "/api/khalti/verify",
    },
  },
};
