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
  specialization?: string;
  experience?: string;
  profilePic?: string;
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
  specialization?: string;
  experience?: string;
}

export interface UpdateTechnicianRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  employeeId?: string;
  departmentId?: string;
  specialization?: string;
  experience?: string;
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
    // Get all technicians
    getTechnicians: builder.query<Technician[], void>({
      query: () => "/",
      providesTags: ["Technician"],
    }),

    // // Get technician by ID
    // getTechnicianById: builder.query<Technician, string>({
    //   query: (id) => `/technician/${id}`,
    //   providesTags: (result, error, id) => [{ type: "Technician", id }],
    // }),

    // Create new technician
    createTechnician: builder.mutation<Technician, CreateTechnicianRequest>({
      query: (technician) => ({
        url: "/register",
        method: "POST",
        body: technician,
      }),
      invalidatesTags: ["Technician"],
    }),

    // // Update technician
    // updateTechnician: builder.mutation<Technician, UpdateTechnicianRequest>({
    //   query: ({ id, ...updates }) => ({
    //     url: `/technician/${id}`,
    //     method: "PUT",
    //     body: updates,
    //   }),
    //   invalidatesTags: (result, error, { id }) => [
    //     { type: "Technician", id },
    //     "Technician",
    //   ],
    // }),

    // Delete technician
    deleteTechnician: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Technician"],
    }),

    // Get all departments
    getDepartments: builder.query<Department[], void>({
      query: () => "/departments",
    }),

    // // Get technicians by department
    // getTechniciansByDepartment: builder.query<Technician[], string>({
    //   query: (departmentId) => `/technician/department/${departmentId}`,
    //   providesTags: ["Technician"],
    // }),

    // // Get technician statistics
    // getTechnicianStats: builder.query<
    //   {
    //     total: number;
    //     active: number;
    //     inactive: number;
    //     byDepartment: Record<string, number>;
    //     byRole: Record<string, number>;
    //   },
    //   void
    // >({
    //   query: () => "/technician/stats",
    //   providesTags: ["Technician"],
    // }),
  }),
});

export const {
  useGetTechniciansQuery,
  // useGetTechnicianByIdQuery,
  useCreateTechnicianMutation,
  // useUpdateTechnicianMutation,
  useDeleteTechnicianMutation,
  useGetDepartmentsQuery,
  // useGetTechniciansByDepartmentQuery,
  // useGetTechnicianStatsQuery,
} = technicianApi;
