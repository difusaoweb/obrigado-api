import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index() {
    const all = await User.all()

    return all
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.only(id)
    const all = await User.findBy('id')

    return all
  }

  public async store({ request }: HttpContextContract) {
    const { user_login, user_pass, user_email, display_name } = request.only([
      'user_login',
      'user_pass',
      'user_email',
      'display_name',
    ])

    const user = await User.create({
      user_login,
      user_pass,
      user_email,
      display_name,
    })

    return user
  }

  public async update() {
    return 'Update user'
  }

  public async destroy() {
    return 'Remove user'
  }
}
