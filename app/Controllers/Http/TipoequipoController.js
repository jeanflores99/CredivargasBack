'use strict'
const db = use('Database');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tipoequipos
 */
class TipoequipoController {
  /**
   * Show a list of all tipoequipos.
   * GET tipoequipos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  

  async getMarca() {
    const data = await db.select('id', 'marca').from('marcas');
    let aea = await data.map(obj => {
      return {
        key: obj.id,
        value: obj.id,
        text: obj.marca
      }
    })
    return {
      datos: JSON.stringify(aea)
    }
  }
  async getTipoEquipo() {
    const data = await db.select('id', 'tipoequipo').from('tipoequipos');
    let aea = await data.map(obj => {
      return {
        key: obj.id,
        value: obj.id,
        text: obj.tipoequipo
      }
    })
    return {
      datos: JSON.stringify(aea)
    }
    // return { data }
  }

  async create({ request, response, view }) {
  }

  /**
   * Create/save a new tipoequipo.
   * POST tipoequipos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single tipoequipo.
   * GET tipoequipos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    return {
      aea: 'aea'
    }
  }

  /**
   * Render a form to update an existing tipoequipo.
   * GET tipoequipos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update tipoequipo details.
   * PUT or PATCH tipoequipos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a tipoequipo with id.
   * DELETE tipoequipos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = TipoequipoController
