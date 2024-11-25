export const UserRole = Object.freeze({
    CUSTOMER: 'Customer',
    SYSTEM_MANAGER: 'SystemManager',
    ADMINISTRATOR: 'Administrator',
    HOTEL_MANAGER: 'HotelManager',
    HOTEL_STAFF: 'HotelStaff',
    RESTAURANT_MANAGER: 'RestaurantManager',
    RESTAURANT_STAFF: 'RestaurantStaff',
    TRANSPORT_SERVICE_MANAGER: 'TransportServiceManager',
    TRANSPORT_SERVICE_STAFF: 'TransportServiceStaff',
    AMUSEMENT_CENTER_MANAGER: 'AmusementCenterManager',
    AMUSEMENT_CENTER_STAFF: 'AmusementCenterStaff'
});

export const VehicleData = [
    {
        make: 'Toyota',
        models: ['Camry', 'Corolla Cross', 'RAV4', 'Highlander']
    },
    {
        make: 'Honda',
        models: ['Civic', 'Accord', 'CR-V', 'Pilot']
    },
    {
        make: 'Ford',
        models: ['Focus', 'Mustang', 'Escape', 'Explorer']
    },
    {
        make: 'Chevrolet',
        models: ['Malibu', 'Impala', 'Equinox', 'Tahoe']
    },
    {
        make: 'BMW',
        models: ['3 Series', '5 Series', 'X3', 'X5']
    }
];

export const FuelTypes = {
    PETROL: 'Petrol',
    DIESEL: 'Diesel',
    ELECTRIC: 'Electric',
    HYBRID: 'Hybrid'
};
export const Transmissions = {
    MANUAL: 'Manual',
    AUTOMATIC: 'Automatic',
    SEMI_AUTOMATIC: 'Semi-Automatic'
};
export const AvailabilityStatuses = {
    AVAILABLE: 'Available',
    BOOKED: 'Booked',
    UNDER_MAINTENANCE: 'Under Maintenance',
    UNAVAILABLE: 'Unavailable'
}
export const RoomTypes = [
    { key: 'SINGLE', value: 'Single Room' },
    { key: 'DOUBLE', value: 'Double Room' },
    { key: 'SUITE', value: 'Suite' },
    { key: 'FAMILY', value: 'Family Room' },
    { key: 'DELUXE', value: 'Deluxe Room' }
];

export const BedTypes = [
    { key: 'SINGLE', value: 'Single Bed' },
    { key: 'DOUBLE', value: 'Double Bed' },
    { key: 'QUEEN', value: 'Queen Bed' },
    { key: 'KING', value: 'King Bed' },
    { key: 'TWIN', value: 'Twin Beds' },
    { key: 'BUNK', value: 'Bunk Beds' },
    { key: 'SOFA', value: 'Sofa Bed' },
    { key: 'ROLLAWAY', value: 'Rollaway Bed' }
];

