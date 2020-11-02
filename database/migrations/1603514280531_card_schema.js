'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardSchema extends Schema {
  up() {
    this.create('cards', (table) => {
      table.increments()
      table.string('codigo', 16).notNullable().unique()
      table.date('expirate').notNullable()
      table.string('code', 3).notNullable()
      table.decimal('saldo', 8, 2).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('cards')
  }
}

module.exports = CardSchema
