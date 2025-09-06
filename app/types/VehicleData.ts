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
  
  export interface ValidationError {
    path: string;
    message: string;
  }
  
  export interface VehicleState {
    vehicles: Vehicle[];
    validationErrors: ValidationError[];
    isloading: boolean;
    iserror: string | null;
  }
  
  export interface VehicleResponse{
    message: string;
    vehicle: Vehicle;
  }

  export interface ApiErrorResponse {
    error?: string;
    message?: string;
    errors?: ValidationError[];
    validationErrors?: ValidationError[];
  }