'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CarrocompraSchema extends Schema {
  up() {
    this.create('carrocompras', (table) => {
      table.increments()
      table.decimal('total', 8, 2)
      table.boolean('atendido').defaultTo('false')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('card_id').unsigned().references('id').inTable('cards')
      table.timestamps()
    })
  }

  down() {
    this.drop('carrocompras')
  }
}

module.exports = CarrocompraSchema
