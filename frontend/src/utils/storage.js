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




// Cadre API calls
export const getCadres = async () => {
  try {
    const response = await fetch(`${API_URL}/cadres`);
    if (!response.ok) throw new Error('Failed to fetch cadres');
    return await response.json();
  } catch (error) {
    console.error('Error fetching cadres:', error);
    return [];
  }
};

export const addCadre = async (cadre) => {
  try {
    const response = await fetch(`${API_URL}/cadres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cadre)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add cadre');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding cadre:', error);
    throw error;
  }
};

export const updateCadre = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/cadres/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update cadre');
    return await response.json();
  } catch (error) {
    console.error('Error updating cadre:', error);
    throw error;
  }
};

export const deleteCadre = async (id) => {
  try {
    const response = await fetch(`${API_URL}/cadres/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete cadre');
    return await response.json();
  } catch (error) {
    console.error('Error deleting cadre:', error);
    throw error;
  }
};
