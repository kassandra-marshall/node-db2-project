const Cars = require('./cars-model');
const router = require('express').Router();
const {checkCarId, checkCarPayload, checkVinNumberValid, checkVinNumberUnique} = require('./cars-middleware')

// DO YOUR MAGIC
router.get('/', async (req, res, next) => {
    try {
        const cars = await Cars.getAll()
        res.json(cars)
    } catch (error) {
        next(error)
    }
});

router.get('/:id', checkCarId, async (req, res, next) => { //eslint-disable-line
    res.json(req.car)
});

router.post('/', checkCarPayload, checkVinNumberValid, checkVinNumberUnique, async (req, res, next) => {
    try {
        const car = await Cars.create(req.body)
        res.status(201).json(car)
    } catch (error) {
        next(error)
    }
    // Cars.create(req.body)
    // .then(newId => {
    //     Cars.getById(newId)
    // })
    // .then(car => {
    //     res.json(car)
    // })
    // .catch(next);
});

// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => { 
    res.status(error.status || 500).json({
        message: error.message,
        stack: error.stack
    })
})

module.exports = router;