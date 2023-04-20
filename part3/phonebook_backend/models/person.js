const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                const splittedNumber = v.split('-')
                if(splittedNumber.length !== 2) {
                    return false
                }
                const firstPart = splittedNumber[0]
                const secondPart = splittedNumber[1]
                let isnum1 = /^\d+$/.test(firstPart)
                let isnum2 = /^\d+$/.test(secondPart)
                if(!isnum1 || !isnum2) {
                    return false
                }
                if(firstPart.length <= 1 || firstPart.length > 3) {
                    return false
                }
                return true
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
