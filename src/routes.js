import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const User = React.lazy(() => import('./views/User/User'))
const Province = React.lazy(() => import('./components/province/Province'))
const District = React.lazy(() => import('./components/district/District'))
const Commune = React.lazy(() => import('./components/commune/Commune'))
const TransportService = React.lazy(() => import('./components/Transport/TransportService'))
const Dietary = React.lazy(() => import('./components/dietary/Dietary'))
const Cusine = React.lazy(() => import('./components/cusine/Cusine'))
const Restaurant = React.lazy(() => import('./components/restaurant/Restaurant'))
const Feature = React.lazy(() => import('./components/feature/Feature'))
const TransportFeatures = React.lazy(() => import('./components/transport-feature/TransportFeature'))
const Room = React.lazy(() => import('./components/room/Room'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '//user-management', name: 'User', element: User },
  // hotel
  { path: '/hotels', name: 'Hotel', element: Dashboard },
  { path: '/rooms', name: 'Room', element: Room },
  { path: '/provinces', name: 'Province', element: Province },
  { path: '/districts', name: 'District', element: District },
  { path: '/communes', name: 'Commune', element: Commune },
  // transport
  { path: '/transport-services', name: 'Transport Service Management', element: TransportService },
  { path: '/features', name: 'Features', element: Feature },
  { path: '/transport-feature', name: 'Transport Features', element: TransportFeatures },
  // restaurant
  { path: '/restaurants', name: 'Restaurants', element: Restaurant },
  { path: '/dietaries', name: 'Dietaries', element: Dietary },
  { path: '/cusines', name: 'Cusines', element: Cusine },
  
]

export default routes
