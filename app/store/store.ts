"use client";

// Redux store setup for the booking app admin panel
import { configureStore } from "@reduxjs/toolkit";

// Importing all reducers for different slices of the application state
import authReducer from "../admin/slices/slice/authSlice";
import adminReducer from "../admin/slices/slice/adminslice";
import adddriverreducer from "../admin/slices/slice/addDriverSlice";
import addUserReducer from "../admin/slices/slice/addUserSlice";
import driverFetcingreducer from "../admin/slices/slice/fetchingDriversSlice";
import adminFetchingReducer from "../admin/slices/slice/fetchingAdminSlice";
import detailWithVehicleReducer from "../admin/slices/slice/detailWithVechicle";
import registerVehicleReducer from "../admin/slices/slice/registerVehicleSlice";
import updatedriverReducer from "../admin/slices/slice/updateDriverSlice";
import deleteDriverReducer from "../admin/slices/slice/deleteDriverSlice";
import updateVehicleReducer from "../admin/slices/slice/updateVehicleSlice";
import deleteVehicleReducer from "../admin/slices/slice/deleteVehicleSlice";
import fetchBookingHistoryReducer from "../admin/slices/slice/booingHistorySlice";
import updateSettingReducer from "../admin/slices/slice/UpdateSettingSlice";
import settingsReducer from "../admin/slices/slice/settingSlics"
import BookingReportReducer from "../admin/slices/slice/getReportSlice"
import driverStatusReducer from "../admin/slices/slice/driverStatusSlice"
import shiftsWithVehicleReducer from "../admin/slices/slice/shiftandvehicleSlice";
import shiftActionsReducer from "../admin/slices/slice/stopShiftsDriver";
import scheduleReducer from "../admin/slices/slice/scheduleRideSlice";
import dashboardStatsReducer from "../admin/slices/slice/getCountSlice";
import resetPasswordReducer from "../admin/slices/slice/resetPasswordSlice";
import updateAdminReducer from "../admin/slices/slice/updateUserSlice";
import deleteAdminsReducer from "../admin/slices/slice/deleteAdminSlice";
import stopAllShiftReducer from "../admin/slices/slice/stopAllShiftSlice";
import fetchScheduleHistoryReducer from "../admin/slices/slice/getScheduleRideSlice"
// Configure the Redux store with all the imported reducers
export const store = configureStore({
  reducer: {
    auth: authReducer, // Handles authentication state
    admin: adminReducer, // Handles admin user state
    addDriver: adddriverreducer, // Handles adding new drivers
    addUser : addUserReducer, // Handles adding new users
    driversFetching: driverFetcingreducer, // Handles fetching drivers
    adminFetching: adminFetchingReducer, // Handles fetching admins
    updateAdmin : updateAdminReducer, // Handles updating admin users
    deleteAdmins: deleteAdminsReducer,
    detailWithVehicle: detailWithVehicleReducer, // Handles driver details with vehicle info
    registerVehicle: registerVehicleReducer, // Handles vehicle registration
    fetchBookingHistory:fetchBookingHistoryReducer, // Handles booking history
    fetchScheduleHistory: fetchScheduleHistoryReducer,
    updateDriverinfo : updatedriverReducer, // Handles updating driver info
    deleteDriver: deleteDriverReducer, // Handles deleting drivers
    updateVehcile: updateVehicleReducer, // Handles updating vehicle info
    deleteVehicle: deleteVehicleReducer, // Handles deleting vehicles
    updateSetting : updateSettingReducer, // Handles updating settings
    settings: settingsReducer, // Handles settings state
    getBookingReport : BookingReportReducer, // Handles booking reports
    driverStatus: driverStatusReducer, // Handles driver status
    shiftsWithVehicle : shiftsWithVehicleReducer, // Handles shifts with vehicle info
    shiftActions: shiftActionsReducer, // Handles shift actions (e.g., stop shift)
    scheduleRIde:scheduleReducer, // Handles ride scheduling
    dashboardStats: dashboardStatsReducer, // Handles dashboard statistics
    resetPassword: resetPasswordReducer, // Handles password reset
    stopAllShift : stopAllShiftReducer,

  },
});

// Types for use throughout the app for type-safe Redux usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
