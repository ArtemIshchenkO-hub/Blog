export class UserDto {
  id
  email
  role
  isActivated

  constructor(model) {
    this.id = model.id
    this.email = model.email
    this.role = model.role
    this.isActivated = model.is_activated
  }
}
