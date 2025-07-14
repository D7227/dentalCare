import { createApi, fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// --- Types ---
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: any;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

// --- Token Utilities ---
const ACCESS_TOKEN_KEY = "doctor_access_token";
const REFRESH_TOKEN_KEY = "doctor_refresh_token";

export const setAuthTokens = (tokens: AuthTokens) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const removeAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Decode JWT payload (returns null if invalid)
export const decodeJWT = (token: string | null): any => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Check if JWT is expired
export const isTokenExpired = (token: string | null): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

// Get current user from token
export const getCurrentUser = (): any => {
  const token = getAccessToken();
  const payload = decodeJWT(token);
  return payload ? payload.user || payload : null;
};

// --- Custom baseQuery to attach token and handle expiry ---
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let accessToken = getAccessToken();
  // Auto-logout if token expired
  if (isTokenExpired(accessToken)) {
    removeAuthTokens();
    return { error: { status: 401, data: { message: "Session expired. Please login again." } } };
  }
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: "/api/doctor-auth",
    prepareHeaders: (headers) => {
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
      return headers;
    },
  });
  return rawBaseQuery(args, api, extraOptions);
};

export const doctorAuthApi = createApi({
  reducerPath: "doctorAuthApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken) {
            setAuthTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
          }
        } catch {}
      },
    }),
    register: builder.mutation<any, RegisterRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<any, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          removeAuthTokens();
        }
      },
    }),
    // Optionally: add refreshToken endpoint here if your backend supports it
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useLogoutMutation,
} = doctorAuthApi;
