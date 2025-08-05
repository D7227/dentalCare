import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  employeeId: string;
  departmentId: string;
  departmentName?: string;
  roleName?: string;
  status: "active" | "inactive";
  profilePic?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTechnicianRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  employeeId: string;
  departmentId: string;
  password: string;
  status?: "active" | "inactive";
}

export interface UpdateTechnicianRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  employeeId?: string;
  departmentId?: string;
  status?: "active" | "inactive";
}

export interface Department {
  id: string;
  name: string;
  isActive: boolean;
  technicianCount?: number;
}

export const technicianApi = createApi({
  reducerPath: "technicianApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/technician",
  }),
  tagTypes: ["Technician", "Department"],
  endpoints: (builder) => ({
    // Get all technicians with pagination
    getTechnicians: builder.query<
      {
        technicians: Technician[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["Technician"],
    }),

    // Get technician by ID
    getTechnicianById: builder.query<Technician, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Technician", id }],
    }),

    // Create new technician
    createTechnician: builder.mutation<Technician, CreateTechnicianRequest>({
      query: (technician) => ({
        url: "/register",
        method: "POST",
        body: technician,
      }),
    }),

    // Update technician
    updateTechnician: builder.mutation<Technician, UpdateTechnicianRequest>({
      query: ({ id, ...updates }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: updates,
      }),
    }),

    // Delete technician
    deleteTechnician: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),

    // Get all departments
    getDepartments: builder.query<Department[], void>({
      query: () => "/departments",
    }),

    // Get technician statistics
    getTechnicianStats: builder.query<
      {
        total: number;
        active: number;
        inactive: number;
        byDepartment: Record<string, number>;
      },
      void
    >({
      query: () => "/stats",
    }),
  }),
});

export const {
  useGetTechniciansQuery,
  useGetTechnicianByIdQuery,
  useCreateTechnicianMutation,
  useUpdateTechnicianMutation,
  useDeleteTechnicianMutation,
  useGetDepartmentsQuery,
  // useGetTechniciansByDepartmentQuery,
  useGetTechnicianStatsQuery,
} = technicianApi;
