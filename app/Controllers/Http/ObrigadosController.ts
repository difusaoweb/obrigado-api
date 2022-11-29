import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

import Obrigado from 'App/Models/Obrigado'
import User from 'App/Models/User'

export default class ObrigadosController {
  public async home({ auth, request, response }: HttpContextContract) {
    try {
      const controllerSchema = schema.create({
        page: schema.number(),
        perPage: schema.number(),
      })
      const { page, perPage } = await request.validate({ schema: controllerSchema })

      const thePerPage: number = perPage === -1 ? 9999999999999999 : perPage

      let currentUserId: number | null = null
      if (await auth.check()) {
        currentUserId = auth.use('api').user.id
      }
      console.log({ currentUserId })

      const responseDb = await Database.from('obrigado_user')
        .join('obrigados', 'obrigado_user.obrigado_id', '=', 'obrigados.id')
        .join('users', 'obrigado_user.sender_id', '=', 'users.id')
        .select(
          'obrigados.id as obrigadoId',
          'users.avatar',
          'obrigado_user.sender_id as senderId',
          'users.name',
          'users.username',
          'obrigados.created_at as date',
          'obrigados.value',
          'obrigados.message',
          'obrigado_user.receiver_id as receiverId'
        )
        .orderBy('obrigados.created_at', 'desc')
        .paginate(page, thePerPage)

      if (responseDb.length === 0) {
        response.send({ failure: { message: 'Obrigados not found.' } })
        response.status(404)
        return response
      }

      response.send({
        success: {
          obrigados: responseDb.all(),
          lastPage: responseDb.lastPage,
          total: responseDb.total,
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

  public async profile({ request, response }: HttpContextContract) {
    try {
      const controllerSchema = schema.create({
        id: schema.number(),
        page: schema.number(),
        perPage: schema.number(),
      })
      const { id, page, perPage: thePerPage } = await request.validate({ schema: controllerSchema })

      const perPage: number = thePerPage === -1 ? 9999999999999999 : thePerPage

      const { id: userId } = await User.findOrFail(id)

      const responseDb = await Database.rawQuery(
        `select
          max(:dBObrigadoId:) as :obrigadoId:,
          max(:dBObrigadoValue:) as :obrigadoValue:,
          max(:dBObrigadoMessage:) as :obrigadoMessage:,
          max(:dBObrigadoDate:) as :obrigadoDate:,
          max(:dBSenderId:) as :senderId:,
          max(:dBSenderUsername:) as :senderUsername:,
          max(:dBSenderName:) as :senderName:,
          max(:dBSenderAvatar:) as :senderAvatar:,
          max(:dBReceiverId:) as :receiverId:,
          max(:dBReceiverUsername:) as :receiverUsername:,
          max(:dBReceiverName:) as :receiverName:,
          max(:dBReceiverAvatar:) as :receiverAvatar:
        from
          (
            select
              obrigados.id as :obrigadoId:,
              obrigados.value as :obrigadoValue:,
              obrigados.message as :obrigadoMessage:,
              obrigados.created_at as :obrigadoDate:,
              obrigado_user.sender_id as :senderId:,
              case
                when users.id = obrigado_user.sender_id then users.username
                else null
              end as :senderUsername:,
              case
                when users.id = obrigado_user.sender_id then users.name
                else null
              end as :senderName:,
              case
                when users.id = obrigado_user.sender_id then users.avatar
                else null
              end as :senderAvatar:,
              obrigado_user.receiver_id as :receiverId:,
              case
                when users.id = obrigado_user.receiver_id then users.username
                else null
              end as :receiverUsername:,
              case
                when users.id = obrigado_user.receiver_id then users.name
                else null
              end as :receiverName:,
              case
                when users.id = obrigado_user.receiver_id then users.avatar
                else null
              end as :receiverAvatar:
            from
              obrigado_user
              inner join obrigados on obrigado_user.obrigado_id = obrigados.id
              inner join users on users.id = obrigado_user.sender_id
              or users.id = obrigado_user.receiver_id
            where
              obrigado_user.sender_id = :userId:
              or obrigado_user.receiver_id = :userId:
          ) as db
        group by
          :dBObrigadoId:
        order by
          max(:dBObrigadoDate:) desc
        limit :perPage:
        offset :offset:`,
        {
          dBObrigadoId: 'db.obrigadoId',
          dBObrigadoValue: 'db.obrigadoValue',
          dBObrigadoMessage: 'db.obrigadoMessage',
          dBObrigadoDate: 'db.obrigadoDate',
          dBSenderId: 'db.senderId',
          dBSenderUsername: 'db.senderUsername',
          dBSenderName: 'db.senderName',
          dBSenderAvatar: 'db.senderAvatar',
          dBReceiverId: 'db.receiverId',
          dBReceiverUsername: 'db.receiverUsername',
          dBReceiverName: 'db.receiverName',
          dBReceiverAvatar: 'db.receiverAvatar',

          obrigadoId: 'obrigadoId',
          obrigadoValue: 'obrigadoValue',
          obrigadoMessage: 'obrigadoMessage',
          obrigadoDate: 'obrigadoDate',
          senderId: 'senderId',
          senderUsername: 'senderUsername',
          senderName: 'senderName',
          senderAvatar: 'senderAvatar',
          receiverId: 'receiverId',
          receiverUsername: 'receiverUsername',
          receiverName: 'receiverName',
          receiverAvatar: 'receiverAvatar',
          userId,
          perPage,
          offset: perPage * (page - 1),
        }
      )

      if (responseDb.length === 0) {
        response.send({ failure: { message: 'Obrigados not found.' } })
        response.status(404)
        return response
      }

      response.send({
        success: {
          obrigados: responseDb.rows,
          total: responseDb.rowCount,
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
          response.send({ failure: { message: 'User not found.' } })
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

  public async transfer({ auth, request, response }: HttpContextContract) {
    try {
      const newSchema = schema.create({
        obrigados: schema.number(),
        receiverId: schema.number(),
        message: schema.string.optional(),
      })
      const { obrigados, receiverId, message } = await request.validate({ schema: newSchema })

      await auth.use('api').authenticate()
      const currentUserId: number = auth.use('api').user.id

      const senderUser = await User.findOrFail(currentUserId)
      const receiverUser = await User.findOrFail(receiverId)

      const obrigado = await Obrigado.create({
        value: obrigados,
        message,
      })

      const createdAt = DateTime.now()
      await senderUser.related('obrigadosSenders').attach({
        [obrigado.id]: {
          receiver_id: receiverUser.id,
          created_at: createdAt,
        },
      })

      response.send({
        success: true,
      })
      response.status(200)
      return response
    } catch (err) {
      console.log(err)
      switch (err?.code) {
        case 'E_ROW_NOT_FOUND':
          response.send({ failure: { message: 'User not found.' } })
          response.status(404)
          break
        case 'E_VALIDATION_FAILURE':
          response.send({ failure: { message: 'Invalid parameters.' } })
          response.status(400)
          break
        default:
          response.send({ failure: { message: 'Error get profile.' } })
          response.status(500)
          break
      }
      return response
    }
  }

  public async show({ auth, request, response }: HttpContextContract) {
    try {
      const controllerSchema = schema.create({
        obrigadoId: schema.number(),
        username: schema.string(),
      })
      const { obrigadoId, username } = await request.validate({ schema: controllerSchema })

      const theObrigado = await Obrigado.findOrFail(obrigadoId)
      const theSender = await theObrigado.related('sender').query()

      if (theSender[0].username !== username) {
        throw new Error('USER_IS_NOT_THE_SENDER_OR_NOT_FOUND')
      }

      const obrigado = {
        id: theObrigado.id,
        value: theObrigado.value,
        message: theObrigado.message,
        date: theObrigado.createdAt,
      }

      const sender = {
        username: theSender[0].username,
        name: theSender[0].name,
        avatar: theSender[0].avatar,
      }

      response.send({
        success: {
          obrigado,
          sender,
        },
      })
      response.status(200)
      return response
    } catch (err) {
      console.log(err)
      switch (err?.code) {
        case 'E_ROW_NOT_FOUND':
          response.send({ failure: { message: 'User not found.' } })
          response.status(404)
          break
        case 'E_VALIDATION_FAILURE':
          response.send({ failure: { message: 'Invalid parameters.' } })
          response.status(400)
          break
        default:
          response.send({ failure: { message: 'Error get profile.' } })
          response.status(500)
          break
      }
      switch (err?.message) {
        case 'USER_IS_NOT_THE_SENDER_OR_NOT_FOUND':
          response.send({ failure: { message: 'User is not the sender or not found.' } })
          response.status(403)
          break
      }
      return response
    }
  }

  public async index() {
    const all = await Obrigado.all()

    return all
  }

  // public async store({ auth, request, response }: HttpContextContract) {
  //   const newSchema = schema.create({
  //     receiver_id: schema.number(),
  //     value: schema.number(),
  //     message: schema.string(),
  //   })
  //   const requestBody = await request.validate({ schema: newSchema })

  //   await auth.use('api').authenticate()
  //   const currentUserId: number = auth.use('api').user.id
  //   const currentUser = await User.find(currentUserId)
  //   if (!currentUser) {
  //     return response.notFound('Usuário não econtrado.')
  //   }

  //   const receiverUser = await User.find(requestBody.receiver_id)
  //   if (!receiverUser) {
  //     return response.notFound('Usuário não econtrado.')
  //   }

  //   currentUser.amount -= requestBody.value
  //   receiverUser.amount += requestBody.value

  //   currentUser.save()
  //   receiverUser.save()

  //   const obrigado = await Obrigado.create({
  //     senderId: currentUserId,
  //     receiverId: receiverUser.id,
  //     value: requestBody.value,
  //     message: requestBody.message,
  //   })

  //   return obrigado
  // }

  // public async destroy({ auth, request, response }: HttpContextContract) {
  //   const obrigadoId: number = request.param('id')
  //   const obrigado = await Obrigado.find(obrigadoId)
  //   if (!obrigado) {
  //     return response.notFound('Obrigado não econtrado')
  //   }

  //   await auth.use('api').authenticate()
  //   const currentUserId: number = auth.use('api').user.id

  //   if (obrigado.senderId != currentUserId) {
  //     return response.unauthorized('Você não é o remetente')
  //   }

  //   const currentUser = await User.find(currentUserId)
  //   if (!currentUser) {
  //     return response.notFound('Usuário não econtrado.')
  //   }

  //   const receiverUser = await User.find(obrigado.receiverId)
  //   if (!receiverUser) {
  //     return response.notFound('Usuário não econtrado.')
  //   }

  //   currentUser.amount += obrigado.value
  //   receiverUser.amount -= obrigado.value

  //   currentUser.save()
  //   receiverUser.save()

  //   await obrigado.delete()
  // }
}
