const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Customer API calls
export const getCustomers = async () => {
  try {
    const response = await fetch(`${API_URL}/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const addCustomer = async (customer) => {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    if (!response.ok) throw new Error('Failed to add customer');
    return await response.json();
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update customer');
    return await response.json();
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    return await response.json();
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const searchCustomers = async (query) => {
  try {
    const response = await fetch(`${API_URL}/customers/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search customers');
    return await response.json();
  } catch (error) {
    console.error('Error searching customers:', error);
    return [];
  }
};

// Agent API calls
export const getAgents = async () => {
  try {
    const response = await fetch(`${API_URL}/agents`);
    if (!response.ok) throw new Error('Failed to fetch agents');
    return await response.json();
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
};

export const addAgent = async (agent) => {
  try {
    const response = await fetch(`${API_URL}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add agent');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding agent:', error);
    throw error;
  }
};

export const updateAgent = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/agents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update agent');
    return await response.json();
  } catch (error) {
    console.error('Error updating agent:', error);
    throw error;
  }
};

export const deleteAgent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/agents/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete agent');
    return await response.json();
  } catch (error) {
    console.error('Error deleting agent:', error);
    throw error;
  }
};

export const searchAgents = async (query) => {
  try {
    const response = await fetch(`${API_URL}/agents/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search agents');
    return await response.json();
  } catch (error) {
    console.error('Error searching agents:', error);
    return [];
  }
};