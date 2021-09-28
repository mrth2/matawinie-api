"use strict"

const Joi = require('joi')

const schema = Joi.object({
    email: Joi.string().required().email({
        minDomainSegments: 2
    }),
    name: Joi.string().required(),
    phone: Joi.string().required()
})

const { curly } = require('node-libcurl')

async function subscribeMailerLite({ email, name, phone }) {
    const { statusCode, data, headers } = await curly.post(`https://api.mailerlite.com/api/v2/groups/${process.env.MAILERLITE_GROUP_ID}/subscribers`, {
        postFields: JSON.stringify({
            email,
            name,
            fields: {
                phone
            }
        }),
        httpHeader: [
            'Content-Type: application/json',
            "X-MailerLite-ApiKey:" + process.env.MAILERLITE_API_KEY
        ]
    })
    console.log(statusCode)
    console.log(headers)
    console.log(data)
    return { data, statusCode }
}
async function subscribeSimpleTexting() {

}

module.exports = async (request, h) => {
    const { value, error } = schema.validate(request.payload)
    if (error) return error.details
    else {
        const subscribed = {
            mailerlite: 'nope',
            simpleTexting: 'nope'
        }
        const { data, statusCode} = await subscribeMailerLite(request.payload)
        if (statusCode !== 200) return data
        else subscribed.mailerlite = 'yes'

        await subscribeSimpleTexting()
        return subscribed
    }
}