import { Vehicle, VehicleResponse } from "@/app/types/DriverVechicleData";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface VehicleState {
  data: Vehicle[];
  isLoading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  data: [],
  isLoading: false,
  error: null,
};

export const fetchDetailWithVehicle = createAsyncThunk<Vehicle[]>(
  "vehicles/fetchDetailWithVehicle",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<VehicleResponse>(
        `${API_URL}/api/driver/getDriverVechile`,
      );
      return response.data.vehicles;
    } catch (error) {
      console.error(error);
      return rejectWithValue("NO vehicle data");
    }
  }
);

const detailWithVehicleSlice = createSlice({
  name: "detailWithVehicleSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailWithVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchDetailWithVehicle.fulfilled,
        (state, action: PayloadAction<Vehicle[]>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchDetailWithVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default detailWithVehicleSlice.reducer;
