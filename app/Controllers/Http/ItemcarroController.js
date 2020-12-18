'use strict'
const ItemCarro = use('App/Models/Itemcarro')
const db = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with itemcarros
 */
class ItemcarroController {
  /**
   * Show a list of all itemcarros.
   * GET itemcarros
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async vercompradetallado({ params }) {
    let { idcarrito } = params

    let tmp = await db.raw(`SELECT i.id,i.precio,i.cantidad,i.subtotal,e.name,e.description FROM itemcarros as i
    INNER JOIN equipos as e
    on i.id_equipo = e.id
    where i.id_carrito=${idcarrito}`)
    tmp = tmp[0]
    return {
      dato: tmp
    }

  }

  /**
   * Render a form to be used for creating a new itemcarro.
   * GET itemcarros/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async agregaralcarrito({ request, params, view }) {
    const { idproducto } = params
    const { idcarrito, subtotal } = request.all()


    try {
      let dato = await ItemCarro.create({
        cantidad: 1,
        subtotal: subtotal,
        precio: subtotal,
        id_carrito: idcarrito,
        id_equipo: idproducto
      })
      return {
        dato: dato,
        success: true
      }
    } catch (error) {
      console.log(error)
    }



  }
  async llenarProductos({ params, request }) {
    // console.log(params.id)
    let localstorash = request.all()

    let newCarr = []
    for (let i in localstorash) {
      newCarr.push(localstorash[i])
    }
    try {
      await newCarr.map(async obj => {
        await ItemCarro.create({
          cantidad: obj.cantidad,
          precio: obj.subtotal,
          subtotal: obj.subtotal,
          id_carrito: params.id,
          id_equipo: obj.id_equipo
        })
      })
      return {
        newCarr: newCarr,
        success: true
      }
    } catch (error) {
      return {
        error: error,
        success: false
      }
    }

  }

  /**
   * Create/save a new itemcarro.
   * POST itemcarros
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single itemcarro.
   * GET itemcarros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing itemcarro.
   * GET itemcarros/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
    let { option } = request.all()
    let productoEquipo = await ItemCarro.find(params.idproducto)

    let cantidad = productoEquipo.cantidad
    let precio = productoEquipo.precio
    let subtotal = 0
    switch (option) {
      case 'add':
        if (cantidad < 5) {
          cantidad++;
          subtotal = cantidad * precio
          productoEquipo.cantidad = cantidad
          productoEquipo.precio = precio
          productoEquipo.subtotal = subtotal
          await productoEquipo.save()
          return {

            success: true
          }
        } else {
          return {
            success: false,
            message: 'Cantidad máxima alcanzada'
          }
        }

        break;
      case 'minus':
        if (cantidad > 1) {
          cantidad--;
          subtotal = cantidad * precio
          productoEquipo.cantidad = cantidad
          productoEquipo.precio = precio
          productoEquipo.subtotal = subtotal
          await productoEquipo.save()
          return {

            success: true
          }
        } else {
          return {
            success: false,
            message: 'Cantidad mínima alcanzada'
          }
        }
        break;
      case 'delete':
        await productoEquipo.delete();
        return {
          success: true,
          message: 'Rroducto Eliminado'
        }
        break;

    }
  }

  /**
   * Update itemcarro details.
   * PUT or PATCH itemcarros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a itemcarro with id.
   * DELETE itemcarros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = ItemcarroController
