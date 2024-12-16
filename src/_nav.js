import {
  cilBuilding,
  cilCarAlt,
  cilMap,
  cilMoney,
  cilRestaurant,
  cilSpeedometer,
  cilStar,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import React from 'react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavItem,
    name: 'Booking Management',
    to: '/booking-management',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'User Management',
    to: '/user-management',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Hotel Management',
    to: '/hotel-management',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Hotels',
        to: '/hotels',
      },
      {
        component: CNavItem,
        name: 'Rooms',
        to: '/rooms',
      },
      {
        component: CNavItem,
        name: 'Amenities',
        to: '/amenities',
      },
      {
        component: CNavItem,
        name: 'Hotel Amenities',
        to: '/hotel-amenities',
      },
      {
        component: CNavItem,
        name: 'Provinces',
        to: '/provinces',
      },
      {
        component: CNavItem,
        name: 'Districts',
        to: '/districts',
      },
      {
        component: CNavItem,
        name: 'Communes',
        to: '/communes',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Transport Service Management',
    to: '/transport-service-management',
    icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Transport Services',
        to: '/transport-services',
      },
      {
        component: CNavItem,
        name: 'Features',
        to: '/features',
      },
      {
        component: CNavItem,
        name: 'Transport Features',
        to: '/transport-feature',
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Experiences Management',
    to: '/experiences-management',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Experience Services',
        to: '/experience-services',
      },
      {
        component: CNavItem,
        name: 'Experience Addditional Restriction Setting',
        to: '/experience-additional-restriction-setting',
      },
      {
        component: CNavItem,
        name: 'Additional Informations',
        to: '/additional-informations',
      },
      {
        component: CNavItem,
        name: 'Restriction Informations',
        to: '/restriction-informations',
      },
    ]
  },
  {
    component: CNavGroup,
    name: 'Restaurant Management',
    to: '/restaurant-management',
    icon: <CIcon icon={cilRestaurant} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Restaurants',
        to: '/restaurants',
      },
      {
        component: CNavItem,
        name: 'Restaurant Dietaries Options',
        to: '/restaurant-dietaries',
      },
      {
        component: CNavItem,
        name: 'Dietaries',
        to: '/dietaries',
      },
      {
        component: CNavItem,
        name: 'Table',
        to: '/tables',
      },
      {
        component: CNavItem,
        name: 'Cuisines',
        to: '/cusines',
      },
    ]
  },
]

export default _nav

// import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
// import React from 'react'
// import CIcon from '@coreui/icons-react'
// import { cilSpeedometer } from '@coreui/icons'
// import { UserRole } from './util/Enum' // Adjust the import path as needed

// const _nav = [
//   {
//     component: CNavItem,
//     name: 'Dashboard',
//     to: '/dashboard',
//     icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
//     badge: {
//       color: 'info',
//       text: 'NEW',
//     },
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavTitle,
//     name: 'Management',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavItem,
//     name: 'Booking Management',
//     to: '/booking-management',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavItem,
//     name: 'User Management',
//     to: '/user-management',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavGroup,
//     name: 'Hotel',
//     to: '/hotels',
//     roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER],
//     items: [
//       {
//         component: CNavItem,
//         name: 'Rooms',
//         to: '/rooms',
//         roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER, UserRole.HOTEL_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Amenities',
//         to: '/amenities',
//         roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER, UserRole.HOTEL_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Hotel Amenities',
//         to: '/hotel-amenities',
//         roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER, UserRole.HOTEL_STAFF],
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Province',
//     to: '/provinces',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavItem,
//     name: 'District',
//     to: '/districts',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavItem,
//     name: 'Commune',
//     to: '/communes',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavGroup,
//     name: 'Transport',
//     to: '/transport-services',
//     roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER],
//     items: [
//       {
//         component: CNavItem,
//         name: 'Transport Service Management',
//         to: '/transport-services',
//         roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER],
//       },
//       {
//         component: CNavItem,
//         name: 'Features',
//         to: '/features',
//         roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER],
//       },
//       {
//         component: CNavItem,
//         name: 'Transport Features',
//         to: '/transport-feature',
//         roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER, UserRole.TRANSPORT_SERVICE_STAFF],
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Restaurant',
//     to: '/restaurants',
//     roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER],
//     items: [
//       {
//         component: CNavItem,
//         name: 'Restaurant Dietarie Options',
//         to: '/restaurant-dietaries',
//         roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Dietaries',
//         to: '/dietaries',
//         roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Tables',
//         to: '/tables',
//         roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Cusines',
//         to: '/cusines',
//         roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF],
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Experience',
//     to: '/experience-services',
//     roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER],
//     items: [
//       {
//         component: CNavItem,
//         name: 'Experience Services',
//         to: '/experience-services',
//         roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER],
//       },
//       {
//         component: CNavItem,
//         name: 'Experience Addditional Restriction Setting',
//         to: '/experience-additional-restriction-setting',
//         roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER, UserRole.AMUSEMENT_CENTER_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Restriction Informations',
//         to: '/restriction-informations',
//         roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER, UserRole.AMUSEMENT_CENTER_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Additional Informations',
//         to: '/additional-informations',
//         roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER, UserRole.AMUSEMENT_CENTER_STAFF],
//       },
//     ],
//   },
// ]

