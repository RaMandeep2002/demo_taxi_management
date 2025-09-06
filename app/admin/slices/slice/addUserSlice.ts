import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface User {
    name: string;
    email: string;
    password: string;
    phone_number:string;
    role: string;
}

interface UserState {
    user: User | null;               // Single user for addUser
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}
interface AddUserResponse {
    message: string;
    user: User;
}

const initialState: UserState = {
    user: null,
    isLoading: false,
    error: null,
    successMessage: null,
};


// ✅ Async thunk to add a driver
export const addUser = createAsyncThunk<
    AddUserResponse,                      // ✅ Return type on success
    User,                              // ✅ Argument type passed to the thunk
    { rejectValue: string }              // ✅ Custom reject type
>(
    "driver/addUser",
    async (userData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return rejectWithValue("No authentication token found.");
              }
        
            const response = await axios.post<AddUserResponse>(
                `${API_URL}/api/auth/register`,
                userData,
                {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
            );

            console.log(response.data)

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

const addUserSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        clearUsersState: (state) => {
            state.user = null;
            state.error = null;
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(
                addUser.fulfilled,
                (state, action: PayloadAction<AddUserResponse>) => {
                    state.isLoading = false;
                    state.user = action.payload.user;
                    state.successMessage = action.payload.message;
                }
            )
            .addCase(addUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Unknown error occurred.";
            });
    },
});

export const { clearUsersState } = addUserSlice.actions;
export default addUserSlice.reducer;
