import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index() {
    const all = await User.all()

    return all
  }

  public async show({ request }: HttpContextContract) {
    const id: number = request.param('id')
    const user = await User.find(id)

    return user
  }

  public async store({ request }: HttpContextContract) {
    const { userLogin, userPass, userEmail, displayName } = request.only([
      'user_login',
      'user_pass',
      'user_email',
      'display_name',
    ])

    const user = await User.create({
      user_login: userLogin,
      user_pass: userPass,
      user_email: userEmail,
      display_name: displayName,
    })

    return user
  }

  public async update({ request }: HttpContextContract) {
    const id: number = request.param('id')
    const theUser = await User.find(id)
    if (!theUser) {
      return 'Usuario não econtrado'
    }

    const { userLogin, userPass, userEmail, displayName } = request.only([
      'user_login',
      'user_pass',
      'user_email',
      'display_name',
    ])

    const user = await User.updateOrCreate(
      { id: id },
      {
        user_login: userLogin,
        user_pass: userPass,
        user_email: userEmail,
        display_name: displayName,
      }
    )

    return user
  }

  public async destroy({ request }: HttpContextContract) {
    const id: number = request.param('id')
    const user = await User.find(id)
    if (user) {
      await user.delete()
    }
  }
}
