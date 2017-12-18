
var https = require('https')
var request = require('@request/client')
var Purest = require('purest')({request, promise: Promise})
var Sync = require('facebook-sync')


module.exports = ({auth, config, fields, purest, facebook, db, sync}) => {

  if (!facebook) {
    var facebook = Purest({
      provider: 'facebook',
      config: purest,
      defaults: {
        auth: {bearer: auth.token},
        agent: new https.Agent({keepAlive: true, maxSockets: 3})
      }
    })
  }

  var api = {
    event: (id) =>
      facebook
        .get(id)
        .qs({
          fields: fields.event.join()
        })
        .timeout(3000)
        .request()
        .then(([res, body]) => res.statusCode !== 200
          ? Promise.reject(JSON.stringify(body))
          : body)
    ,
    events: {
      // fb events from fb feeds
      add: Sync({
        config: Object.assign({}, config, {sync: config.sync.add}),
        fields,
        facebook
      }).events
      ,
      // fb events from JSON database
      update: () => Promise.all(
        db.slice(0, config.sync.update.limit)
          .map((event) => api.event(event.id)))
    },
    photo: (event) =>
      facebook
        .get(event.cover.id) // fb event
        .qs({
          fields: fields.photo.join()
        })
        .timeout(3000)
        .request()
        .then(([res, body]) =>
          res.statusCode !== 200
            ? Promise.reject(JSON.stringify(body))
            : body.images
        )
        .then((images) => {
          var sorted = images.sort((a, b) => (a.width - b.width))

          var desktop = sorted[sorted.length - 1]
          var mobile = sorted.find((image) => image.width >= 500)

          event.cover_desktop =
            (desktop && desktop.source) || null
          event.cover_mobile =
            (mobile && mobile.source) || desktop.source || null

          return event
        })
    ,
    photos: (events) => Promise.all(
      events.map((event) => !event.cover
        ? Promise.resolve(event)
        : api.photo(event)
      )
    )
  }

  return api
}
