
var util = require('util')
var fs = require('fs')
var write = util.promisify(fs.writeFile)


module.exports = ({fpath, db, env, sync}) => {

  var config = require(fpath.config)

  var api = {
    update: {
      add: (events) => events.length ? db.concat(recent) : []
      ,
      update: (events) => events.length
        ? (events.forEach((event) => db[ids.indexOf(event.id)] = event), db)
        : []
    },
    write: (events) => {
      if (events.length) {
        write(fpath.db, JSON.stringify(events, null, 2), 'utf8')
      }
      config[env].sync[sync].since = new Date().getTime()
      write(fpath.config, JSON.stringify(config, null, 2), 'utf8')
    }
  }

  return api
}
