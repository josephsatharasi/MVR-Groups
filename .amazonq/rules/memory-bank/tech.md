# MVR Groups - Technology Stack

## Programming Languages
- **JavaScript (ES6+)**: Primary language for both frontend and backend
- **HTML5**: Markup for web interface
- **CSS3**: Styling with Tailwind CSS framework

## Backend Technology Stack

### Runtime & Framework
- **Node.js**: JavaScript runtime environment
- **Express.js v4.18.2**: Web application framework
- **Mongoose v8.0.0**: MongoDB object modeling

### Authentication & Security
- **JSON Web Tokens (JWT) v9.0.3**: Stateless authentication
- **bcryptjs v3.0.3**: Password hashing and encryption
- **CORS v2.8.5**: Cross-origin resource sharing

### Communication & Notifications
- **Nodemailer v6.9.7**: Email service integration
- **Twilio v5.11.2**: SMS and communication services

### Development Tools
- **Nodemon v3.0.1**: Development server auto-restart
- **dotenv v16.3.1**: Environment variable management

### Process Management
- **PM2**: Production process management (ecosystem.config.js)

## Frontend Technology Stack

### Core Framework
- **React v19.2.3**: Component-based UI library
- **React DOM v19.2.3**: DOM rendering for React
- **React Router DOM v7.11.0**: Client-side routing

### Styling & UI
- **Tailwind CSS v3.4.19**: Utility-first CSS framework
- **Autoprefixer v10.4.23**: CSS vendor prefixing
- **PostCSS**: CSS processing tool
- **Lucide React v0.562.0**: Icon library

### HTTP & Data Management
- **Axios v1.13.2**: HTTP client for API requests
- **React Toastify v11.0.5**: Toast notifications

### PDF & Reporting
- **jsPDF v3.0.4**: PDF generation library
- **jsPDF AutoTable v5.0.7**: Table generation for PDFs

### Testing Framework
- **Jest**: JavaScript testing framework (via React Scripts)
- **React Testing Library v16.3.1**: React component testing
- **Testing Library Jest DOM v6.9.1**: Custom Jest matchers
- **Testing Library User Event v13.5.0**: User interaction simulation

### Performance Monitoring
- **Web Vitals v2.1.4**: Core web vitals measurement

### Build Tools
- **React Scripts v5.0.1**: Build configuration and scripts
- **Webpack**: Module bundler (via React Scripts)
- **Babel**: JavaScript transpiler (via React Scripts)

## Database Technology
- **MongoDB**: NoSQL document database
- **Mongoose ODM**: Object Document Mapping for MongoDB

## Development Environment

### Package Management
- **npm**: Node Package Manager
- **package-lock.json**: Dependency version locking

### Environment Configuration
- **.env files**: Environment-specific configuration
- **dotenv**: Environment variable loading

### Version Control
- **Git**: Version control system
- **.gitignore**: Git ignore patterns

## Development Commands

### Backend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Clear database (development)
node clearDB.js
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (not recommended)
npm run eject
```

## Build Configuration

### Frontend Build Process
- **React Scripts**: Handles Webpack, Babel, and ESLint configuration
- **Tailwind CSS**: Utility-first CSS compilation
- **PostCSS**: CSS processing and optimization
- **Code Splitting**: Automatic bundle optimization

### Backend Configuration
- **ES6 Modules**: Modern JavaScript module system
- **Environment Variables**: Secure configuration management
- **CORS Configuration**: Cross-origin request handling

## Browser Support

### Production Targets
- **Modern Browsers**: >0.2% usage, not dead, not Opera Mini

### Development Targets
- **Latest Versions**: Chrome, Firefox, Safari

## Deployment Requirements

### System Requirements
- **Node.js**: v14+ recommended
- **MongoDB**: v4.4+ recommended
- **npm**: v6+ recommended

### Environment Variables
```
# Backend
MONGODB_URI=mongodb_connection_string
JWT_SECRET=jwt_secret_key
PORT=5000

# Frontend
REACT_APP_API_URL=backend_api_url
```

### Production Considerations
- **PM2**: Process management for backend
- **Static Hosting**: Frontend build deployment
- **Database**: MongoDB Atlas or self-hosted
- **SSL/TLS**: HTTPS configuration recommended