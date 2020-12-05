'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MarcaSchema extends Schema {
  up() {
    this.create('marcas', (table) => {
      table.increments()
      table.string('marca', 70)
      table.timestamps()
    })
  }

  down() {
    this.drop('marcas')
  }
}

module.exports = MarcaSchema
