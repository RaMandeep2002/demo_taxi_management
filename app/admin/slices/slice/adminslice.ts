"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Admin {
  name: string;
  email: string;
  role: string;
}

interface AdminState {
  data: Admin | null;
  isLoad: boolean;
  isthereError: string | null;
}
    
interface ApiResponse {
  admin: Admin;
}

const initialState: AdminState = {
  data: null,
  isLoad: false,
  isthereError: null,
};

export const fetchAdminInfo = createAsyncThunk(
  "admin/fetchAdminInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get<ApiResponse>(
        `${API_URL}/admin/adminInfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data?.admin) {
        throw new Error("Invalid response structure");
      }
      console.log("admin --> ", response.data.admin)
      return response.data.admin;
    } catch (error) {
      console.log(error)
      return rejectWithValue("Failed to fetch admin info") || "Failed to fetch admin info";
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminInfo.pending, (state) => {
        state.isLoad = true;
        state.isthereError = null;
      })
      .addCase(fetchAdminInfo.fulfilled, (state, action: PayloadAction<Admin>) => {
        state.isLoad = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminInfo.rejected, (state, action) => {
        state.isLoad = false;
        state.isthereError = action.payload as string;
      });
  },
});

export default adminSlice.reducer;