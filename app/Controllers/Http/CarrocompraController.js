'use strict'
const Carrito = use('App/Models/Carrocompra')
const db = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with carrocompras
 */
class CarrocompraController {
  /**
   * Show a list of all carrocompras.
   * GET carrocompras
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new carrocompra.
   * GET carrocompras/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
    let carr = request.all();
    let dat = await db.raw('SELECT * from carrocompras where atendido = 0 and user_id=' + carr.user_id)
    let tmp_dat = dat[0]

    if (tmp_dat[0]) {
      return {
        dat: tmp_dat[0]
      }
    } else {
      let carr = request.all();
      try {
        let dat = await Carrito.create({ total: carr.total, user_id: carr.user_id })
        return {
          dat: dat
        }
      } catch (error) {
        console.log(error)
      }

    }

  }

  /**
   * Create/save a new carrocompra.
   * POST carrocompras
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single carrocompra.
   * GET carrocompras/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {

    let dat = await db.raw(`SELECT i.id,i.cantidad,i.subtotal,i.id_carrito,i.precio,i.id_equipo,i.created_at,i.updated_at ,e.name
    FROM itemcarros as i
    INNER JOIN carrocompras as c
    on  i.id_carrito= c.id
		INNER JOIN equipos as e
		on i.id_equipo = e.id
    where atendido = 0
    and user_id = ${params.id}`)
    let tmp_dat = dat[0]
    return {
      datos: tmp_dat
    }
  }

  /**
   * Render a form to update an existing carrocompra.
   * GET carrocompras/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async pagarcarrito({ params, request, response, view, auth }) {
    // try {
    //   await auth.check()
    // } catch (error) {
    //   console.log('no iniciaste sesion')
    // }
    let { userid } = params
    let dat = await db.select('*').from('carrocompras').where('atendido', 0).andWhere('user_id', userid)

    // console.log(dat[0])
    return {
      datos: dat[0]
    }



  }
  async finalizarcompra({ params, request }) {
    let { userid } = params
    let { card, totalCarrito } = request.all();

    let tmp_dat = await db.raw(`	SELECT * FROM carrocompras 
  	where user_id = ${userid}
    and atendido =0`)
    let dato = tmp_dat[0]

    let { id } = dato[0]
    try {
      // await db.raw(`UPDATE carrocompras SET total= ${totalCarrito}, atendido = '1', card_id ='1' WHERE id=${id}`)
      let carr = await Carrito.find(id)
      carr.total = totalCarrito
      carr.atendido = 1
      carr.card_id = 1
      await carr.save()
      return {
        success: true,
        meesage: 'La compra se ha realizado con éxito'
      }

    } catch (error) {
      console.log(error)
    }

  }

  /**
   * Update carrocompra details.
   * PUT or PATCH carrocompras/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async vercompras({ params, request, response }) {
    let { id } = request.all();
    try {
      let tmp_dat = await db.raw(`	SELECT * FROM carrocompras
      where user_id = ${id}
      and atendido =1`)
      tmp_dat = tmp_dat[0]
      return {
        datos: JSON.stringify(tmp_dat)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Delete a carrocompra with id.
   * DELETE carrocompras/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = CarrocompraController
