/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Login
  Route.post('/session', 'SessionsController.login')

  // Create user
  Route.post('/users', 'UsersController.store')

  Route.group(() => {
    Route.delete('/session', 'SessionsController.logout')

    Route.get('/', async () => {
      return 'Hello'
    })

    // Get all users
    Route.get('/users', 'UsersController.index')

    // Get single user
    Route.get('/users/:id?', 'UsersController.show').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

    // Update user
    Route.put('/users/:id?', 'UsersController.update').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

    // Remove user
    Route.delete('/users/:id?', 'UsersController.destroy').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
  }).middleware('auth')
}).prefix('/v1')
