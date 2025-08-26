import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ScheduleData {
    _id:string;
    customerName: string;
    customer_phone_number: string;
    customer_email?: string;
    number_of_passengers?: string;
    pickuptime: string;
    pickupDate: string;
    pickupAddress: string;
    dropOffAddress: string;
    status: "schedule" | "Pickup";
    roundTrip: boolean;
    returnDate?: string;
    returnTime?: string;
    sendtoemail?:boolean;
}

export interface ScheduleState {
    data: ScheduleData[];
    loading: boolean;
    error: string | null;
}

export const initialState: ScheduleState = {
    data: [],
    loading: false,
    error: null
}

export const fetchScheduleHistory = createAsyncThunk<ScheduleData[], void, { rejectValue: string }>(
    "schedule/fetchHistory",
    async (_, { rejectWithValue }) => {
        try {
            // const token = localStorage.getItem("token");

            // if (!token) {
            //   return rejectWithValue("No authentication token found.");
            // }
            const response = await axios.get<{ data: ScheduleData[] }>(`${API_URL}/admin/getScheduleBookings`);
              console.log(response.data.data)
            return response.data.data;
        } catch (error:unknown) {
             // @ts-expect-error this is giving no import error 
            if (axios.isAxiosError(error)) {
                // @ts-expect-error this is giving no import error
                return rejectWithValue(error.response?.data?.message || "No Schedule Booking Available!!");
              }
            
              if (error instanceof Error) {
                return rejectWithValue(error.message);
              }
            
              return rejectWithValue("An unknown error occurred");
        }
    }
);


const scheduleListSlice = createSlice({
    name: "schdulelist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchScheduleHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchScheduleHistory.fulfilled, (state, action: PayloadAction<ScheduleData[]>) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchScheduleHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export default scheduleListSlice.reducer;
