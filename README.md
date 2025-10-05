# Your-Places 🏞️

Share beautiful places with people around the world.

## Table of Contents

*   [About](#about)
*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Project Structure](#project-structure)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Environment Variables](#environment-variables)
    *   [Running Locally](#running-locally)
*   [API Documentation](#api-documentation)
*   [API Endpoints](#api-endpoints)
*   [Contributing](#contributing)
*   [License](#license)

## About

Your Places is a platform where users can share beautiful or interesting places with others. Users can create, view, update, and delete places, browse places by user, and manage images for places. This project serves as a backend API for managing user authentication and place-related data.

## Features

*   **User Authentication:** Secure signup and login functionality.
*   **Place Management:** Create, read, update, and delete (CRUD) operations for places.
*   **Image Uploads:** Ability to upload images associated with places.
*   **User-Specific Places:** Fetch places created by a specific user.
*   **Protected Routes:** API endpoints secured with authentication middleware.
*   **API Documentation:** Integrated Swagger/OpenAPI documentation for easy API exploration.

## Tech Stack

The project is built using the following technologies:

*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for Node.js.
*   **MongoDB:** NoSQL database (via Mongoose).
*   **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
*   **Express-Validator:** Middleware for request data validation.
*   **Multer:** Middleware for handling `multipart/form-data`, primarily used for file uploads.
*   **JSON Web Token (JWT):** For secure authentication.
*   **Bcrypt.js:** For password hashing.
*   **Dotenv:** To load environment variables from a `.env` file.
*   **Swagger-UI-Express & Swagger-Autogen:** For generating and serving API documentation.

## Project Structure

```
Your-Places/
├── controllers/
│   ├── places-controllers.js
│   └── users-controllers.js
├── middlewares/
│   ├── chech-auth.js
│   └── file-upload.js
├── models/
│   ├── place.js
│   └── user.js
├── routes/
│   ├── places-routes.js
│   └── users-routes.js
├── uploads/images/
├── utils/
│   └── http-error.js
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
├── swagger-output.json
└── swagger.js
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (v14 or higher)
*   npm (Node Package Manager)
*   MongoDB (local installation or cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ahmedmostafaa0/Your-Places.git
    cd Your-Places
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
PORT=5000
DB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
JWT_KEY=supersecret_dont_share
```

*   `PORT`: The port on which the server will run (e.g., `5000`).
*   `DB_URI`: Your MongoDB connection string. Replace `<username>`, `<password>`, `<cluster-name>`, and `<database-name>` with your actual MongoDB credentials and database details.
*   `JWT_KEY`: A secret key used for signing and verifying JSON Web Tokens. Choose a strong, unique key.

### Running Locally

To start the development server, run:

```bash
npm start
```

The API will be accessible at `http://localhost:PORT` (e.g., `http://localhost:5000`).

## API Documentation

Once the server is running, you can access the API documentation (Swagger UI) at:

`http://localhost:PORT/api-docs`

This documentation provides an interactive interface to explore all available API endpoints, their request/response schemas, and allows you to test them directly.

## API Endpoints

Here's a summary of the main API endpoints:

### Users

| Method | Endpoint      | Description                  | Authentication Required |
| :----- | :------------ | :--------------------------- | :---------------------- |
| `GET`  | `/api/users`  | Get all users                | No                      |
| `POST` | `/api/users/signup` | Register a new user          | No                      |
| `POST` | `/api/users/login`  | Log in an existing user      | No                      |

### Places

| Method   | Endpoint                | Description                               | Authentication Required |
| :------- | :---------------------- | :---------------------------------------- | :---------------------- |
| `GET`    | `/api/places/:pid`      | Get a place by ID                         | No                      |
| `GET`    | `/api/places/user/:uid` | Get places created by a specific user     | No                      |
| `POST`   | `/api/places`           | Create a new place                        | Yes                     |
| `PATCH`  | `/api/places/:pid`      | Update an existing place by ID            | Yes                     |
| `DELETE` | `/api/places/:pid`      | Delete a place by ID                      | Yes                     |

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the ISC License.
