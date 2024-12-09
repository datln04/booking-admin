import React from 'react'
import { UserRole } from './util/Enum'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const User = React.lazy(() => import('./views/user/User'))
const Booking = React.lazy(() => import('./views/booking/Booking'))
const Hotel = React.lazy(() => import('./views/hotel/Hotel'))
const Province = React.lazy(() => import('./components/province/Province'))
const District = React.lazy(() => import('./components/district/District'))
const Commune = React.lazy(() => import('./components/commune/Commune'))
const Amenity = React.lazy(() => import('./components/amenity/Amenity'))
const HotelAmenity = React.lazy(() => import('./components/hotel-amenity/HotelAmenity'))
const TransportService = React.lazy(() => import('./components/Transport/TransportService'))
const Dietary = React.lazy(() => import('./components/dietary/Dietary'))
const Cusine = React.lazy(() => import('./components/cusine/Cusine'))
const Table = React.lazy(() => import('./components/table/Table'))
const Restaurant = React.lazy(() => import('./components/restaurant/Restaurant'))
const RestaurantDietaries = React.lazy(() => import('./components/restaurant/RestaurantDietaries'))
const Feature = React.lazy(() => import('./components/feature/Feature'))
const TransportFeatures = React.lazy(() => import('./components/transport-feature/TransportFeature'))
const Room = React.lazy(() => import('./components/room/Room'))
const ExperienceService = React.lazy(() => import('./components/experience/ExperienceService'))
const ExperienceSetting = React.lazy(() => import('./components/experience/ExperienceSetting'))
const RestrictionInformation = React.lazy(() => import('./components/restriction/RestrictionInformation'))
const AdditionalInformation = React.lazy(() => import('./components/additional/AdditionalInformation'))


const routes = [
  { path: '/', exact: true, name: 'Home', roles: [UserRole.ADMINISTRATOR] },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, roles: [UserRole.ADMINISTRATOR] },
  { path: '/user-management', name: 'User', element: User, roles: [UserRole.ADMINISTRATOR] },
  { path: '/booking-management', name: 'Booking', element: Booking, roles: [UserRole.ADMINISTRATOR] },
  // hotel
  { path: '/hotels', name: 'Hotel', element: Hotel, roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER] },
  { path: '/rooms', name: 'Room', element: Room, roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER, UserRole.HOTEL_STAFF] },
  { path: '/amenities', name: 'Amenity', element: Amenity, roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER, UserRole.HOTEL_STAFF] },
  { path: '/hotel-amenities', name: 'Hotel Amenities', element: HotelAmenity, roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER, UserRole.HOTEL_STAFF] },
  { path: '/provinces', name: 'Province', element: Province, roles: [UserRole.ADMINISTRATOR] },
  { path: '/districts', name: 'District', element: District, roles: [UserRole.ADMINISTRATOR] },
  { path: '/communes', name: 'Commune', element: Commune, roles: [UserRole.ADMINISTRATOR] },
  // transport
  { path: '/transport-services', name: 'Transport Service Management', element: TransportService, roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER] },
  { path: '/features', name: 'Features', element: Feature, roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER] },
  { path: '/transport-feature', name: 'Transport Features', element: TransportFeatures, roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER, UserRole.TRANSPORT_SERVICE_STAFF] },
  // restaurant
  { path: '/restaurants', name: 'Restaurants', element: Restaurant, roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER] },
  { path: '/restaurant-dietaries', name: 'Restaurant Dietarie Options', element: RestaurantDietaries, roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF] },
  { path: '/dietaries', name: 'Dietaries', element: Dietary, roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF] },
  { path: '/tables', name: 'Tables', element: Table, roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF] },
  { path: '/cusines', name: 'Cusines', element: Cusine, roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF] },
  // experience
  { path: '/experience-services', name: 'Experience Services', element: ExperienceService, roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER] },
  { path: '/experience-additional-restriction-setting', name: 'Experience Addditional Restriction Setting', element: ExperienceSetting, roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER, UserRole.AMUSEMENT_CENTER_STAFF] },
  { path: '/restriction-informations', name: 'Restriction Informations', element: RestrictionInformation, roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER, UserRole.AMUSEMENT_CENTER_STAFF] },
  { path: '/additional-informations', name: 'Additional Informations', element: AdditionalInformation, roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER, UserRole.AMUSEMENT_CENTER_STAFF] },

  // { path: '/login', name: 'Login', element: Login, roles: [Object.values(UserRole)] },

]

export default routes
