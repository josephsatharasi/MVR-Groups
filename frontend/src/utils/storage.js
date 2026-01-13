const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Frontend-only customer management using localStorage
export const getCustomers = async () => {
  try {
    const customers = localStorage.getItem('customers');
    return customers ? JSON.parse(customers) : [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const addCustomer = async (customer) => {
  try {
    const customers = await getCustomers();
    const newCustomer = { ...customer, id: Date.now().toString(), _id: Date.now().toString(), createdAt: new Date().toISOString() };
    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));
    return newCustomer;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id, data) => {
  try {
    const customers = await getCustomers();
    const index = customers.findIndex(c => c.id === id || c._id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...data };
      localStorage.setItem('customers', JSON.stringify(customers));
      return customers[index];
    }
    throw new Error('Customer not found');
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const customers = await getCustomers();
    const filtered = customers.filter(c => c.id !== id && c._id !== id);
    localStorage.setItem('customers', JSON.stringify(filtered));
    return { message: 'Customer deleted' };
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const searchCustomers = async (name) => {
  try {
    const customers = await getCustomers();
    return customers.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
  } catch (error) {
    console.error('Error searching customers:', error);
    return [];
  }
};