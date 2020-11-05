'use strict'
const db = use('Database')
const Badge = use('App/Models/Badge')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with badges
 */
class BadgeController {
  /**
   * Show a list of all badges.
   * GET badges
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async getDepartamento({ params }) {
    try {
      // const dat = await db.select('cod_pro', 'departamento', 'cod_dis', 'provincia', 'distrito').from('badges').where('cod_dep', params.id)
      const dat = await db.select('cod_dep', 'departamento').from('badges').where('isdelivery', '=', 1).distinct('cod_dep')
      // const dat = await db.table('badges').groupBy('cod_pro', 'departamento').having('isdelivery', '=', 1)
      // const datos = JSON.stringify(dat)

      //danto forma al arreglo para llenar al dropdown
      let aea = await dat.map(obj => {
        return {
          key: obj.cod_dep,
          value: obj.cod_dep,
          text: obj.departamento
        }
      }
      )
      // 
      return {
        datos: JSON.stringify(aea)
      }
    } catch (error) {
      console.log(error)
    }
  }
  async getProvincia({ params }) {
    try {
      const dat = await db.select('cod_pro', 'provincia').from('badges').where('cod_dep', '=', params.id).distinct('cod_pro')
      let aea = await dat.map(obj => {
        return {
          key: obj.cod_pro,
          value: obj.cod_pro,
          text: obj.provincia
        }
      })
      return {
        datos: JSON.stringify(aea)
      }
    } catch (error) {
      console.log(error)
    }
  }
  async getDistrito({ params }) {
    try {
      const dat = await db.raw('select cod_dis, distrito from badges where cod_dep =' + params.id + ' and cod_pro =' + params.ida)
      const newdata = dat[0]
      let aea = await newdata.map(obj => {
        return {
          key: obj.cod_dis,
          value: obj.cod_dis,
          text: obj.distrito
        }
      })
      return {
        datos: JSON.stringify(aea)
      }
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * Render a form to be used for creating a new badge.
   * GET badges/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request 
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new badge.
   * POST badges
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single badge.
   * GET badges/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing badge.
   * GET badges/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update badge details.
   * PUT or PATCH badges/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a badge with id.
   * DELETE badges/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = BadgeController
