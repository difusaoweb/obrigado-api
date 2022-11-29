import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { DateTime } from 'luxon'

import User from 'App/Models/User'
import Obrigado from 'App/Models/Obrigado'

export default class ObrigadoUserSeeder extends BaseSeeder {
  public async run() {
    const arrayIds = [
      { sender_id: 1, receiver_id: 2 },
      { sender_id: 2, receiver_id: 1 },
    ]
    await Promise.all(
      arrayIds.map(async ({ sender_id, receiver_id }) => {
        const user = await User.find(sender_id)
        const obrigado = await Obrigado.find(sender_id)
        if (user !== null && obrigado !== null) {
          const created_at = DateTime.now()

          await user.related('obrigadosSenders').attach({
            [obrigado.id]: {
              receiver_id,
              created_at,
            },
          })
        }
      })
    )
  }
}
