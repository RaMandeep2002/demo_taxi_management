import { BookingHistory, BookingState } from "@/app/types/BookingHistoryData";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const initialState: BookingState = {
    bookings: [],
    loading: false,
    error: null
}

export const fetchBookingHistory = createAsyncThunk<BookingHistory[], void, { rejectValue: string }>(
    "booking/fetchHistory",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
              return rejectWithValue("No authentication token found.");
            }
            const response = await axios.get<{ bookings: BookingHistory[] }>(`${API_URL}/admin/bookings`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              console.log(response.data.bookings)
            return response.data.bookings;
        } catch (error:unknown) {
             // @ts-expect-error this is giving no import error
            if (axios.isAxiosError(error)) {
                // @ts-expect-error this is giving no import error
                return rejectWithValue(error.response?.data?.message || "No Bookings");
              }
            
              if (error instanceof Error) {
                return rejectWithValue(error.message);
              }
            
              return rejectWithValue("An unknown error occurred");
        }
    }
);


const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookingHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookingHistory.fulfilled, (state, action: PayloadAction<BookingHistory[]>) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(fetchBookingHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export default bookingSlice.reducer;
