import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/login', 'AccessController.login')
    Route.group(() => {
      Route.get('/check-authentication', 'AccessController.checkAuthentication')
      Route.get('/logout', 'AccessController.logout')
    }).middleware('auth')
  }).prefix('/access')
}).prefix('/v1')
