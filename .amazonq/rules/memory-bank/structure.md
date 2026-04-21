# MVR Groups - Project Structure

## Project Architecture
MVR Groups follows a full-stack architecture with separate frontend and backend applications, designed for scalability and maintainability.

## Directory Structure

### Root Level
```
MVR groups/
├── backend/           # Node.js/Express API server
├── frontend/          # React.js web application
├── DEPLOYMENT_GUIDE.md # Deployment instructions
└── LICENSE           # Project license
```

## Backend Structure (`/backend`)

### Core Architecture
- **MVC Pattern**: Model-View-Controller architecture
- **RESTful API**: Standard REST endpoints for all operations
- **Middleware-based**: Authentication and request processing

### Directory Organization
```
backend/
├── config/           # Database and application configuration
│   └── db.js        # MongoDB connection setup
├── middleware/       # Express middleware functions
│   └── auth.js      # JWT authentication middleware
├── models/          # Mongoose data models
│   ├── Cadre.js     # Agent/employee model
│   ├── CadreIncome.js # Agent income tracking
│   ├── Customer.js   # Customer data model
│   ├── DeletedCadre.js # Soft-deleted agents
│   ├── DeletedCustomer.js # Soft-deleted customers
│   └── User.js      # User authentication model
├── routes/          # API route handlers
│   ├── auth.js      # Authentication endpoints
│   ├── bin.js       # Recycle bin operations
│   ├── cadres.js    # Agent management endpoints
│   ├── customers.js # Customer management endpoints
│   └── income.js    # Income tracking endpoints
├── server.js        # Main application entry point
├── clearDB.js       # Database cleanup utility
└── ecosystem.config.js # PM2 process management
```

### Key Components
- **Database Layer**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with bcrypt password hashing
- **API Layer**: Express.js with CORS support
- **Process Management**: PM2 configuration for production

## Frontend Structure (`/frontend`)

### Architecture Pattern
- **Component-based**: Reusable React components
- **Page-based Routing**: React Router for navigation
- **Utility-first CSS**: Tailwind CSS for styling

### Directory Organization
```
frontend/
├── public/          # Static assets and HTML template
│   ├── index.html   # Main HTML template
│   ├── logo.JPG     # Application logo
│   └── manifest.json # PWA configuration
├── src/
│   ├── assets/      # Static assets (images, fonts)
│   ├── components/  # Reusable UI components
│   │   ├── BarChart.js      # Data visualization
│   │   ├── Button.js        # Custom button component
│   │   ├── CadreDetails.js  # Agent detail view
│   │   ├── CadreIncome.js   # Income display component
│   │   ├── Card.js          # Generic card component
│   │   ├── CircularProgress.js # Loading indicator
│   │   ├── ConfirmModal.js  # Confirmation dialogs
│   │   ├── CountUp.js       # Animated counters
│   │   ├── CustomerDetails.js # Customer detail view
│   │   ├── DateRangeFilter.js # Date filtering
│   │   ├── FormInput.js     # Form input component
│   │   ├── Layout.js        # Main layout wrapper
│   │   ├── LineChart.js     # Line chart visualization
│   │   ├── SearchBar.js     # Search functionality
│   │   ├── StatCard.js      # Statistics display
│   │   └── Table.js         # Data table component
│   ├── pages/       # Application pages/views
│   │   ├── Bin.js           # Recycle bin page
│   │   ├── Caders.js        # Agent management page
│   │   ├── Commission.js    # Commission tracking
│   │   ├── CurrentMonthCustomers.js # Monthly customer view
│   │   ├── Customers.js     # Customer management
│   │   ├── Dashboard.js     # Main dashboard
│   │   ├── ForgotPassword.js # Password recovery
│   │   ├── Login.js         # User authentication
│   │   ├── RecycleBin.js    # Deleted items management
│   │   ├── Register.js      # User registration
│   │   ├── Reports.js       # Business reports
│   │   ├── ResetPassword.js # Password reset
│   │   └── Settings.js      # Application settings
│   ├── utils/       # Utility functions
│   │   └── storage.js # Local storage management
│   ├── App.js       # Main application component
│   └── index.js     # Application entry point
└── tailwind.config.js # Tailwind CSS configuration
```

### Key Components
- **State Management**: React hooks and context
- **HTTP Client**: Axios for API communication
- **Styling**: Tailwind CSS with custom components
- **Charts**: Custom chart components for data visualization
- **PDF Generation**: jsPDF for report generation

## Component Relationships

### Data Flow
1. **Frontend** → API calls → **Backend Routes**
2. **Backend Routes** → **Middleware** (auth) → **Controllers**
3. **Controllers** → **Models** → **Database**
4. **Database** → **Models** → **Controllers** → **Frontend**

### Authentication Flow
1. User login → JWT token generation
2. Token stored in localStorage
3. Token included in API requests
4. Middleware validates token
5. Protected routes accessible

### Business Logic Flow
- **Customer Management**: CRUD operations with soft delete
- **Agent Management**: Performance tracking with income calculation
- **Reporting**: Data aggregation and visualization
- **Recycle Bin**: Soft delete recovery system

## Deployment Architecture
- **Frontend**: Static build deployed to web server
- **Backend**: Node.js server with PM2 process management
- **Database**: MongoDB instance (local or cloud)
- **Environment**: Separate configurations for development/production