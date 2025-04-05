export interface Location {
  latitude: number;
  longitude: number;
}

export interface Drivers {
  location: Location;
  _id: string;
  driverId: string;
  drivername: string;
  email: string;
  phoneNumber: number;
  driversLicenseNumber: string;
  vehicle: []; // Replace `any` with a specific type if needed
  password: string;
  status: string;
  shifts: []; // Replace `any` with a specific type if needed
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DriversResponse {
  success: boolean;
  message: string;
  data: Drivers[];
}
