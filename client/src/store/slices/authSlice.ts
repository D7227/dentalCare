import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  id: string;
  fullName: string;
  permissions: string[];
  contactNumber: string;
  roleId: string;
  clinicName: string;
  roleName: string;
  userType?: string;
  clinicId?: string;
  clinicAddressLine1?: string;
  clinicAddressLine2?: string;
  clinicCity?: string;
  clinicState?: string;
  clinicPincode?: string;
  clinicCountry?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingPincode?: string;
  billingCountry?: string;
  gstNumber?: string;
  panNumber?: string;
  email?: string;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Helper function to check if user has permission
export const hasPermission = (user: UserData | null, permission: string): boolean => {
  if (!user) return false;
  return Array.isArray(user.permissions) && user.permissions.includes(permission);
};

// Helper to fetch role name by roleId
async function fetchRoleNameById(roleId: string): Promise<string> {
  if (!roleId) return '';
  try {
    const response = await fetch(`/api/roles/${roleId}`);
    if (response.ok) {
      const data = await response.json();
      return data.name || '';
    }
  } catch (e) {
    // ignore
  }
  return '';
}

// Async thunk for team member login
export const loginTeamMember = createAsyncThunk(
  'auth/loginTeamMember',
  async ({ mobileNumber, password }: { mobileNumber: string; password: string }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobileNumber, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const user = await response.json();
    if (!user.roleName && user.roleId) {
      user.roleName = await fetchRoleNameById(user.roleId);
    }
    return user;
  }
);

// Async thunk for finding user by mobile number (works for both team members and clinics)
export const findUserByMobile = createAsyncThunk(
  'auth/findUserByMobile',
  async (mobileNumber: string) => {
    // First try to find team member
    try {
      const response = await fetch(`/api/team-members/mobile/${mobileNumber}`);
      if (response.ok) {
        const teamMember = await response.json();
        if (!teamMember.roleName && teamMember.roleId) {
          teamMember.roleName = await fetchRoleNameById(teamMember.roleId);
        }
        return {
          id: teamMember.id,
          fullName: teamMember.fullName,
          permissions: teamMember.permissions || [],
          contactNumber: teamMember.contactNumber || '',
          roleId: teamMember.roleId || 'team-member',
          clinicName: teamMember.clinicName || '',
          roleName: teamMember.roleName || '',
          userType: 'teamMember',
          clinicId: teamMember.clinicId || '',
          clinicAddressLine1: teamMember.clinicAddressLine1 || '',
          clinicAddressLine2: teamMember.clinicAddressLine2 || '',
          clinicCity: teamMember.clinicCity || '',
          clinicState: teamMember.clinicState || '',
          clinicPincode: teamMember.clinicPincode || '',
          clinicCountry: teamMember.clinicCountry || '',
          billingAddressLine1: teamMember.billingAddressLine1 || '',
          billingAddressLine2: teamMember.billingAddressLine2 || '',
          billingCity: teamMember.billingCity || '',
          billingState: teamMember.billingState || '',
          billingPincode: teamMember.billingPincode || '',
          billingCountry: teamMember.billingCountry || '',
          gstNumber: teamMember.gstNumber || '',
          panNumber: teamMember.panNumber || '',
          email: teamMember.email || '',
        };
      }
    } catch (error) {
      console.log('Team member not found, trying clinic...');
    }
    // If team member not found, try to find clinic
    try {
      const response = await fetch(`/api/clinics/mobile/${mobileNumber}`);
      if (response.ok) {
        const clinic = await response.json();
        if (!clinic.roleName && clinic.roleId) {
          clinic.roleName = await fetchRoleNameById(clinic.roleId);
        }
        return {
          id: clinic.id,
          fullName: `${clinic.firstname} ${clinic.lastname}`,
          permissions: clinic.permissions || [],
          contactNumber: clinic.phone || '',
          roleId: clinic.roleId || 'clinic-role',
          clinicName: clinic.clinicName || '',
          roleName: clinic.roleName || '',
          userType: 'clinic',
          clinicId: clinic.id || '',
          clinicAddressLine1: clinic.clinicAddressLine1 || '',
          clinicAddressLine2: clinic.clinicAddressLine2 || '',
          clinicCity: clinic.clinicCity || '',
          clinicState: clinic.clinicState || '',
          clinicPincode: clinic.clinicPincode || '',
          clinicCountry: clinic.clinicCountry || '',
          billingAddressLine1: clinic.billingAddressLine1 || '',
          billingAddressLine2: clinic.billingAddressLine2 || '',
          billingCity: clinic.billingCity || '',
          billingState: clinic.billingState || '',
          billingPincode: clinic.billingPincode || '',
          billingCountry: clinic.billingCountry || '',
          gstNumber: clinic.gstNumber || '',
          panNumber: clinic.panNumber || '',
          email: clinic.email || '',
        };
      }
    } catch (error) {
      console.log('Clinic not found');
    }
    throw new Error('User not found');
  }
);

