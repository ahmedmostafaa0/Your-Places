const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    title: 'Your Places',
    description: 'Share beautiful places with people around the world.'
  },
  host: 'localhost:5000',
  schemes: ['http'],
  tags: [
    { name: 'Users', description: 'Endpoints related to users' },
    { name: 'Places', description: 'Endpoints related to places' }
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "u1" },
          name: { type: "string", example: "Ahmed Mostafa" },
          email: { type: "string", example: "ahmed@test.com" },
          image: { type: "string", example: "uploads/images/ahmed.jpg" }
        }
      },
      AuthResponse: {
        type: "object",
        properties: {
          userId: { type: "string", example: "u1" },
          token: { type: "string", example: "jwt-token-here" }
        }
      }
    }
  }
};


const outputFile = './swagger-output.json'
const endpointsFiles = ['./routes/places-routes.js', './routes/users-routes.js']

swaggerAutogen(outputFile, endpointsFiles, doc)