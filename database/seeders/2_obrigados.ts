import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Obrigado from 'App/Models/Obrigado'

export default class ObrigadoSeeder extends BaseSeeder {
  public async run() {
    await Obrigado.createMany([
      {
        value: 5,
        message: 'Obrigado pela comida!',
      },
      {
        value: 6,
        message: null,
      },
    ])
  }
}
