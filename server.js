'use strict';

const Hapi = require('@hapi/hapi')
const Settings = require('./settings')
const Routes = require('./lib/routes')

const init = async () => {
    const server = Hapi.server({
        port: Settings.port,
        host: Settings.host,
    })

    server.route(Routes)

    await server.start()
    console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init()