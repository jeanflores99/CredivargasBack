'use strict'
const { validateAll, rule } = use('Validator');
const Equipo = use('App/Models/Equipo')
// const Image = use('App/Models/Image')
const Helpers = use('Helpers')
const db = use('Database');
const { Storage } = require('validator-error-adonis');
const Env = use('Env');
// const { uid } = use('uid');

// const CloudinaryService = use('App/Services/CloudinaryService');
const moment = use('moment')
const { uid } = use('uid');
const { InvalidArgumentException } = require('@adonisjs/generic-exceptions')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with equipos
 */
class EquipoController {
  /**
   * Show a list of all equipos.
   * GET equipos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async obtenerproducto({ params }) {
    try {
      const data = await db.raw('select * from equipos WHERE id =' + params.id);
      const productos = data[0];
      await productos.map(async p => {
        p.image_url = await JSON.parse(p.image_url) || [];
        let real = [];
        await p.image_url.filter(async img => await real.push(`${Env.get('APP_URL')}/${img}`));
        p.image_url = real;
        return p;
      })
      return productos.length ?
        {
          success: true,
          dato: productos[0],
          message: 'El Equipo fue encontrado'
        } :
        {
          success: false,
          message: 'El Equipo no existe'
        }

    } catch (error) {
      console.log(error)
    }

  }

  async getAllProducto() {
    try {
      const data = await db.raw('SELECT * FROM `equipos` ')
      let productos = data[0];
      await productos.map(async p => {
        p.image_url = await JSON.parse(p.image_url) || [];
        let real = [];
        await p.image_url.filter(async img => await real.push(`${Env.get('APP_URL')}/${img}`));
        p.image_url = real;
        return p;
      })
      // response
      return { datos: productos }
    } catch (error) {
      console.log(error)
    }
  }
  async getAllProductoCliente() {
    try {
      const data = await db.raw('SELECT * FROM `equipos`')
      let productos = data[0];
      await productos.map(async p => {
        p.image_url = await JSON.parse(p.image_url) || [];
        let real = [];
        await p.image_url.filter(async img => await real.push(`${Env.get('APP_URL')}/${img}`));
        p.image_url = real;
        return p;
      })
      // response
      // console.log(productos)
      return { datos: productos }
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * Render a form to be used for creating a new equipo.
   * GET equipos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, auth }) {
    // let { name,
    //   description,
    //   tipoequipo_id,
    //   marca_id,
    //   precio,
    //   stock,
    //   peso } = request.all();
    // //upload process
    // try {
    //   const equipo = new Equipo();
    //   equipo.name = name
    //   equipo.description = description
    //   equipo.tipoequipo_id = tipoequipo_id
    //   equipo.marca_id = marca_id
    //   equipo.precio = precio
    //   equipo.stock = stock
    //   equipo.peso = peso


    //   const file = request.file('files')

    //   equipo.image_url = await name + uid() + '.' + file.subtype
    //   // const user = await auth.getUser()

    //   // img.user_id(user.$originalAttributes.id)



    //   file.move(Helpers.publicPath('images'), {
    //     name: equipo.image_url
    //   })
    //   equipo.save();
    // } catch (error) {
    //   console.log(error)
    // }




    try {
      const rules = {
        description: 'required|max:255',
        marca_id: 'required',
        name: 'required|max:50',
        peso: 'required|min:0|max:6',
        precio: 'required|min:1|max:7',
        stock: 'required|min:1|max:4',
        tipoequipo_id: 'required'
      }
      const validation = await validateAll(request.all(), rules, {
        'description.max': 'La description no debe ser mayor a 255 caracteres',
        'description.required': 'Por favor ingrese la Descripcion',
        'marca_id.required': 'Por favor seleccione una Marca del Producto',
        'name.required': 'Por favor ingrese un Nombre al Producto',
        'name.max': 'El Nombre del Producto no debe ser mayor a 50 caracteres',
        'peso.required': 'Por favor ingrese el Peso del Producto',
        'peso.min': 'El peso minimo es de 0 KG',
        'peso.max': 'El peso no debe exceder los 9999 KG',
        'precio.required': 'Por favor ingrese el Precio del Producto',
        'precio.min': 'El Precio debe ser mayor a S/0.00',
        'precio.max': 'El Precio de ser menor a S/99999.99',
        'stock.required': 'Por favor ingrese el Stock del Producto',
        'stock.min': 'El Stock debe ser mayor a 0',
        'stock.max': 'El Stock debe ser menor a 9999',
        'tipoequipo_id.required': 'Por favor seleccione un Tipo de Equipo'
      })
      try {
        // console.log(validation)
        if (validation.fails()) {
          let tmp_errors = {}
          await validation.messages().filter(obj => {
            tmp_errors[obj.field] = obj.message;
          })
          throw new InvalidArgumentException(tmp_errors)
        }
        const data = validation._data
        let obj = ""
        try {
          let file = await Storage.saveFile(request, 'files', {
            size: '6mb',
            extnames: ['jpeg', 'png', 'jpg', 'JPG'],
            multifiles: true
          }, Helpers, {
            path: `equipo/${data.name}`,
            options: {
              overwrite: true
            }
          });
          // 
          let realFiles = [];
          if (file.success) {
            await file.files.filter(async f => await realFiles.push(`file?path=${f.path}&disk=tmp`));
          }

          obj = await Equipo.create({
            name: data.name,
            description: data.description,
            tipoequipo_id: data.tipoequipo_id,
            marca_id: data.marca_id,
            precio: parseFloat(data.precio),
            stock: data.stock,
            peso: parseFloat(data.peso),
            image_url: JSON.stringify(realFiles)
          })
          // respose
          return {
            success: true,
            code: 201,
            message: 'El Producto fue agregado correctamente',
            obj
          }
        } catch (error) {
          console.log(error)
          return {
            success: false,
            code: 501,
            message: JSON.stringify(error.message)
          }
        }
      } catch (error) {

        return {
          success: false,
          code: error.code,
          message: JSON.stringify(error.message)
        }

      }
    } catch (error) {
      console.log(error)
    }

  }

  /**
   * Create/save a new equipo.
   * POST equipos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {

  }

  /**
   * Display a single equipo.
   * GET equipos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing equipo.
   * GET equipos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update equipo details.
   * PUT or PATCH equipos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a equipo with id.
   * DELETE equipos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = EquipoController
