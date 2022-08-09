const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Variant = require('../models/variant');

// Import middlewares
const auth = require("../middleware/auth");

// Getting all products
router.get('/', auth, async (request, response) => {
    try{
        const products = await Product.find().populate("variants");
        response.json(products);
    }catch (e) {
        response.status(500).json({message: e.message});
    }
})

// Getting one product
router.get('/:product_id',[auth, getProduct], (request, response) => {
    response.json(response.product);
})

// Getting variants by product id
router.get('/:product_id/variants/', [auth, getProduct], async (request, response) => {
    response.json(response.product.variants)
})

// Getting one variant by his ID and product ID.
router.get('/:product_id/variants/:variant_id', [auth, getProduct], async (request, response) => {
    const variant = response.product.variants.filter(v => v._id == request.params.variant_id)[0]
    if (!variant) {
        return response.status(404).json({ message: 'Cannot find variant !' })
    }
    response.json(variant)
})

// Creating a new product
router.post('/', auth,async (request, response) => {

    const product = new Product({
        reference: request.body.reference,
        name: request.body.name,
        description: request.body.description,
        image: request.body.image,
    });

    try{
        // Add new product
        const newProduct = await product.save();

        // Add variants
        if(request.body.variants != null){
            const newVariants = await Variant.insertMany(request.body.variants);
            const variantsIds = newVariants.map((variant) => variant._id);
            newProduct.variants = [...newProduct.variants, ...variantsIds];
            await newProduct.save();
        }

        // return the response
        response.status(201).json(newProduct);
    }catch (e) {
        response.status(400).json({message: e.message});
    }
})



// Updating a product
router.patch('/:product_id', [auth, getProduct], async (request, response) => {

    let variantsToBeUpdated = []
    let variantsToBeAdded = []

    if (request.body.reference != null) {
        response.product.reference = request.body.reference
    }
    if (request.body.name != null) {
        response.product.name = request.body.name
    }
    if (request.body.description != null) {
        response.product.description = request.body.description
    }
    if (request.body.image != null) {
        response.product.image = request.body.image
    }
    if (request.body.variants != null) {
        request.body.variants.map(async v => {
            if(v._id != null){
                variantsToBeUpdated.push({...v})
            }else{
                variantsToBeAdded.push({...v})
            }
        })
    }

    try {

        // Update variants
        if(variantsToBeUpdated.length > 0){
            variantsToBeUpdated.map(async (variant) => {
                await Variant.findByIdAndUpdate(variant._id, {...variant})
            });
            // const updatedVariantsIds =  variantsToBeUpdated.map(async (variant) => variant._id);
            // const oldVariantsIds =  response.product.variants.map(async (variant) => variant._id);
            response.product.variants = [...variantsToBeUpdated]

        }

        // Add new variants
        if(variantsToBeAdded.length > 0){
            const newVariants = await Variant.insertMany(variantsToBeAdded);
            const newVariantsIds = newVariants.map((variant) => variant._id);
            response.product.variants = [...response.product.variants, ...newVariantsIds];
        }

        // remove variants if variants field is empty: Ex: "variants": []
        if(variantsToBeAdded.length === 0 && variantsToBeUpdated.length === 0 && request.body.variants != null){
            response.product.variants.map(async variant => {
                await variant.remove()
            })
            response.product.variants = []
        }

        const updatedProduct = await response.product.save();
        response.json(updatedProduct)

    } catch (err) {
        response.status(400).json({ message: err.message })
    }

})


// Deleting a product
router.delete('/:product_id', [auth, getProduct], async (request, response) => {
    try {

        // retrieve product
        const product = await response.product;

        // remove variants of product
        product.variants.map(async v => {
            await v.remove();
        });

        // remove product
        await product.remove();

        response.json({ message: 'Product has been deleted successfully.' })

    } catch (err) {
        response.status(500).json({ message: err.message })
    }
})


// Middleware: Get one product
async function getProduct(request, response, next) {
    let product;
    try {
        product = await Product.findById(request.params.product_id).populate("variants");
        if (product == null) {
            return response.status(404).json({ message: 'Cannot find product !' })
        }
    } catch (err) {
        return response.status(500).json({ message: err.message})
    }
    response.product = product
    next()
}

module.exports = router;