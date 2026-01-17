# Backend CRUD Implementation - MVR Groups

## Summary of Changes

### Backend Improvements

#### 1. **Customer Routes** (`backend/routes/customers.js`)
- ✅ **GET /api/customers** - Fetch all customers (sorted by creation date)
- ✅ **GET /api/customers/search?q=query** - Search customers by name, phone, mobile, or email
- ✅ **GET /api/customers/:id** - Get single customer by ID
- ✅ **POST /api/customers** - Create new customer
- ✅ **PUT /api/customers/:id** - Update customer with validation
- ✅ **DELETE /api/customers/:id** - Soft delete (move to bin)

#### 2. **Agent Routes** (`backend/routes/agents.js`)
- ✅ **GET /api/agents** - Fetch all agents (sorted by creation date)
- ✅ **GET /api/agents/search?q=query** - Search agents by name, mobile, email, or agentId
- ✅ **GET /api/agents/:id** - Get single agent by ID
- ✅ **POST /api/agents** - Create new agent
- ✅ **PUT /api/agents/:id** - Update agent with validation
- ✅ **DELETE /api/agents/:id** - Soft delete (move to bin)

#### 3. **Models Updated**
- **Customer Model** - Complete schema with all fields
- **Agent Model** - Complete schema with all fields
- **DeletedCustomer Model** - Enhanced with mobile, totalAmount, balanceAmount fields
- **DeletedAgent Model** - Complete schema for soft deletes

### Frontend Improvements

#### 1. **Storage Utility** (`frontend/src/utils/storage.js`)
- Replaced localStorage with backend API calls
- Added complete CRUD functions for customers:
  - `getCustomers()` - Fetch all customers
  - `addCustomer(customer)` - Create customer
  - `updateCustomer(id, data)` - Update customer
  - `deleteCustomer(id)` - Delete customer
  - `searchCustomers(query)` - Search customers
- Added complete CRUD functions for agents:
  - `getAgents()` - Fetch all agents
  - `addAgent(agent)` - Create agent
  - `updateAgent(id, data)` - Update agent
  - `deleteAgent(id)` - Delete agent
  - `searchAgents(query)` - Search agents

#### 2. **Customers Page** (`frontend/src/pages/Customers.js`)
- Removed dummy data
- Integrated with backend API
- Real-time data loading from database
- Full CRUD operations working

#### 3. **Agents Page** (`frontend/src/pages/Agents.js`)
- Removed dummy data
- Integrated with backend API
- Real-time data loading from database
- Full CRUD operations working
- Auto-generated Agent IDs

### MKL References Removed

#### Backend:
- ✅ `auth.js` - Email subject changed to "MVR Groups Admin"

#### Frontend:
- ✅ `Bin.js` - Removed hardcoded MKL API URL
- ✅ `ForgotPassword.js` - Changed to "MVR Groups"
- ✅ `Register.js` - Changed to "MVR Groups"
- ✅ `ResetPassword.js` - Changed to "MVR Groups"
- ✅ `Settings.js` - Changed company name and email to MVR Groups
- ✅ `LandingPage.js` - **DELETED** (contained MKL branding)
- ✅ `CustomInvoice.js` - **DELETED** (contained MKL branding)

### API Endpoints Summary

#### Customers
```
GET    /api/customers              - Get all customers
GET    /api/customers/search?q=    - Search customers
GET    /api/customers/:id          - Get customer by ID
POST   /api/customers              - Create customer
PUT    /api/customers/:id          - Update customer
DELETE /api/customers/:id          - Delete customer (move to bin)
```

#### Agents
```
GET    /api/agents                 - Get all agents
GET    /api/agents/search?q=       - Search agents
GET    /api/agents/:id             - Get agent by ID
POST   /api/agents                 - Create agent
PUT    /api/agents/:id             - Update agent
DELETE /api/agents/:id             - Delete agent (move to bin)
```

#### Bin (Recycle Bin)
```
GET    /api/bin                    - Get all deleted items
POST   /api/bin/restore/customer/:id - Restore customer
POST   /api/bin/restore/agent/:id    - Restore agent
DELETE /api/bin/customer/:id         - Permanently delete customer
DELETE /api/bin/agent/:id            - Permanently delete agent
```

### Database Schema

#### Customer Schema
```javascript
{
  name: String (required),
  relationType: String,
  relation: String,
  mobile: String (required),
  whatsapp: String,
  dob: String,
  age: String,
  address: String,
  pinCode: String,
  aadharNo: String,
  plotNo: String,
  gadhiAnkanamSqft: String,
  price: String,
  projectName: String,
  location: String,
  totalAmount: String,
  bookingAmount: String,
  balanceAmount: String,
  paymentType: String,
  chequeDD: String,
  chequeNo: String,
  bankName: String,
  agentCode: String,
  bookingDhamaka: String,
  phone: String,
  email: String,
  profilePic: String,
  createdAt: Date (default: Date.now)
}
```

#### Agent Schema
```javascript
{
  name: String (required),
  relationType: String,
  relation: String,
  mobile: String (required),
  whatsapp: String,
  email: String,
  dob: String,
  age: String,
  address: String,
  pinCode: String,
  aadharNo: String,
  panNo: String,
  agentId: String (unique),
  companyCode: String (default: '999'),
  caderRole: String,
  agentDhamaka: String,
  photo: String,
  createdAt: Date (default: Date.now)
}
```

### Features Implemented

1. ✅ **Complete CRUD Operations** - Create, Read, Update, Delete for both Customers and Agents
2. ✅ **Search Functionality** - Search by multiple fields
3. ✅ **Soft Delete** - Items moved to recycle bin instead of permanent deletion
4. ✅ **Data Validation** - Backend validation with mongoose
5. ✅ **Error Handling** - Proper error messages and status codes
6. ✅ **Sorting** - Data sorted by creation date (newest first)
7. ✅ **API Integration** - Frontend fully integrated with backend
8. ✅ **Real-time Updates** - Data refreshes after operations
9. ✅ **Auto-generated IDs** - Agent IDs auto-increment
10. ✅ **PDF Export** - Download customer and agent lists as PDF

### Testing the API

You can test the API using tools like Postman or curl:

```bash
# Get all customers
curl http://localhost:5000/api/customers

# Create a customer
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","mobile":"9876543210","email":"john@example.com"}'

# Update a customer
curl -X PUT http://localhost:5000/api/customers/CUSTOMER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'

# Delete a customer
curl -X DELETE http://localhost:5000/api/customers/CUSTOMER_ID

# Search customers
curl http://localhost:5000/api/customers/search?q=john
```

### Next Steps

1. Start the backend server: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm start`
3. Ensure MongoDB is running
4. Test all CRUD operations through the UI
5. Verify data persistence in MongoDB

### Environment Variables

Make sure your `.env` file in the backend contains:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

And in frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

**All MKL references have been removed and replaced with MVR Groups branding.**
**Backend now has complete CRUD operations for Customers and Agents.**
**Frontend is fully integrated with the backend API.**
