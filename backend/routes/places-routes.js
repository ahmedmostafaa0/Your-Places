const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middlewares/file-upload");
const checkAuth = require("../middlewares/chech-auth");

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controllers");

const router = express.Router();

/* #swagger.tags = ['Places'] */
router.get("/:pid", getPlaceById);

/* #swagger.tags = ['Places'] */
router.get("/user/:uid", getPlacesByUserId);

// Protect the rest of the routes
router.use(checkAuth);

/* #swagger.tags = ['Places'] */
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

/* #swagger.tags = ['Places'] */
router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  updatePlace
);

/* #swagger.tags = ['Places'] */
router.delete("/:pid", deletePlace);

module.exports = router;
