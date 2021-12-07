import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class SessionsController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('user_email')
    const password = request.input('user_pass')

    // Lookup user manually
    const user = await User.query().where('user_email', email).firstOrFail()

    // Verify password
    if (!(await Hash.verify(user.userPass, password))) {
      return response.badRequest('Invalid password')
    }

    // Generate token
    const token = await auth.use('api').generate(user, {
      name: user?.serialize().displayName,
      expiresIn: '7days',
    })

    return token
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      revoked: true,
    }
  }
}
