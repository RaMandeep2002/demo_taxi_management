import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ScheduleState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: ScheduleState = {
    loading: false,
    error: null,
    success: false,
};

// Async thunk to call API
export const scheduleRide = createAsyncThunk(
    "schedule/scheduleRide",
    async (
        {
            customerName,
            customer_phone_number,
            customer_email,
            number_of_passengers,
            time,
            date,
            pickupAddress,
            dropOffAddress,
            roundTrip,
            returnDate,
            returnTime,
        }: {
            customerName: string;
            customer_phone_number: string;
            customer_email:string;
            number_of_passengers:string,
            time: string;
            date: string;
            pickupAddress: string;
            dropOffAddress: string;
            roundTrip?: boolean,
            returnDate?: string,
            returnTime?: string,
        },
        { rejectWithValue }
    ) => {
        try {

            const token = localStorage.getItem("token");

            if (!token) {
                return rejectWithValue("No authentication token found.");
            }

            console.log("data ---- >", {
                customerName,
                customer_phone_number,
                customer_email,
                number_of_passengers,
                time,
                date,
                pickupAddress,
                dropOffAddress,
                roundTrip,
                returnDate,
                returnTime
            });
            const response = await axios.post(
                `${API_URL}/admin/scheduleRide`, // ✅ Replace with your backend URL
                {
                    customerName,
                    customer_phone_number,
                    customer_email,
                    number_of_passengers,
                    time,
                    date,
                    pickupAddress,
                    dropOffAddress,
                    roundTrip,
                    returnDate,
                    returnTime,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            // @ts-expect-error this is giving no import error
            if (axios.isAxiosError(error)) {
                // @ts-expect-error this is giving no import error
                return rejectWithValue(error.response?.data?.message || "API Error");
            }

            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("An unknown error occurred");
        }
    }
);

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(scheduleRide.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(scheduleRide.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(scheduleRide.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { resetStatus } = scheduleSlice.actions;
export default scheduleSlice.reducer;
