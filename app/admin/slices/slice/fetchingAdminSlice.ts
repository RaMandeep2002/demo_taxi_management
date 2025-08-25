import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// const API_URL = process.env.NEXT_PUBLIC_API_LOCAL_URL;
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import axios from "axios";


export interface Admins {
    _id: string;
    name: string;
    email: string;
    role:string;
    password: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface AdminsResponse {
    success: boolean;
    message: string;
    data: Admins[];
  }


interface AdminState {
  data: Admins[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  data: [],
  isLoading: false,
  error: null,
};

export const fetchAdminsdetails = createAsyncThunk(
  "admin/fetchAdminsdetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<AdminsResponse>(
        `${API_URL}/admin/allAdminInfo`
      );
      return response.data; // Return admin data
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        "Failed to Get Admins Data",
      );
    }
  },
);

const adminDetailSlice = createSlice({
  name: "adminFetching",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminsdetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminsdetails.fulfilled,
        (state, action: PayloadAction<AdminsResponse>) => {
          state.isLoading = false;
          state.data = action.payload.data;
        },
      )
      .addCase(fetchAdminsdetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearData } = adminDetailSlice.actions;
export default adminDetailSlice.reducer;
