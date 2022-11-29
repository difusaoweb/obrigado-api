import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ObrigadoUser extends BaseSchema {
  protected tableName = 'obrigado_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('sender_id').unsigned().references('users.id').notNullable()
      table.unique(['sender_id', 'obrigado_id'])
      table.integer('obrigado_id').unsigned().references('obrigados.id').notNullable()
      table.integer('receiver_id').unsigned().references('users.id').notNullable()
      table.unique(['receiver_id', 'obrigado_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
