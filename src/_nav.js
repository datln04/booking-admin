import {
  cilBuilding,
  cilCarAlt,
  cilMap,
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
    component: CNavItem,
    name: 'Experiences Management',
    to: '/experiences-management',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
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
        name: 'Dietaries',
        to: '/dietaries',
      },
      {
        component: CNavItem,
        name: 'Cusines',
        to: '/cusines',
      },
    ]
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
]

export default _nav
