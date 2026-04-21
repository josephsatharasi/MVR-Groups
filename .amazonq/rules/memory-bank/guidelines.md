# MVR Groups - Development Guidelines

## Code Quality Standards

### JavaScript Conventions
- **ES6+ Syntax**: Use modern JavaScript features (arrow functions, destructuring, template literals)
- **Module System**: Use ES6 imports/exports for frontend, CommonJS require/module.exports for backend
- **Semicolon Usage**: Consistent semicolon usage (present in backend, optional in frontend)
- **Line Endings**: CRLF (Windows) line endings used throughout the project

### Naming Conventions
- **Files**: PascalCase for React components (`Dashboard.js`, `CustomerDetails.js`)
- **Directories**: lowercase with hyphens (`memory-bank`, kebab-case preferred)
- **Variables**: camelCase for all variables and functions
- **Constants**: UPPER_SNAKE_CASE for environment variables and constants
- **Components**: PascalCase for React component names

### Code Formatting Patterns
- **Indentation**: 2-space indentation consistently used
- **Object Formatting**: Consistent spacing in object literals
- **Array Formatting**: Clean array destructuring and spreading
- **Function Declarations**: Arrow functions preferred for callbacks and short functions

## Structural Conventions

### React Component Structure
```javascript
// Standard component pattern observed:
import React, { useState, useEffect } from 'react';
import { ComponentDependencies } from 'libraries';

function ComponentName() {
  // State declarations first
  const [state, setState] = useState(initialValue);
  
  // Effects after state
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Return JSX
  return (
    <div>
      {/* Component content */}
    </div>
  );
}

export default ComponentName;
```

### Backend Route Structure
```javascript
// Standard Express route pattern:
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Route handlers with middleware
router.get('/endpoint', auth, async (req, res) => {
  try {
    // Route logic
  } catch (error) {
    // Error handling
  }
});

module.exports = router;
```

## Configuration Standards

### Environment Configuration
- **dotenv Usage**: All environment variables loaded via dotenv
- **Environment Files**: Separate .env files for different environments
- **Variable Naming**: Descriptive UPPER_SNAKE_CASE names
- **Default Values**: Fallback values using `|| operator`

### Build Configuration Patterns
- **PostCSS Setup**: Standard Tailwind + Autoprefixer configuration
- **PM2 Configuration**: Production process management with memory limits
- **Package Scripts**: Consistent npm script naming (start, dev, build, test)

### Tailwind CSS Customization
```javascript
// Standard Tailwind config pattern:
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3ea4f0', // Custom brand colors
      },
    },
  },
  plugins: [],
}
```

## Practices Followed Throughout Codebase

### Authentication Patterns
- **JWT Implementation**: Stateless authentication with localStorage persistence
- **Route Protection**: Conditional rendering based on authentication state
- **Middleware Usage**: Consistent auth middleware application on protected routes

### State Management Patterns
- **Local State**: useState for component-level state
- **Persistence**: localStorage for authentication state persistence
- **Effect Management**: useEffect for side effects and data fetching

### Error Handling Conventions
- **Try-Catch Blocks**: Consistent error handling in async operations
- **Toast Notifications**: react-toastify for user feedback
- **Graceful Degradation**: Fallback UI states for error conditions

### API Communication Standards
- **Axios Usage**: Consistent HTTP client for API requests
- **CORS Configuration**: Comprehensive CORS setup with multiple origins
- **Response Format**: Standardized JSON response structure

## Internal API Usage Patterns

### Database Operations
```javascript
// Mongoose model pattern:
const Model = require('../models/ModelName');

// CRUD operations with error handling
const createItem = async (data) => {
  try {
    const item = new Model(data);
    await item.save();
    return item;
  } catch (error) {
    throw error;
  }
};
```

### Component Communication
```javascript
// Props passing pattern:
<ChildComponent 
  data={parentData}
  onAction={handleAction}
  isLoading={loading}
/>

// State lifting for shared state
const [sharedState, setSharedState] = useState();
```

### Route Organization
- **Modular Routes**: Separate route files for different entities
- **Middleware Chain**: auth → validation → controller pattern
- **RESTful Endpoints**: Standard REST conventions for API design

## Frequently Used Code Idioms

### Conditional Rendering
```javascript
// Ternary operator for conditional UI
{isLoggedIn ? <AuthenticatedView /> : <LoginView />}

// Logical AND for optional rendering
{data && <DataDisplay data={data} />}
```

### Array Operations
```javascript
// Map for rendering lists
{items.map(item => <ItemComponent key={item.id} item={item} />)}

// Filter for data processing
const filteredData = data.filter(item => item.active);
```

### Async Operations
```javascript
// Async/await pattern consistently used
const fetchData = async () => {
  try {
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Popular Annotations and Comments

### Documentation Patterns
- **Inline Comments**: Descriptive comments for complex logic
- **Function Documentation**: Brief descriptions for utility functions
- **Configuration Comments**: Explanatory comments in config files
- **TODO Comments**: Marked areas for future improvements

### Import Organization
```javascript
// External libraries first
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Internal components second
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
```

## Performance Optimization Patterns

### Web Vitals Integration
- **Performance Monitoring**: reportWebVitals.js for Core Web Vitals tracking
- **Lazy Loading**: Dynamic imports for code splitting
- **Memory Management**: PM2 memory restart configuration

### Build Optimization
- **Tree Shaking**: ES6 modules for better tree shaking
- **Bundle Splitting**: React Scripts automatic code splitting
- **Asset Optimization**: Tailwind CSS purging for smaller bundles

## Testing Conventions

### Test Setup
- **Jest Configuration**: Standard React Testing Library setup
- **Test Utilities**: Custom matchers from jest-dom
- **Test Organization**: Tests co-located with components

### Testing Patterns
```javascript
// Standard test structure observed:
import { render, screen } from '@testing-library/react';
import Component from './Component';

test('renders component correctly', () => {
  render(<Component />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```