// const user = localStorage.getItem('user')

// const filteredNav = _nav.filter(item => {
//   if (item.roles && item.roles.length > 0) {
//     if(item.roles.includes(user?.role)) {
//       console.log();
      
//       return item;
//     }
//   }
//   // if (item.items) {
//   //   item.items = item.items.filter(subItem => subItem.roles.includes(user?.role))
//   //   return item.items.length > 0
//   // }
//   // return true
// })

// export default filteredNav

// // Import necessary components and icons
// import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
// import React from 'react'
// import CIcon from '@coreui/icons-react'
// import { cilSpeedometer } from '@coreui/icons'
// import { UserRole } from './util/Enum' // Adjust the import path as needed

// // Define the navigation configuration
// const _nav = [
//   {
//     component: CNavItem,
//     name: 'Dashboard',
//     to: '/dashboard',
//     icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
//     badge: {
//       color: 'info',
//       text: 'NEW',
//     },
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavTitle,
//     name: 'Management',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavItem,
//     name: 'Booking Management',
//     to: '/booking-management',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavItem,
//     name: 'User Management',
//     to: '/user-management',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavGroup,
//     name: 'Hotel',
//     to: '/hotels',
//     roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER],
//     items: [
//       {
//         component: CNavItem,
//         name: 'Rooms',
//         to: '/rooms',
//         roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER, UserRole.HOTEL_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Amenities',
//         to: '/amenities',
//         roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER, UserRole.HOTEL_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Hotel Amenities',
//         to: '/hotel-amenities',
//         roles: [UserRole.ADMINISTRATOR, UserRole.HOTEL_MANAGER, UserRole.HOTEL_STAFF],
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Province',
//     to: '/provinces',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavItem,
//     name: 'District',
//     to: '/districts',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavItem,
//     name: 'Commune',
//     to: '/communes',
//     roles: [UserRole.ADMINISTRATOR],
//   },
//   {
//     component: CNavGroup,
//     name: 'Transport',
//     to: '/transport-services',
//     roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER],
//     items: [
//       {
//         component: CNavItem,
//         name: 'Transport Service Management',
//         to: '/transport-services',
//         roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER],
//       },
//       {
//         component: CNavItem,
//         name: 'Features',
//         to: '/features',
//         roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER],
//       },
//       {
//         component: CNavItem,
//         name: 'Transport Features',
//         to: '/transport-feature',
//         roles: [UserRole.ADMINISTRATOR, UserRole.TRANSPORT_MANAGER, UserRole.TRANSPORT_SERVICE_STAFF],
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Restaurant',
//     to: '/restaurants',
//     roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER],
//     items: [
//       {
//         component: CNavItem,
//         name: 'Restaurant Dietarie Options',
//         to: '/restaurant-dietaries',
//         roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Dietaries',
//         to: '/dietaries',
//         roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Tables',
//         to: '/tables',
//         roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Cusines',
//         to: '/cusines',
//         roles: [UserRole.ADMINISTRATOR, UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF],
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Experience',
//     to: '/experience-services',
//     roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER],
//     items: [
//       {
//         component: CNavItem,
//         name: 'Experience Services',
//         to: '/experience-services',
//         roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER],
//       },
//       {
//         component: CNavItem,
//         name: 'Experience Addditional Restriction Setting',
//         to: '/experience-additional-restriction-setting',
//         roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER, UserRole.AMUSEMENT_CENTER_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Restriction Informations',
//         to: '/restriction-informations',
//         roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER, UserRole.AMUSEMENT_CENTER_STAFF],
//       },
//       {
//         component: CNavItem,
//         name: 'Additional Informations',
//         to: '/additional-informations',
//         roles: [UserRole.ADMINISTRATOR, UserRole.AMUSEMENT_CENTER_MANAGER, UserRole.AMUSEMENT_CENTER_STAFF],
//       },
//     ],
//   },
// ]

// // Parse the user information from localStorage
// const user = JSON.parse(localStorage.getItem('user')) || {} // Parse user and handle missing cases

// // Function to filter navigation items based on roles
// const filterNavItems = (items) => {
//   return items
//     .map((item) => {
//       // Filter out items the user doesn't have access to
//       if (item.roles && !item.roles.includes(user?.role)) {
//         return null;
//       }

//       // If the item has nested items, filter them recursively
//       if (item.items) {
//         const filteredItems = filterNavItems(item.items);
//         if (filteredItems.length > 0) {
//           return { ...item, items: filteredItems }; // Return the item with filtered children
//         }
//         return null; // Exclude group if no children remain
//       }

//       return item; // Include item if it passes the filter
//     })
//     .filter(Boolean); // Remove null values
// };

// // Filter navigation items based on the user's role
// const filteredNav = filterNavItems(_nav);

// // Export the filtered navigation configuration
// export default filteredNav;
