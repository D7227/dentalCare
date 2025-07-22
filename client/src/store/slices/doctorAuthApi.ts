import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";
import { setUser, userDataApi } from "./userDataSlice";

export interface AuthToken {
  token: string;
}

export interface LoginRequest {
  mobileNumber: string;
  password: string;
}
export interface UserData {
  [key: string]: any;
}

export const doctorAuthApi = createApi({
  reducerPath: "doctorAuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthToken, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { token } = await queryFulfilled.then(res => res.data);
          localStorage.setItem("token", token);

          // Decode token to get user id
          const decoded: any = jwtDecode(token);

          console.log('decoded', decoded)
          const userId = decoded.id;
          console.log('userId', userId)
          // Fetch user data and store in localStorage
          const userDataResult = await dispatch(
            userDataApi.endpoints.getUserData.initiate(userId)
          ).unwrap();
          console.log('userDataResult', userDataResult)
          dispatch(setUser(userDataResult))
        } catch (err) {
          console.log('err - redux', err)
        }
      },
    }),
    register: builder.mutation<any, UserData>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { token } = await queryFulfilled.then(res => res.data);
          localStorage.setItem("token", token);

          // Decode token to get user id
          const decoded: any = jwtDecode(token);

          console.log('decoded', decoded)
          const userId = decoded.id;
          console.log('userId', userId)
          // Fetch user data and store in localStorage
          const userDataResult = await dispatch(
            userDataApi.endpoints.getUserData.initiate(userId)
          ).unwrap();
          console.log('userDataResult', userDataResult)
          dispatch(setUser(userDataResult))
        } catch (err) {
          console.log('err - redux', err)
          // Handle error if needed
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        // No API call needed for logout
        url: "#logout",
        method: "POST",
      }),
      async onQueryStarted() {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChanged"));
      },
    }),
  }),
});

export const {
  useLoginMutation,
  // useGetUserDataQuery,
  useRegisterMutation,
  useLogoutMutation
} = doctorAuthApi;
