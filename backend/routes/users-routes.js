const express = require("express");
const { check } = require("express-validator");

const { getUsers, login, signup } = require("../controllers/users-controllers");
const fileUpload = require("./../middlewares/file-upload");

const router = express.Router();

/* GET all users */
/* #swagger.tags = ['Users'] */
router.get("/", getUsers);

/* Login */
/* #swagger.tags = ['Users'] */
router.post("/login", login);

/* Signup */
/* #swagger.tags = ['Users'] */
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

module.exports = router;
