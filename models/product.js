const mongoose = require('mongoose')
const Schema = mongoose.Schema;

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
    variants: [
        {
            type: Schema.Types.ObjectId,
            ref: "Variant"
        }
    ]
})


module.exports = mongoose.model('Product', productSchema);