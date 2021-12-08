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
      userLogin,
      userPass,
      userEmail,
      displayName,
    })

    return user
  }

  public async update({ request }: HttpContextContract) {
    const id: number = request.param('id')
    const theUser = await User.find(id)
    if (!theUser) {
      return 'Usuário não econtrado.'
    }

    const parms = request.only(['user_login', 'user_pass', 'user_email', 'display_name'])
    let userObj = {}

    //userLogin
    if (parms.user_login) {
      if (parms.user_login != theUser.userLogin) {
        const searchUserLogin = await User.findBy('user_login', parms.user_login)
        if (searchUserLogin) {
          return 'userLogin já está em uso.'
        }

        userObj.userLogin = parms.user_login
      }
    }
    //userLogin

    //userEmail
    if (parms.user_email) {
      if (parms.user_email != theUser.userEmail) {
        const searchUserEmail = await User.findBy('user_email', parms.user_email)
        if (searchUserEmail) {
          return 'userEmail já está em uso.'
        }

        userObj.userEmail = parms.user_email
      }
    }
    //userEmail

    if (parms.display_name) {
      userObj.displayName = parms.display_name
    }

    if (parms.user_pass) {
      userObj.userPass = parms.user_pass
    }

    const user = await User.updateOrCreate({ id: id }, userObj)

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
