import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const User = React.lazy(() => import('./views/user/User'))
const Hotel = React.lazy(() => import('./views/hotel/Hotel'))
const Province = React.lazy(() => import('./components/province/Province'))
const District = React.lazy(() => import('./components/district/District'))
const Commune = React.lazy(() => import('./components/commune/Commune'))
const Amenity = React.lazy(() => import('./components/amenity/Amenity'))
const HotelAmenity = React.lazy(() => import('./components/hotel-amenity/HotelAmenity'))
const TransportService = React.lazy(() => import('./components/Transport/TransportService'))
const Dietary = React.lazy(() => import('./components/dietary/Dietary'))
const Cusine = React.lazy(() => import('./components/cusine/Cusine'))
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
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/user-management', name: 'User', element: User },
  // hotel
  { path: '/hotels', name: 'Hotel', element: Hotel },
  { path: '/rooms', name: 'Room', element: Room },
  { path: '/amenities', name: 'Amenity', element: Amenity },
  { path: '/hotel-amenities', name: 'Hotel Amenities', element: HotelAmenity },
  { path: '/provinces', name: 'Province', element: Province },
  { path: '/districts', name: 'District', element: District },
  { path: '/communes', name: 'Commune', element: Commune },
  // transport
  { path: '/transport-services', name: 'Transport Service Management', element: TransportService },
  { path: '/features', name: 'Features', element: Feature },
  { path: '/transport-feature', name: 'Transport Features', element: TransportFeatures },
  // restaurant
  { path: '/restaurants', name: 'Restaurants', element: Restaurant },
  { path: '/restaurant-dietaries', name: 'Restaurant Dietarie Options', element: RestaurantDietaries },
  { path: '/dietaries', name: 'Dietaries', element: Dietary },
  { path: '/cusines', name: 'Cusines', element: Cusine },
  // experience
  { path: '/experience-services', name: 'Experience Services', element: ExperienceService },
  { path: '/experience-additional-restriction-setting', name: 'Experience Addditional Restriction Setting', element: ExperienceSetting },
  { path: '/restriction-informations', name: 'Restriction Informations', element: RestrictionInformation },
  { path: '/additional-informations', name: 'Additional Informations', element: AdditionalInformation },
]

export default routes
