const Cars = require('./cars-model');
const vinValidator = require('vin-validator');

const checkCarId = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const car = await Cars.getById(req.params.id)
    if(!car) {
      next({ status: 404, message:`car with ${req.params.id} is not found` })
    } else {
      req.car = car
      next()
    }
  } catch (error) {
    res.status(500).json({ message: 'problem finding car' })
  }
}

const checkCarPayload = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const { vin, make, model, mileage } = req.body
    const error = { status: 400 }
    if (!vin) {
      error.message = 'vin is missing'
    } else if (!make) {
      error.message = 'make is missing'
    } else if (!model) {
      error.message = 'model is missing'
    } else if(!mileage) {
      error.message = 'mileage is missing'
    }
    if(error.message){
      next(error)
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
}

const checkVinNumberValid = (req, res, next) => {
  // DO YOUR MAGIC
  const isValidVin = vinValidator.validate(req.body.vin)
  if (!isValidVin){
    next({ status: 400, message: `vin ${req.body.vin} is invalid` })
  } else {
    next()
  }

}

const checkVinNumberUnique = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const existing = await Cars.getbyVin(req.body.vin)
    if (existing) {
      next({ status: 400, message: `vin ${req.body.vin} already exists`})
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique
}