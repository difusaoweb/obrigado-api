import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Obrigados extends BaseSchema {
  protected tableName = 'obrigados'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('value').unsigned().notNullable()
      table.string('message').nullable()

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
