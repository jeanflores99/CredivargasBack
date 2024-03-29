'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('dni', 8).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('first_name', 50).notNullable()
      table.string('last_name', 60).notNullable()
      table.string('telefono', 9).unique()
      table.string('direccion', 255).notNullable()
      table.date('fechanacimiento').notNullable()
      table.integer('cod_dep').notNullable()
      table.integer('cod_pro').notNullable()
      table.integer('cod_dis').notNullable()
      table.boolean('isadmin').defaultTo(false)
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
