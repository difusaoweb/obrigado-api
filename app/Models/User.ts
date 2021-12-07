import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Notification from 'App/Models/Notification'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_login: string

  @column({ serializeAs: null })
  public user_pass: string

  @column()
  public user_email: string

  @column()
  public display_name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.user_pass) {
      user.user_pass = await Hash.make(user.user_pass)
    }
  }

  @hasMany(() => Notification)
  public notification: HasMany<typeof Notification>
}
