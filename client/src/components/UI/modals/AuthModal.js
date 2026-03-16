import { useEffect, useState } from 'react'
import { Form, Modal, Button, Spinner, Alert } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { useAuth } from '../../../hooks/useAuth'
import { AUTH_MODAL_CONFIG } from '../../../consts/authModalConfig'

const AuthModal = observer(({ show, onHide, mode = 'login', modeChange }) => {
  const userStore = useAuth()

  const currentMode = mode === 'register' ? 'register' : 'login'
  const { title, submitText, switchText, switchButtonText, nextMode } =
    AUTH_MODAL_CONFIG[currentMode]

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!show) return
    userStore.clearError()
  }, [show, currentMode, userStore])

  const resetForm = () => {
    setEmail('')
    setPassword('')
  }

  const handleClose = () => {
    resetForm()
    userStore.clearError()
    onHide()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (userStore.loading) return

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      userStore.setError('Введіть email і пароль')
      return
    }

    const action =
      currentMode === 'login' ? userStore.login : userStore.register

    try {
      await action(trimmedEmail, trimmedPassword)
      handleClose()
    } catch {}
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div
          style={{
            maxHeight: userStore.error ? 200 : 0,
            opacity: userStore.error ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 200ms ease, opacity 200ms ease',
            marginBottom: userStore.error ? 12 : 0,
          }}
        >
          <Alert variant="danger" className="mb-0 py-2">
            {userStore.error || ' '}
          </Alert>
        </div>

        <Form id="authForm" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="authEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введіть email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="authPassword">
            <Form.Label>Пароль:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Form>

        <div className="mt-2">
          <small className="text-muted">
            {switchText}{' '}
            <Button
              variant="link"
              className="p-0 align-baseline"
              onClick={() => modeChange(nextMode)}
            >
              {switchButtonText}
            </Button>
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={userStore.loading}
        >
          Закрити
        </Button>

        <Button
          variant="primary"
          disabled={userStore.loading}
          form="authForm"
          type="submit"
        >
          {userStore.loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Обробка...
            </>
          ) : (
            submitText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default AuthModal
