export interface Vehicle {
    id?: string; // optional for frontend
    registrationNumber?: string; // generated on backend
    company: string;
    vehicleModel: string;
    year: number;
    vehicle_plate_number:string;
    vin_number?: string;
    color?: string;
    fuel_type?: string;
    transmission?: string;
    registration_State?: string;
    registration_Expiry_Date?: string;
    last_Inspection_Date?: string;
    isAssigned?: boolean;
  }
  
  export interface VehicleState {
    vehicles: Vehicle[];
    isloading: boolean;
    iserror: string | null;
  }
  