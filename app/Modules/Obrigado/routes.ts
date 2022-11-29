import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/home', 'ObrigadosController.home')

    Route.get('/profile', 'ObrigadosController.profile')

    Route.group(() => {
      Route.get('/transfer', 'ObrigadosController.transfer')
    }).middleware('auth')

    Route.get('/show', 'ObrigadosController.show')

    Route.get('/', 'ObrigadosController.index')
    // Route.group(() => {
    //   // Get all obrigados
    //   Route.get('/obrigados', 'ObrigadosController.index')

    //   // Create obrigado
    //   Route.post('/obrigados', 'ObrigadosController.store')

    //   // Remove obrigado
    //   Route.delete('/obrigados/:id?', 'ObrigadosController.destroy').where('id', {
    //     match: /^[0-9]+$/,
    //     cast: (id) => Number(id),
    //   })
    // }).middleware('auth')
  }).prefix('/obrigados')
}).prefix('/v1')
