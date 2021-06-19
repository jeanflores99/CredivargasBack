'use strict'
const moment = use('moment')
const User = use('App/Models/User')
const { validateAll, rule } = use('Validator');
const Hash = use('Hash');
const db = use('Database')

const { InvalidArgumentException } = require('@adonisjs/generic-exceptions')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
  }
  async logout({ auth, session, response }) {
    try {

      // session.flash({ successMessage: 'todo bien mano' })
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * Render a form to be used for creating a new user.
   * GET users/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response }) {

    try {
      const rules = {
        dni: 'required|min:8|unique:users',
        first_name: [
          rule('required'),
          rule('min', '3'),
          rule('max', '50'),
          rule('regex', /^([a-z]+\s)*[a-z]+$/i)
        ],
        last_name: [
          rule('required'),
          rule('min', '6'),
          rule('max', '60'),
          rule('regex', /^([a-z]+\s)*[a-z]+$/i)
        ],
        email: 'required|email|max:100|unique:users',
        password: 'required|min:8|confirmed',
        username: 'required|max:20|unique:users',
        direccion: 'required|max:255',
        telefono: 'required|max:9|unique:users'
      }

      const validation = await validateAll(request.all(), rules, {
        'dni.required': 'Por favor ingrese su DNI',
        'dni.min': 'El DNI debe ser de 8 dígitos',
        'dni.unique': 'Este DNI ya esta siendo usado',
        'first_name.required': 'Por favor ingrese su Nombre',
        'first_name.min': 'El nombre debe ser mayor a 3 caracteres',
        'first_name.max': 'El nombre debe ser menor a 50 caracteres',
        'first_name.regex': 'Ingrese correctamente su nombre',
        'last_name.required': 'Por favor ingrese su Apellido',
        'last_name.min': 'El nombre debe ser mayor a 6 caracteres',
        'last_name.max': 'El nombre debe ser menor a 60 caracteres',
        'last_name.regex': 'Ingrese correctamente sus apellidos',
        'email.required': 'Por favor ingrese su Email',
        'email.email': 'Por favor ingrese un Email válido',
        'email.unique': 'Este Email ya existe',
        'password.confirmed': 'Error al confirmar la contraseña',
        'password.required': 'Por favor ingrese la contraseña',
        'username.required': 'Por favor ingrese su Usuario',
        'username.unique': 'Este Usuario ya existe',
        'direccion.required': 'Por favor ingrese su direccion',
        'telefono.required': 'Por favor ingrese su Telefono',
        'telefono.max': 'El telefono debe ser maximo de 9 Dígitos',
        'telefono.unique': 'Este Telefono ya existe'
      })

      try {

        if (validation.fails()) {
          let tmp_errors = {};
          await validation.messages().filter(obj => {
            tmp_errors[obj.field] = obj.message;
          });
          throw new InvalidArgumentException(tmp_errors)
        }
        const data = validation._data
        let obj = ""
        try {
          obj = await User.create({
            dni: data.dni,
            username: data.username,
            email: data.email,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name,
            telefono: data.telefono,
            direccion: data.direccion,
            fechanacimiento: moment(data.fechanacimiento).format('YYYY-MM-DD'),
            cod_dep: data.cod_dep,
            cod_pro: data.cod_pro,
            cod_dis: data.cod_dis

          })



          return {
            success: true,
            code: 201,
            message: 'El Usuario fue registrado correctamente',
            obj
          }
        } catch (error) {

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

  async login({ request, auth }) {
    const validation = await validateAll(request.all(), {
      username: 'required',
      password: 'required'
    }, {
      'username.required': 'El Usuario o Email el olbgligatorio',
      'password.required': 'La Contraseña el olbgligatorio'
    })
    try {

      // console.log(validation.messages())
      if (validation.fails()) {
        let tmp_errors = {};
        await validation.messages().filter(obj => {
          tmp_errors[obj.field] = obj.message;
        });
        throw new InvalidArgumentException(tmp_errors)
      }
      // if (validation.fails()) throw new InvalidArgumentException(validation.messages())



      try {
        let data = validation._data

        let user = await User.query()
          .where('username', request.input('username'))
          .orWhere('email', request.input('username'))
          .first();
        if (!user) throw new InvalidArgumentException({ username: "La cuenta de usuario no existe!" });
        // validar password
        let isSame = await Hash.verify(request.input('password'), user.password)
        if (!isSame) throw new InvalidArgumentException({ password: "Las contraseña es incorrecta" });
        const token = await auth.generate(user)
        // const token = await auth.login(user)

        let dat = await db.raw(`SELECT u.id,u.username,u.dni,u.email,u.first_name,u.last_name,u.telefono,u.direccion,u.fechanacimiento,u.cod_dep,b.departamento,u.cod_pro,b.provincia,u.cod_dis,b.distrito,u.isadmin FROM users as u
        INNER JOIN badges as b
        on b.cod_dep = u.cod_dep
        and b.cod_pro = u.cod_pro
        and b.cod_dis= u.cod_dis
        WHERE u.id = `+ user.id)
        user = await dat[0]



        return {
          user: user[0],
          success: true,
          code: 201,
          message: token
        }
      } catch (error) {
        return {
          succes: false,
          code: error.code,
          message: error.message
        }
      }
    } catch (error) {
      return {
        succes: false,
        code: error.code,
        message: error.message
      }
    }
  }
  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ auth }) {


    let dat = await auth.getUser()

    let dato = await db.raw(`SELECT u.id,u.username,u.dni,u.email,u.first_name,u.last_name,u.telefono,u.direccion,u.fechanacimiento,u.cod_dep,b.departamento,u.cod_pro,b.provincia,u.cod_dis,b.distrito,u.isadmin FROM users as u
    INNER JOIN badges as b
    on b.cod_dep = u.cod_dep
    and b.cod_pro = u.cod_pro
    and b.cod_dis= u.cod_dis
    WHERE u.id = `+ dat.id)
    let aea = await dato[0]
    dat = await aea[0]
    console.log(dat)
    try {
      return dat
    } catch (error) {
      return {
        message: 'El token ya no es valido',
        error
      }

    }
  }



  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}


module.exports = UserController
