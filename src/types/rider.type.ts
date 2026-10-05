export type VehicleType = "BIKE" | "BICYCLE" | "VAN";

export interface ApplyAsRiderData {
    user: {
        name: string;
        email: string;
    };
    riderProfile: {
        phone: string;
        address?: string;
        nid: string;
        licenseNumber: string;
        vehicleType: VehicleType;
    };
}

export interface ApplyAsRiderPayload {
  vehiclePaper: File;
  data: ApplyAsRiderData;
}
