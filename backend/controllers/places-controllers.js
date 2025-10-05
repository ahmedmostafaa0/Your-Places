const mongoose  = require('mongoose')
const fs = require('fs')
const {validationResult} = require('express-validator')

const HttpError = require('../utils/http-error')
const getCoordsForAddress = require('../utils/location')
const Place = require('../models/Place')
const User = require('../models/User')

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid

    let place;
    try {
      place = await Place.findById(placeId)
    } catch (error) {
      const errors = new HttpError('Something went wrong, couldn\'t find a place.', 500)
      return next(errors)
    }
    if(!place){
      const errors = new HttpError('Couldn\'t find a place for this provided id.', 404)
      return next(errors)
    }
    res.json({place: place.toObject({getters: true})})
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid

    let userWithPlaces;
    try {
      userWithPlaces = await User.findById(userId).populate('places')
    } catch (error) {
      const err = new HttpError('Fetching places failed, please try again later!', 500)
      return next(err)
    }
    if(!userWithPlaces || userWithPlaces.places.length === 0){
      return next(new HttpError('Couldn\'t find a place for this provided user id.', 404))
    }
    res.json({places: userWithPlaces.places.map(place => place.toObject({getters: true}))})

}

const createPlace = async(req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return next(new HttpError('Invalid inputs passed, please check your data.', 422))
  }

  const {title, description, address} = req.body
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }
  
  const createdPlace = new Place({
    title,
    description,
    address,
    creator: req.userData.userId,
    location: coordinates,
    image: req.file.path
  })

  let user;
  try {
    user = await User.findById(req.userData.userId)
  } catch (error) {
    return next(new HttpError('creating places failed, try again later.', 500))
  }
  if(!user){
    return next(new HttpError('Couldn\'t find user for provided id.'))
  }
  try {
   const session = await mongoose.startSession()
   await session.withTransaction(async () => {
    await createdPlace.save({session})
    user.places.push(createdPlace)
    await user.save({session})
   })
   session.endSession()
  } catch (error) {
    const errors = new HttpError('Creating place failed, please try again!', 500)
    return next(errors)
  }
  res.status(201).json({place: createdPlace})
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }

  const {title, description} = req.body
  const placeId = req.params.pid
  let place

  try {
    place = await Place.findById(placeId)
  } catch (error) {
    const err = new HttpError('Something went wrong, couldn\'t update place!',500)
    return next(err)
  }
  
  if(place.creator.toString() !== req.userData.userId){
    const err = new HttpError('You\'re not allowed to update this place.', 401)
    return next(err)
  }

  try {
    place = await Place.findByIdAndUpdate(placeId, {title, description}, {new: true})
  } catch (error) {
    const err = new HttpError('Something went wrong, couldn\'t update place!',500)
    return next(err)
  }

  res.json({place: place.toObject({getters: true})})
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid
  let place;
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (error) {
    const err = new HttpError("Deleting a place failed, please try again later.", 500)
    return next(err)
  }
  if(!place){
    return next(new HttpError('Couldn\'t find a place with this id.', 404))
  }
  if(place.creator.id !== req.userData.userId){
    const err = new HttpError('You\'re not allowed to update this place.', 401)
    return next(err)
  }
  const imagePath = place.image
  
  try {
    const session = await mongoose.startSession()
    await session.withTransaction(async () => {
      await place.deleteOne({session})
      place.creator.places.pull(place._id)
      await place.creator.save({session})
    })
    session.endSession()
  } catch (error) {
    const err = new HttpError("Deleting a place failed, please try again later.", 500)
    return next(err)
  }

  fs.unlink(imagePath, err => {console.log(err);
  })

  res.json({message: 'Deleted successfully'})
}

module.exports = {getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace}