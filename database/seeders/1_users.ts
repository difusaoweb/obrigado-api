import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: Env.get('BUSINESS_ACCOUNT_EMAIL'),
        username: Env.get('BUSINESS_ACCOUNT_USERNAME'),
        password: Env.get('BUSINESS_ACCOUNT_PASSWORD'),
        name: Env.get('BUSINESS_ACCOUNT_NAME'),
        avatar: Env.get('BUSINESS_ACCOUNT_AVATAR'),
        description: Env.get('BUSINESS_ACCOUNT_DESCRIPTION'),
        link: Env.get('BUSINESS_ACCOUNT_LINK'),
      },
      {
        email: 'pazwiatagan@gmail.com',
        username: 'wiatagan',
        password: '123',
        name: 'Wiatagan Paz',
        avatar: null,
        description: null,
        link: null,
      },
    ])
  }
}
