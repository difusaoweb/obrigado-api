import Route from '@ioc:Adonis/Core/Route'

import 'App/Modules/User/routes'
import 'App/Modules/Obrigado/routes'

Route.group(() => {
  // Login
  Route.post('/session', 'SessionsController.login')

  Route.group(() => {
    Route.delete('/session', 'SessionsController.logout')

    Route.get('/', async () => {
      return 'Hello'
    })
  }).middleware('auth')
}).prefix('/v1')
