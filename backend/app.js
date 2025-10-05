require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const path = require('path')

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const errorHandler = require("./utils/error-handler");
const HttpError = require("./utils/http-error");

const app = express();

app.use(express.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// a

app.use((req, res) => {
  throw new HttpError("Couldn't find this route.", 404);
});

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000))
  .catch((e) => console.log(e));
