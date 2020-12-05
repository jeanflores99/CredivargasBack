'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EquipoSchema extends Schema {
  up() {
    this.create('equipos', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.string('description', 255)
      table.decimal('precioanterior', 8, 2).defaultTo(0)
      table.decimal('precio', 8, 2).notNullable()
      table.integer('stock').notNullable()
      table.boolean('activado').defaultTo(true)
      table.boolean('oferta').defaultTo(false)
      table.decimal('peso', 8, 2)
      table.integer('marca_id').unsigned().references('id').inTable('marcas')
      table.integer('tipoequipo_id').unsigned().references('id').inTable('tipoequipos')
      table.json('image_url')
      table.timestamps()
    })
  }

  down() {
    this.drop('equipos')
  }
}

module.exports = EquipoSchema
