import { Routes, Route, Navigate } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { privateRoutes, publicRoutes } from '../router/routes'
import { useAuth } from '../hooks/useAuth'
import { observer } from 'mobx-react-lite'

const AppRouter = observer(() => {
  const userStore = useAuth()

  if (!userStore.authChecked) {
    return <Spinner animation="grow" />
  }

  return (
    <Routes>
      {publicRoutes.map((route) => {
        const Component = route.component
        return (
          <Route key={route.path} path={route.path} element={<Component />} />
        )
      })}

      {userStore.isAuth &&
        privateRoutes.map((route) => {
          const Component = route.component
          return (
            <Route key={route.path} path={route.path} element={<Component />} />
          )
        })}

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
})

export default AppRouter
