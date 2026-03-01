export class AppError extends Error {
  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static unauthorized() {
    return new AppError(401, 'Користувач не авторизований')
  }

  static badRequest(message, errors) {
    return new AppError(400, message, errors)
  }

  static internal(message, errors = []) {
    return new AppError(500, message, errors)
  }

  static forbidden(message, errors = []) {
    return new AppError(403, message, errors)
  }

  static notFound(message, errors = []) {
    return new AppError(404, message, errors)
  }
}
