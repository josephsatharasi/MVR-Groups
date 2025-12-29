# Backend Setup Instructions

## Clear Old Database Schema

If you're getting validation errors about old fields (plan, startDate, endDate, amount), run:

```bash
node clearDB.js
```

This will drop the old customers collection and allow the new schema to work.

## Start Backend Server

```bash
npm start
```

The server will run on http://localhost:5000
