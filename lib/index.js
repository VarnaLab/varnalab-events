
var modules = {
  facebook: require('./facebook'),
  events: require('./events'),
}


var ctor = ({auth, config, fields, db, purest, facebook, sync}) => {

  var fb = modules.facebook({auth, config, fields, db, purest, sync})
  var events = modules.events({config, db})

  var api = {
    add: () =>
      fb.events[sync]()
        .then(events.place)
        .then(fb.photos)
        .then(events.fields)
        .then(events.recent[sync])
    ,
    update: () =>
      fb.events[sync]()
        .then(events.since)
        .then(fb.photos)
        .then(events.fields)
        .then(events.updated)
        .then(events.recent[sync])
  }

  return api
}

module.exports = Object.assign(ctor, modules)
