# MVR Groups Backend

Backend API for MVR Groups Real Estate Management System.

## Features

- Customer management API
- Agent management API
- Authentication and authorization
- MongoDB database integration
- Recycle bin functionality

## Setup Instructions

### Environment Variables

Create a `.env` file with:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Clear Old Database Schema

If you're getting validation errors about old fields, run:

```bash
node clearDB.js
```

This will drop the old collections and allow the new schema to work.

## Start Backend Server

```bash
npm start
```

The server will run on http://localhost:5000

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
