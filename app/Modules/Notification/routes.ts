import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    // Get all notifications
    Route.get('/notifications', 'NotificationsController.index')

    // Create notification
    Route.post('/notifications', 'NotificationsController.store')

    // Get single notification
    Route.get('/notifications/:id?', 'NotificationsController.show').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

    // Update notification
    Route.put('/notifications/:id?', 'NotificationsController.update').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

    // Remove notification
    Route.delete('/notifications/:id?', 'NotificationsController.destroy').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
  }).middleware('auth')
}).prefix('/v1')