// Async thunk for clinic registration
export const registerClinic = createAsyncThunk(
  'auth/registerClinic',
  async (clinicsData: any) => {
    // const response = await fetch('/api/clinic/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(clinicsData),
    // });

    const response = await fetch('http://localhost:5000/api/clinic/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clinicsData),
    });
    if (!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    const result = await response.json();
    const clinics = result.clinics || result.clinic || result; // fallback for different backend responses
    if (!clinics.roleName && clinics.roleId) {
      clinics.roleName = await fetchRoleNameById(clinics.roleId);
    }
    return {
      id: clinics.id,
      fullName: `${clinics.firstname} ${clinics.lastname}`,
      permissions: clinics.permissions || [],
      contactNumber: clinics.phone || '',
      roleId: clinics.roleId || '2411f233-1e48-43ae-9af9-6d5ce0569278',
      clinicName: clinics.clinicName || '',
      roleName: clinics.roleName || '',
      userType: 'clinic',
      clinicId: clinics.id || '',
      clinicAddressLine1: clinics.clinicAddressLine1 || '',
      clinicAddressLine2: clinics.clinicAddressLine2 || '',
      clinicCity: clinics.clinicCity || '',
      clinicState: clinics.clinicState || '',
      clinicPincode: clinics.clinicPincode || '',
      clinicCountry: clinics.clinicCountry || '',
      billingAddressLine1: clinics.billingAddressLine1 || '',
      billingAddressLine2: clinics.billingAddressLine2 || '',
      billingCity: clinics.billingCity || '',
      billingState: clinics.billingState || '',
      billingPincode: clinics.billingPincode || '',
      billingCountry: clinics.billingCountry || '',
      gstNumber: clinics.gstNumber || '',
      panNumber: clinics.panNumber || '',
      email: clinics.email || '',
      address: clinics.address || '',
    };
  }
);

// Async thunk for clinic login
export const loginClinic = createAsyncThunk(
  'auth/loginClinic',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch('/api/clinic/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    const clinic = await response.json();
    if (!clinic.roleName && clinic.roleId) {
      clinic.roleName = await fetchRoleNameById(clinic.roleId);
    }
    return {
      id: clinic.id,
      fullName: `${clinic.firstname} ${clinic.lastname}`,
      permissions: clinic.permissions || [],
      contactNumber: clinic.phone || '',
      roleId: clinic.roleId || 'clinic-role',
      clinicName: clinic.clinicName || '',
      roleName: clinic.roleName || '',
      userType: 'clinic',
      clinicId: clinic.id || '',
      clinicAddressLine1: clinic.clinicAddressLine1 || '',
      clinicAddressLine2: clinic.clinicAddressLine2 || '',
      clinicCity: clinic.clinicCity || '',
      clinicState: clinic.clinicState || '',
      clinicPincode: clinic.clinicPincode || '',
      clinicCountry: clinic.clinicCountry || '',
      billingAddressLine1: clinic.billingAddressLine1 || '',
      billingAddressLine2: clinic.billingAddressLine2 || '',
      billingCity: clinic.billingCity || '',
      billingState: clinic.billingState || '',
      billingPincode: clinic.billingPincode || '',
      billingCountry: clinic.billingCountry || '',
      gstNumber: clinic.gstNumber || '',
      panNumber: clinic.panNumber || '',
      email: clinic.email || '',
    };
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ mobileNumber, password }: { mobileNumber: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Login failed');
      }
      if (!data.roleName && data.roleId) {
        data.roleName = await fetchRoleNameById(data.roleId);
      }
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTeamMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginTeamMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginTeamMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(findUserByMobile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(findUserByMobile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(findUserByMobile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to find user';
      })
      .addCase(registerClinic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerClinic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerClinic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(loginClinic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginClinic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginClinic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
