export interface Location {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface Driver {
  drivername?: string;
}
export interface Vehicle{
    company:string;
    vehicleModel:string;
}

export interface BookingHistory {
  bookingId: string;
  pickup?: Location;
  dropOff?: Location;
  pickuptime?: string;
  pickupDate?: string;
  pickupTimeFormatted?: string;
  pickupMonth?: string;
  pickupWeek?: string;
  dropdownDate?: string;
  dropdownTime?: string;
  wating_time?: number;
  wating_time_formated?: string;
  distance?: number;
  totalFare?: number;
  paymentStatus?: string;
  status?: string;
  driver?: Driver;
  vehicle?: Vehicle;
}

export interface BookingState {
  bookings: BookingHistory[];
  loading: boolean;
  error: string | null;
}
