import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const AppNavBar = ({ openAuthModal, user, logoutFunc }) => {
  const router = useNavigate()

  return (
    <Navbar bg="dark" data-bs-theme="dark" fixed="top">
      <Container>
        <Navbar.Brand
          onClick={() => router('/home')}
          style={{ cursor: 'pointer' }}
        >
          Блог
        </Navbar.Brand>

        <Nav className="me-auto align-items-center gap-2">
          {user && (
            <Nav.Link
              as="button"
              className="btn btn-link"
              onClick={() => router('/create-post')}
            >
              Створити публікацію
            </Nav.Link>
          )}
        </Nav>

        <Nav className="ms-auto align-items-center gap-2">
          {user ? (
            <NavDropdown title={user.email} id="navbar-user-dropdown">
              <NavDropdown.Item
                as="button"
                className="btn btn-link"
                onClick={() => router(`/profile/${user.id}`)}
              >
                Профіль
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as="button"
                className="btn btn-link"
                onClick={logoutFunc}
              >
                Вийти
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link
                as="button"
                className="btn btn-link"
                onClick={() => openAuthModal('register')}
              >
                Зареєструватися
              </Nav.Link>
              <Nav.Link
                as="button"
                className="btn btn-link"
                onClick={() => openAuthModal('login')}
              >
                Вхід
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default AppNavBar
