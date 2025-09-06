// import api from "@/lib/axiosConfig";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import api from "@/lib/axiosConfig";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Driver {
  drivername: string;
  email: string;
  driversLicenseNumber: string;
  phoneNumber: string;
  password: string;
  licenseState?: string;
  licenseExpiryDate?: string;
  licenseClass?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface DriverState {
  driver: Driver | null;
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationError[];
  successMessage: string | null;
}

interface DriverResponse {
  message: string;
  driver: Driver;
}

// Define the structure of error responses
interface ApiErrorResponse {
  error?: string;
  message?: string;
  errors?: ValidationError[];
  validationErrors?: ValidationError[];
}

const initialState: DriverState = {
  driver: null,
  isLoading: false,
  error: null,
  validationErrors: [],
  successMessage: null,
};

export const addDriver = createAsyncThunk<
  DriverResponse,
  Driver,
  { rejectValue: ApiErrorResponse }
>(
  "driver/addDriver",
  async (driverData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({ error: "No authentication token found." });
      }

      const response = await axios.post<DriverResponse>(
        `${API_URL}/admin/add-driver`,
        driverData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
        const errorMessage = data?.message || data?.error || "API Error";
        return rejectWithValue({ error: errorMessage });
      }

      // Handle non-Axios errors
      if (error instanceof Error) {
        return rejectWithValue({ error: error.message });
      }

      return rejectWithValue({ error: "An unknown error occurred" });
    }
  }
);

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    clearDriverState: (state) => {
      state.driver = null;
      state.error = null;
      state.validationErrors = [];
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDriver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = [];
        state.successMessage = null;
      })
      .addCase(
        addDriver.fulfilled,
        (state, action: PayloadAction<DriverResponse>) => {
          state.isLoading = false;
          state.driver = action.payload.driver;
          state.successMessage = action.payload.message;
          state.error = null;
          state.validationErrors = [];
        }
      )
      .addCase(addDriver.rejected, (state, action) => {
        state.isLoading = false;
        
        const payload = action.payload as ApiErrorResponse;
        
        // Handle validation errors
        if (payload?.validationErrors) {
          state.validationErrors = payload.validationErrors;
          state.error = "Please correct the highlighted errors and try again.";
        } 
        // Handle regular error messages
        else if (payload?.error) {
          state.error = payload.error;
          state.validationErrors = [];
        } 
        // Handle other error formats
        else if (payload?.message) {
          state.error = payload.message;
          state.validationErrors = [];
        }
        // Fallback for unknown errors
        else {
          state.error = action.error.message || "Unknown error occurred";
          state.validationErrors = [];
        }
      });
  },
});

export const { clearDriverState } = driverSlice.actions;
export default driverSlice.reducer;