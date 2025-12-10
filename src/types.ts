export interface Coordinates {
    lat: number;
    lng: number;
    name: string;
    type: 'Hospital' | 'Clinic' | 'Pharmacy';
    address: string;
    distance: string; // e.g. "1.2 km"
    coords: Coordinates;
}
