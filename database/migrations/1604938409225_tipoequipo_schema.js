'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TipoequipoSchema extends Schema {
  up () {
    this.create('tipoequipos', (table) => {
      table.increments()
      table.string('tipoequipo')
      table.timestamps()
    })
  }

  down () {
    this.drop('tipoequipos')
  }
}

module.exports = TipoequipoSchema
