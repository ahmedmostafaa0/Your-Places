const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const HttpError = require("../utils/http-error");
const User = require('../models/User')


const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password')
  } catch (error) {
    return next(new HttpError('Fetching users failed, please try again later.', 500))
  }
  res.json({ users: users.map(user => user.toObject({getters: true})) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }

  const { name, email, password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 11)
  } catch (error) {
    return next(new HttpError('Signing up failed, try again later.', 500))
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    places: [],
    image: req.file.path
  });

  try {
    await createdUser.save()
  } catch (error) {
    if(error.code === 11000){
      return next(new HttpError('User already exists, try login instead.', 422))
    }
    return next(new HttpError('Signing up failed, try again later.', 500))
  }
  
  let token;
  try {
    token = jwt.sign({userId: createdUser.id, email: createdUser.email}, process.env.JWT_KEY, {expiresIn: '1h'})
  } catch (error) {
    return next(new HttpError('Signing up failed, try again later.', 500))
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({email});
  } catch (error) {
    return next(new HttpError("Logging in failed, please try again later.", 500))
  }

  if (!user) {
    return next(new HttpError(
      "couldn't identify user, credentials seem to be wrong.",
      403
    ));
  }
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, user.password)
  } catch (error) {
    return next(new HttpError('Logging in failed, please try again later.', 500))
  }
  if(!isValidPassword){
    return next(new HttpError('Invalid credentials, couldn\'t log you in.', 422))
  }
  let token;
  try {
    token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_KEY , {expiresIn: '1h'})
  } catch (error) {
    return next(new HttpError('Logging in failed, try again later.', 500))
  }

  res.status(201).json({ userId: user.id, email: user.email, token })
};

module.exports = { getUsers, login, signup };
