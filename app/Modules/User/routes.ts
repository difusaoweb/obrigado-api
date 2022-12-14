import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/profile', 'UsersController.profile')

    Route.get('/', 'UsersController.index')

    // // Create user
    // Route.post('/users', 'UsersController.store')

    // Route.group(() => {
    //   // Get all users
    //   Route.get('/users', 'UsersController.index')

    //   // Get single user
    //   Route.get('/users/:id?', 'UsersController.show').where('id', {
    //     match: /^[0-9]+$/,
    //     cast: (id) => Number(id),
    //   })

    //   // Update user
    //   Route.put('/users/:id?', 'UsersController.update').where('id', {
    //     match: /^[0-9]+$/,
    //     cast: (id) => Number(id),
    //   })

    //   // Remove user
    //   Route.delete('/users/:id?', 'UsersController.destroy').where('id', {
    //     match: /^[0-9]+$/,
    //     cast: (id) => Number(id),
    //   })
    // }).middleware('auth')
  }).prefix('/users')
}).prefix('/v1')
