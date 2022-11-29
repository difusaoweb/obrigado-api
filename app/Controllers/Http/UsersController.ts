import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'

import User from 'App/Models/User'
import Obrigado from 'App/Models/Obrigado'

export default class UsersController {
  public async profile({ request, response }: HttpContextContract) {
    try {
      const newSchema = schema.create({
        username: schema.string(),
      })
      const { username } = await request.validate({ schema: newSchema })

      const user = await User.findByOrFail('username', username)

      const obrigadosSenders = await user.related('obrigadosSenders').query()
      const obrigadosReceivers = await user.related('obrigadosReceivers').query()

      const obrigadosSendersTotal = obrigadosSenders.reduce((total, item) => {
        return total + item.value
      }, 0)

      const obrigadosReceiversTotal = obrigadosReceivers.reduce((total, item) => {
        return total + item.value
      }, 0)

      const { id, name, avatar, description, link } = user

      response.send({
        success: {
          profile: {
            id,
            name,
            avatar,
            username,
            description,
            link,
            obrigados: obrigadosReceiversTotal - obrigadosSendersTotal,
          },
        },
      })
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

  public async index() {
    return await User.all()
  }

  // public async show({ request }: HttpContextContract) {
  //   const newSchema = schema.create({
  //     id: schema.number(),
  //   })
  //   const requestBody = await request.validate({ schema: newSchema })

  //   const user = await User.findOrFail(requestBody.id)

  //   return user
  // }

  // public async store({ auth, request, response }: HttpContextContract) {
  //   const newSchema = schema.create({
  //     user_login: schema.string(),
  //     user_pass: schema.string(),
  //     user_email: schema.string(),
  //     display_name: schema.string(),
  //   })
  //   const requestBody = await request.validate({ schema: newSchema })

  //   const user = await User.create({
  //     userLogin: requestBody.user_login,
  //     userPass: requestBody.user_pass,
  //     userEmail: requestBody.user_email,
  //     displayName: requestBody.display_name,
  //   })

  //   const obrigadoUser = await User.findByOrFail(
  //     'user_login',
  //     Env.get('BUSINESS_ACCOUNT_USER_NAME')
  //   )

  //   obrigadoUser.obrigados -= 3
  //   user.obrigados += 3

  //   obrigadoUser.save()
  //   user.save()

  //   const obrigado = await Obrigado.create({
  //     senderId: obrigadoUser.id,
  //     receiverId: user.id,
  //     value: 3,
  //     message: 'Muito obrigado por vir para nossa plataforma!',
  //   })

  //   return user
  // }

  // public async update({ request }: HttpContextContract) {
  //   const id: number = request.param('id')
  //   const theUser = await User.find(id)
  //   if (!theUser) {
  //     return 'Usuário não econtrado.'
  //   }

  //   const parms = request.only(['user_login', 'user_pass', 'user_email', 'display_name'])
  //   let userObj = {}

  //   //userLogin
  //   if (parms.user_login) {
  //     if (parms.user_login != theUser.userLogin) {
  //       const searchUserLogin = await User.findBy('user_login', parms.user_login)
  //       if (searchUserLogin) {
  //         return 'userLogin já está em uso.'
  //       }

  //       userObj.userLogin = parms.user_login
  //     }
  //   }
  //   //userLogin

  //   //userEmail
  //   if (parms.user_email) {
  //     if (parms.user_email != theUser.userEmail) {
  //       const searchUserEmail = await User.findBy('user_email', parms.user_email)
  //       if (searchUserEmail) {
  //         return 'userEmail já está em uso.'
  //       }

  //       userObj.userEmail = parms.user_email
  //     }
  //   }
  //   //userEmail

  //   if (parms.display_name) {
  //     userObj.displayName = parms.display_name
  //   }

  //   if (parms.user_pass) {
  //     userObj.userPass = parms.user_pass
  //   }

  //   const user = await User.updateOrCreate({ id: id }, userObj)

  //   return user
  // }

  // public async destroy({ request }: HttpContextContract) {
  //   const id: number = request.param('id')
  //   const user = await User.find(id)
  //   if (user) {
  //     await user.delete()
  //   }
  // }
}
