const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const variantSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true
    },
    specification: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    }
})

module.exports = mongoose.model('Variant', variantSchema);