// types/DriverVehicleData.ts

export interface Vehicle {
  _id: string;
  registrationNumber: string;
  company: string;
  vehicleModel: string;
  year: number;
  vehicle_plate_number:string;
  vin_number: string;
  color: string;
  fuel_type: string;
  transmission: string;
  registration_State: string;
  registration_Expiry_Date: string;
  last_Inspection_Date: string;
  status: string;
  isAssigned: boolean;
}

export interface VehicleResponse {
  message: string;
  vehicles: Vehicle[];
}
