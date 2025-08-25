import { Drivers, DriversResponse } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// const API_URL = process.env.NEXT_PUBLIC_API_LOCAL_URL;
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import axios from "axios";

interface DriverState {
  data: Drivers[];
  isLoading: boolean;
  isthereerror: string | null;
}

const initialState: DriverState = {
  data: [],
  isLoading: false,
  isthereerror: null,
};

export const fetchdriverdetails = createAsyncThunk(
  "admin/fetchdriverdetails",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.get<DriversResponse>(
        `${API_URL}/admin/driver-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("data --> ", response.data)
      return response.data; // Return admin data
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        "No Drivers Data",
      );
    }
  },
);

const driverDetailSlice = createSlice({
  name: "driverFetching",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data = [];
      state.isLoading = false;
      state.isthereerror = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchdriverdetails.pending, (state) => {
        state.isLoading = true;
        state.isthereerror = null;
      })
      .addCase(
        fetchdriverdetails.fulfilled,
        (state, action: PayloadAction<DriversResponse>) => {
          state.isLoading = false;
          state.data = action.payload.data;
        },
      )
      .addCase(fetchdriverdetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isthereerror = action.payload as string;
      });
  },
});

export const { clearData } = driverDetailSlice.actions;
export default driverDetailSlice.reducer;
