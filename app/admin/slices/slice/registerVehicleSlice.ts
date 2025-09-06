import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import { ApiErrorResponse, Vehicle, VehicleState } from "@/app/types/VehicleData";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Vehicle {
  id?: string; // optional for frontend
  registrationNumber?: string; // generated on backend
  company: string;
  vehicleModel: string;
  year: number;
  vehicle_plate_number:string;
  vin_number?: string;
  color?: string;
  fuel_type?: string;
  transmission?: string;
  registration_State?: string;
  registration_Expiry_Date?: string;
  last_Inspection_Date?: string;
  isAssigned?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface VehicleState {
  vehicles: Vehicle[];
  validationErrors: ValidationError[];
  isloading: boolean;
  iserror: string | null;
}

export interface VehicleResponse{
  message: string;
  vehicle: Vehicle[];
}

export interface ApiErrorResponse {
  iserror?: string;
  message?: string;
  errors?: ValidationError[];
  validationErrors?: ValidationError[];
}

const initialState: VehicleState = {
  vehicles: [],
  validationErrors: [],
  isloading: false,
  iserror: null,
};  


export const registerVehicle = createAsyncThunk<
  Vehicle,
  Vehicle,
  { rejectValue: ApiErrorResponse }
>("admin/registerVehicle", async (vehicleData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.post<Vehicle>(
      `${API_URL}/admin/register-vehicle-shared`,
      vehicleData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    // @ts-expect-error error type
    if (axios.isAxiosError(error)) {
      // @ts-expect-error error type
      const data = error.response?.data as ApiErrorResponse;

      // Handle validation errors from backend
      if (data?.errors) {
        return rejectWithValue({ validationErrors: data.errors });
      }
      if (data?.validationErrors) {
        return rejectWithValue({ validationErrors: data.validationErrors });
      }

      // Handle other API errors
      const errorMessage = data?.message || data?.iserror || "API Error";
      return rejectWithValue({ iserror: errorMessage });
    }

    // Handle non-Axios errors
    if (error instanceof Error) {
      return rejectWithValue({ iserror: error.message });
    }

    return rejectWithValue({ iserror: "An unknown error occurred" });
  }
});

const registerVehicleSlice = createSlice({
  name: "registerVehicle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerVehicle.pending, (state) => {
        state.isloading = true;
        state.iserror = null;
        state.validationErrors = [];
      })
      .addCase(registerVehicle.fulfilled, (state, action) => {
        state.isloading = false;
        state.vehicles.push(action.payload);
      })
      .addCase(registerVehicle.rejected, (state, action) => {
        state.isloading = false;
        
        const payload = action.payload as ApiErrorResponse;
        
        // Handle validation errors
        if (payload?.validationErrors) {
          state.validationErrors = payload.validationErrors;
          state.iserror = "Please correct the highlighted errors and try again.";
        } 
        // Handle regular error messages
        else if (payload?.iserror) {
          state.iserror = payload.iserror;
          state.validationErrors = [];
        } 
        // Handle other error formats
        else if (payload?.message) {
          state.iserror = payload.message;
          state.validationErrors = [];
        }
        // Fallback for unknown errors
        else {
          state.iserror = action.error.message || "Unknown error occurred";
          state.validationErrors = [];
        }
      });
  },
});
export default registerVehicleSlice.reducer;
