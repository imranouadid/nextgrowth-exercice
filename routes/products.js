const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');

// Getting all subscribers
router.get('/', async (request, response) => {
    try{
        const subscribers = await Subscriber.find();
        response.json(subscribers);
    }catch (e) {
        response.status(500).json({message: e.message});
    }

})

// Getting One
router.get('/:id', getSubscriber, (request, response) => {
    response.json(response.subscriber);
})

// Creating one
router.post('/', async (request, response) => {
    const subscriber = new Subscriber({
        name: request.body.name,
        subscribedToChannel: request.body.subscribedToChannel
    });

    try{
        const newSubscriber = await subscriber.save();
        response.status(201).json(newSubscriber);
    }catch (e) {
        response.status(400).json({message: e.message});
    }

})

// Updating one
router.patch('/:id', getSubscriber, async (request, response) => {
    if (request.body.name != null) {
        response.subscriber.name = request.body.name
    }
    if (request.body.subscribedToChannel != null) {
        response.subscriber.subscribedToChannel = request.body.subscribedToChannel
    }
    try {
        const updatedSubscriber = await response.subscriber.save()
        response.json(updatedSubscriber)
    } catch (err) {
        response.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete('/:id', getSubscriber, async (request, response) => {
    try {
        await response.subscriber.remove()
        response.json({ message: 'Deleted Subscriber' })
    } catch (err) {
        response.status(500).json({ message: err.message })
    }
})

async function getSubscriber(request, response, next) {
    let subscriber
    try {
        subscriber = await Subscriber.findById(request.params.id);
        if (subscriber == null) {
            return response.status(404).json({ message: 'Cannot find subscriber' })
        }
    } catch (err) {
        return response.status(500).json({ message: err.message})
    }
    response.subscriber = subscriber
    next()
}

module.exports = router;
