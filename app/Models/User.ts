import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  column,
  beforeSave,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Obrigado from 'App/Models/Obrigado'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public username: string

  @column()
  public name: string

  @column()
  public avatar: string | null

  @column()
  public description: string | null

  @column()
  public link: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @manyToMany(() => Obrigado, {
    pivotTable: 'obrigado_user',
    localKey: 'id',
    pivotForeignKey: 'sender_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'obrigado_id',
  })
  public obrigadosSenders: ManyToMany<typeof Obrigado>

  @manyToMany(() => Obrigado, {
    pivotTable: 'obrigado_user',
    localKey: 'id',
    pivotForeignKey: 'receiver_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'obrigado_id',
  })
  public obrigadosReceivers: ManyToMany<typeof Obrigado>
}
