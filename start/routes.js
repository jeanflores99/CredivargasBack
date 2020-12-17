'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
    return { mensage: 'retornando view' }
})
// Route.group(() => {
Route.post('api/register', 'UserController.create')
Route.post('api/login', 'UserController.login')
// }).middleware(['guest'])





Route.get('api/logout', 'UserController.logout')


Route.get('/getUser', 'UserController.show')

Route.get('api/ubigeo/departamento', 'BadgeController.getDepartamento')
Route.get('api/ubigeo/provincia/:id', 'BadgeController.getProvincia')
Route.get('api/ubigeo/distrito/:id/:ida', 'BadgeController.getDistrito')

Route.get('api/getTipoEquipo', 'TipoequipoController.getTipoEquipo')
Route.get('api/getMarca', 'TipoequipoController.getMarca')
Route.get('api/getAllProducto', 'EquipoController.getAllProducto')
Route.get('api/getAllProductoCliente', 'EquipoController.getAllProductoCliente')


Route.post('api/admin/register', 'EquipoController.create')

Route.get('file', 'FileController.handle');
Route.get('api/obtenerproducto/:id', 'EquipoController.obtenerproducto')

Route.post('api/carrito/crear', 'CarrocompraController.create')
Route.get('api/carrito/show/:id', 'CarrocompraController.show')
Route.post('api/carrito/llenarproducto/:id', 'ItemcarroController.llenarProductos')
Route.post('api/carrito/agregaralcarrito/:idproducto', 'ItemcarroController.agregaralcarrito')
Route.post('api/carrito/editar/:idproducto', 'ItemcarroController.edit')
Route.get('api/carrito/obtenerdatosdelcarrito/:userid', 'CarrocompraController.pagarcarrito')
Route.post('api/carrito/finalizarcompra/:userid', 'CarrocompraController.finalizarcompra')
Route.post('api/carrito/vercompras', 'CarrocompraController.vercompras')
Route.get('api/carrito/vercompradetallado/:idcarrito', 'ItemcarroController.vercompradetallado')




