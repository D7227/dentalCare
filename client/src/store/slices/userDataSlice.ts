import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface UserData {
  id: string;
  fullName: string;
  firstname: string;
  lastname: string;
  phone?: string;
  permissions: string[];
  contactNumber: string;
  roleId: string;
  clinicName: string;
  roleName: string;
  userType?: string;
  clinicLicenseNumber?: string;
  clinicId?: string;
  clinicAddressLine1?: string;
  clinicAddressLine2?: string;
  clinicCountry?: string;
  clinicCity?: string;
  clinicState?: string;
  clinicPincode?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingCountry?: string;
  billingPincode?: string;
  billingState?: string;
  gstNumber?: string;
  panNumber?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to check if user has permission
export const hasPermission = (user: UserData | null, permission: string): boolean => {
  if (!user) return false;
  return Array.isArray(user.permissions) && user.permissions.includes(permission);
};

// // Async thunk: Accepts JWT token, decodes it, fetches user data, and stores all in Redux
// export const fetchUserDataFromToken = createAsyncThunk(
//   'userData/fetchUserDataFromToken',
//   async (token: string, { rejectWithValue }) => {
//     try {
//       // Decode token to get user id
//       // Use jwt-decode if needed, or parse manually
//       const decoded: any = (await import('jwt-decode')).jwtDecode(token);
//       const userId = decoded.id;
//       if (!userId) throw new Error('Invalid token: no user id');
//       // Fetch user data from API
//       const response = await fetch(`http://localhost:5000/api/userData/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch user data');
//       }
//       const data = await response.json();
//       return { userData: data, token };
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed to fetch user data');
//     }
//   }
// );

const initialState = {
  userData: null as UserData | null,
};

// Utility to normalize userData payload
function extractUserData(payload: any): UserData {
  if (payload && payload.clinicData) {
    // Merge clinicData, roleName, and clinicId into a single object
    return {
      ...payload.clinicData,
      roleName: payload.roleName || payload.clinicData.roleName || '',
      clinicId: payload.clinicId || payload.clinicData.clinicId || payload.clinicData.id || '',
    };
  }
  return payload as UserData;
}

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    clearUserData(state) {
      state.userData = null;
    },
    setUser(state, action: PayloadAction<any>) {
      state.userData = extractUserData(action.payload);
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchUserDataFromToken.fulfilled, (state, action) => {
  //       state.userData = extractUserData(action.payload.userData);
  //     });
  // },
});

export const { clearUserData, setUser } = userDataSlice.actions;
export default userDataSlice.reducer;

// RTK Query API for user data
export const userDataApi = createApi({
  reducerPath: 'userDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['UserData'],
  endpoints: (builder) => ({
    getUserData: builder.query<UserData, string>({
      query: (id) => `/userData/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserData', id }],
    }),
    updateUserData: builder.mutation<UserData, { id: string; updates: Partial<UserData> }>({
      query: ({ id, updates }) => ({
        url: `/userUpdate/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'UserData', id }],
    }),
  }),
});

export const {
  useGetUserDataQuery,
  useUpdateUserDataMutation,
} = userDataApi; 