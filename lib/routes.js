"use strict"

const Path = require('path')
const Subscribe = require('./controllers/subscribe')

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Welcome to MataWinie'
        },
        config: {
            description: 'Welcome to MataWinie'
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        method: 'POST',
        path: '/subscribe',
        handler: Subscribe
    }
]