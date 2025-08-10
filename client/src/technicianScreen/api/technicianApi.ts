// API service for technician-related operations

const API_BASE_URL = "/api/technician";

export interface ApiTask {
  flowId: string;
  orderNumber: string;
  orderId: string;
  departmentId: string;
  status: string;
  prescriptionTypesId: string;
  subPrescriptionTypesId: string;
  selectedTeethId: string;
  extractedTeethNumbers: number[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export class TechnicianApiService {
  static async getTechnicianTasks(departmentId: string): Promise<ApiTask[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/total/${departmentId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ApiTask[]> = await response.json();

      return result.data || [];
    } catch (error) {
      console.error("Error fetching technician tasks:", error);
      throw error;
    }
  }

  static async getTechnicianAssignedTasks(technicianId: string): Promise<ApiTask[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/assigned/${technicianId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ApiTask[]> = await response.json();

      return result.data || [];
    } catch (error) {
      console.error("Error fetching technician assigned tasks:", error);
      throw error;
    }
  }

  static async acceptTask(orderId: string, technicianId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/accept/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ technicianId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error accepting task:", error);
      throw error;
    }
  }

  static async startTask(orderId: string, technicianId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/start/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ technicianId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error starting task:", error);
      throw error;
    }
  }

  static async completeTask(orderId: string, technicianId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/complete/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ technicianId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    }
  }

  static async resignTask(orderId: string, technicianId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/resign/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ technicianId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error resigning task:", error);
      throw error;
    }
  }
}
