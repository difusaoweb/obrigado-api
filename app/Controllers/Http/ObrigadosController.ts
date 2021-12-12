import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Obrigado from 'App/Models/Obrigado'
import User from 'App/Models/User'

export default class ObrigadosController {
  public async index() {
    const all = await Obrigado.all()

    return all
  }

  public async show({ request }: HttpContextContract) {
    const id: number = request.param('id')
    const obrigado = await Obrigado.findOrFail(id)

    return obrigado
  }

  public async store({ auth, request, response }: HttpContextContract) {
    /**
     * Schema definition
     */
    const newSchema = schema.create({
      receiver_id: schema.number(),
      value: schema.number(),
    })

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate({ schema: newSchema })

    await auth.use('api').authenticate()
    const currentUserId: number = auth.use('api').user.id

    const currentUser = await User.find(currentUserId)
    if (!currentUser) {
      return response.notFound('Usuário não econtrado.')
    }

    const receiverUser = await User.find(payload.receiver_id)
    if (!receiverUser) {
      return response.notFound('Usuário não econtrado.')
    }

    // const updateOrCreateManyObj = [
    //   { id: currentUser.id, obrigados: (currentUser.obrigados -= payload.value) },
    //   { id: receiverUser.id, obrigados: (receiverUser.obrigados += payload.value) },
    // ]

    // const users = await User.updateOrCreateMany('id', updateOrCreateManyObj)
    // if (!users) {
    //   return response.notFound('Usuários não atualizados.')
    // }
    currentUser.obrigados -= payload.value
    receiverUser.obrigados += payload.value

    currentUser.save()
    receiverUser.save()

    // const obrigado = await Obrigado.create({
    //   senderId: currentUserId,
    //   receiverId: receiverUser.id,
    //   value: payload.value,
    // })

    // return obrigado
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    const id: number = request.param('id')

    const obrigado = await Obrigado.find(id)
    if (!obrigado) {
      return response.notFound('Obrigado não econtrado')
    }

    await auth.use('api').authenticate()
    const userId: number = auth.use('api').user.id

    if (obrigado.senderId != userId) {
      return response.unauthorized('Você não é o remetente')
    }

    await obrigado.delete()
  }
}
