import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = process.env.NEXT_PUBLIC_API_LOCAL_URL;
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Vehicle {
    company: string;
    vehicleModel: string;
    year: number;
    vehicle_plate_number: string;
    vin_number?: string;
    color?: string;
    fuel_type?: string;
    transmission?: string;
    registrationNumber?: string;
    registration_State?: string;
    registration_Expiry_Date?: string | null;
    last_Inspection_Date?: string  | null;
}

interface VehicleState {
    vehicleinfo: Vehicle | null;
    isUpdating: boolean;
    iserror: string | null;
}

const initialState: VehicleState = {
    vehicleinfo: null,
    isUpdating: false,
    iserror: null,
};

export const updateVehicle = createAsyncThunk(
    "driver/vehicle-driver",
    async ({
        registrationNumber,
        vehicleData,
    }: {
        registrationNumber: string;
        vehicleData: {
            company: string;
            vehicleModel: string;
            year: number;
            vehicle_plate_number: string;
            vin_number?: string;
            color?: string;
            fuel_type?: string;
            transmission?: string;
            registrationNumber?: string;
            registration_State?: string;
            registration_Expiry_Date?: string | null;
            last_Inspection_Date?: string | null;
        };
    },
        { rejectWithValue }
    ) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No authentication token found.");
            }

            const response = await axios.put<Vehicle>(
                `${API_URL}/admin/update-vehicle/${registrationNumber}`,
                vehicleData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue("An unexpected error occurred");
        }
    }
);

const updateVehicleSlice = createSlice({
    name: "driver",
    initialState,
    reducers: {
        clearDriverState: (state) => {
            state.vehicleinfo = null;
            state.iserror = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateVehicle.pending, (state) => {
                state.isUpdating = true;
                state.iserror = null;
            })
            .addCase(updateVehicle.fulfilled, (state, action: PayloadAction<Vehicle>) => {
                state.isUpdating = true;
                state.vehicleinfo = action.payload;
            })
            .addCase(updateVehicle.rejected, (state, action) => {
                state.isUpdating = false;
                state.iserror = action.payload as string;
            });
    },
});

export const { clearDriverState } = updateVehicleSlice.actions;
export default updateVehicleSlice.reducer;