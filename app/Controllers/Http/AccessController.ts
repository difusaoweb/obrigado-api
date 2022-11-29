import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'

import Obrigado from 'App/Models/Obrigado'
import User from 'App/Models/User'

export default class AccessController {
  public async checkAuthentication({ auth, request, response }: HttpContextContract) {
    try {
      await auth.use('api').authenticate()

      response.send({ success: { loggedOff: true } })
      response.status(200)
      return response
    } catch (err) {
      console.log(err)
      switch (err?.code) {
        case 'E_VALIDATION_FAILURE':
          response.send({ failure: { message: 'Invalid parameters.' } })
          response.status(400)
          break
        case 'E_ROW_NOT_FOUND':
          response.send({ failure: { message: 'Profile not found.' } })
          response.status(404)
          break
        default:
          response.send({ failure: { message: 'Error get profile.' } })
          response.status(500)
          break
      }
      return response
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const newSchema = schema.create({
        login: schema.string(),
        password: schema.string(),
      })
      const { login, password } = await request.validate({ schema: newSchema })

      const responseDb = await Database.from('users')
        .select('id')
        .where('email', login)
        .orWhere('username', login)

      if (responseDb.length === 0) {
        response.send({ failure: { message: 'User not found.' } })
        response.status(404)
        return response
      }

      const user = await User.findOrFail(responseDb[0].id)

      if (!(await Hash.verify(user.password, password))) {
        response.send({ failure: { message: 'Incorrect password.' } })
        response.status(403)
        return response
      }

      const { token } = await auth.use('api').generate(user, {
        name: 'login',
        expiresIn: '7days',
      })

      const returnResponse = {
        token,
        userId: user.id,
      }

      response.send({ success: returnResponse })
      response.status(200)
      return response
    } catch (err) {
      console.log(err)
      switch (err?.code) {
        default:
          response.send({ failure: { message: 'Error when sign in.' } })
          response.status(500)
          break
      }
      return response
    }
  }

  public async logout({ auth, request, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()

      response.send({ success: { loggedOff: true } })
      response.status(200)
      return response
    } catch (err) {
      console.log(err)
      switch (err?.code) {
        case 'E_VALIDATION_FAILURE':
          response.send({ failure: { message: 'Invalid parameters.' } })
          response.status(400)
          break
        case 'E_ROW_NOT_FOUND':
          response.send({ failure: { message: 'Profile not found.' } })
          response.status(404)
          break
        default:
          response.send({ failure: { message: 'Error get profile.' } })
          response.status(500)
          break
      }
      return response
    }
  }
}
