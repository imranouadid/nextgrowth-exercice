const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    reference: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Product', productSchema);