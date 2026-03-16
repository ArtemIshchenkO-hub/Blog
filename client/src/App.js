import AppNavBar from './components/UI/AppNavbar.js'
import { useEffect } from 'react'
import AuthModal from './components/UI/modals/AuthModal.js'
import { useAuthModal } from './hooks/useAuthModal.js'
import { useAuth } from './hooks/useAuth.js'
import { observer } from 'mobx-react-lite'
import AppRouter from './components/AppRouter.js'
import { BrowserRouter } from 'react-router-dom'

const App = observer(() => {
  const modalStore = useAuthModal()
  const userStore = useAuth()

  useEffect(() => {
    userStore.checkAuth()
  }, [userStore])

  return (
    <>
      <BrowserRouter>
        <AppNavBar
          openAuthModal={modalStore.openAuthModal}
          user={userStore.user}
          logoutFunc={userStore.logout}
        />
        <main style={{ paddingTop: '70px' }}>
          <AppRouter />
        </main>
      </BrowserRouter>
      <AuthModal
        show={modalStore.isAuthModalOpen}
        mode={modalStore.authMode}
        onHide={modalStore.closeAuthModal}
        modeChange={modalStore.setAuthMode}
      />
    </>
  )
})

export default App
