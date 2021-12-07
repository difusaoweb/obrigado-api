import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from 'App/Models/Notification'
import User from 'App/Models/User'

export default class NotificationsController {
  public async index() {
    const all = await Notification.all()

    return all
  }

  public async show({ request }: HttpContextContract) {
    const id: number = request.param('id')
    const notification = await Notification.find(id)

    return notification
  }

  public async store({ auth, request }: HttpContextContract) {
    const { title, link } = request.only(['title', 'link'])

    await auth.use('api').authenticate()
    const userId = auth.use('api').user.id

    const notification = await Notification.create({
      userId,
      title,
      link,
    })

    return notification
  }

  public async update({ request }: HttpContextContract) {
    const id: number = request.param('id')
    const theNotification = await Notification.find(id)
    if (!theNotification) {
      return 'Notification not found'
    }

    const { title, link } = request.only(['title', 'link'])

    const notification = await Notification.updateOrCreate(
      { id: id },
      {
        title,
        link,
      }
    )

    return notification
  }

  public async destroy({ request }: HttpContextContract) {
    const id: number = request.param('id')
    const notification = await Notification.find(id)
    if (notification) {
      await notification.delete()
    }
  }
}
