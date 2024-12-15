import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import PrivateRoute from '../util/PrivateRoute'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    <PrivateRoute
                      element={route.element}
                      roles={route.roles} // Pass the roles to PrivateRoute
                    />
                  }                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default AppContent


// import React, { Suspense } from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import { CContainer, CSpinner } from '@coreui/react'

// // routes config
// import routes from '../routes'
// import PrivateRoute from '../util/PrivateRoute'

// const AppContent = () => {
//   const [route, setRoute] = React.useState(null)
//   const user = JSON.parse(localStorage.getItem('user'))

//   useEffect(() => {
//     if (routes === null) {
//       const filteredRoutes = routes.filter((route) => {
//         if (route.roles) {
//           return route.roles.includes(user.role)
//         }
//         return true
//       })
//       setRoute(filteredRoutes)
//     }
//   }, [user])

//   console.log('route', route);


//   return (
//     <CContainer className="px-4" lg>
//       <Suspense fallback={<CSpinner color="primary" />}>
//         <Routes>
//           {route && route.map((route, idx) => {
//             return (
//               route.element && (
//                 <Route
//                   key={idx}
//                   path={route.path}
//                   exact={route.exact}
//                   name={route.name}
//                   element={
//                     <PrivateRoute
//                       element={route.element}
//                       roles={route.roles} // Pass the roles to PrivateRoute
//                     />
//                   } />
//               )
//             )
//           })}
//           <Route path="/" element={<Navigate to="dashboard" replace />} />
//         </Routes>
//       </Suspense>
//     </CContainer>
//   )
// }

// export default AppContent