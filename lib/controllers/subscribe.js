"use strict"

const Joi = require('joi')

const schema = Joi.object({
    email: Joi.string().required().email({
        minDomainSegments: 2
    }),
    name: Joi.string(),
    phone: Joi.string().required(),
    company: Joi.string()
})

const { curly } = require('node-libcurl')

async function subscribeMailerLite({ email, name, phone, company }) {
    const { statusCode, data, headers } = await curly.post(`https://api.mailerlite.com/api/v2/groups/${process.env.MAILERLITE_GROUP_ID}/subscribers`, {
        postFields: JSON.stringify({
            email,
            name,
            fields: {
                phone,
                company
            }
        }),
        httpHeader: [
            'Content-Type: application/json',
            "X-MailerLite-ApiKey:" + process.env.MAILERLITE_API_KEY
        ]
    })
    return { data, statusCode }
}

async function subscribeSimpleTexting({ email, name, phone, company }) {
    const params = new URLSearchParams({
        token: process.env.SIMPLETEXTING_API_TOKEN,
        group: process.env.SIMPLETEXTING_GROUP_ID,
        phone,
        firstName: name,
        email,
        company
    }).toString()
    const { data } = await curly.post(`https://app2.simpletexting.com/v1/group/contact/add`, {
        postFields: params,
        httpHeader: [
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json'
        ]
    })
    return { data, statusCode: data.code }
}

module.exports = async (request, h) => {
    console.log(request.payload)
    const { error } = schema.validate(request.payload)
    if (error) return error.details
    else {
        const subscribed = {
            mailerlite: 'nope',
            simpleTexting: 'nope'
        }
        const { data: dataML, statusCode: statusCodeML } = await subscribeMailerLite(request.payload)
        if (statusCodeML !== 200) return dataML
        else subscribed.mailerlite = 'yes'

        const { data: dataST, statusCode: statusCodeST } = await subscribeSimpleTexting(request.payload)
        if (statusCodeST !== 1 && statusCodeST !== -607) return dataST
        else subscribed.simpleTexting = 'yes'
        return subscribed
    }
}