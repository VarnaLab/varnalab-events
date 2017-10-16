
module.exports = ({config, db}) => {

  var ids = db.map((event) => event.id)

  var api = {
    place: (events) => events
      .filter((event) => event.place && event.place.id === config.place.id)
    ,
    since: (events) => events
      .filter((event) =>
        new Date(event.updated_time).getTime() > config.sync.update.since)
    ,
    updated: (events) => events
      .filter((event) => ((ev = db[ids.indexOf(event.id)]) =>
        ev.name !== event.name ||
        ev.description !== event.description ||
        ev.start_time !== event.start_time ||
        ev.end_time !== event.end_time ||
        // origin and/or path change
        ev.photo.replace(/(.*)\?.*/, '$1') !==
        event.photo.replace(/(.*)\?.*/, '$1')
      )())
    ,
    fields: (events) => events
      .map(
        ({id, name, description, photo, start_time, end_time, updated_time}) =>
        ({id, name, description, photo, start_time, end_time, updated_time})
      )
    ,
    recent: {
      add: (events) => events
        // only non existing events
        .filter((event) => !ids.includes(event.id))
      ,
      update: (events) => events
        // only existing events
        .filter((event) => ids.includes(event.id))
    },
    sort: (events) => events
      // stable sort
      .map((event, index) => ({event, index}))
      .sort((a, b) => (
        (
          x = new Date(a.event.start_time).getTime(),
          y = new Date(b.event.start_time).getTime(),
        ) =>
        // preserve order
        y < x ? -1 : y > x ? 1 : a.index - b.index
      )())
      .map((pair) => pair.event)
  }

  return api
}
