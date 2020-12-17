'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemcarroSchema extends Schema {
  up () {
    this.create('itemcarros', (table) => {
      table.increments()
      table.integer('cantidad')
      table.decimal('precio',8,2)
      table.decimal('subtotal',8,2)
      table.integer('id_carrito').unsigned().references('id').inTable('carrocompras')
      table.integer('id_equipo').unsigned().references('id').inTable('equipos')

      table.timestamps()
    })
  }

  down () {
    this.drop('itemcarros')
  }
}

module.exports = ItemcarroSchema
