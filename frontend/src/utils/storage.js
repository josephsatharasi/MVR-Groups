export const getCustomers = () => {
  const customers = localStorage.getItem('customers');
  return customers ? JSON.parse(customers) : [];
};

export const saveCustomers = (customers) => {
  localStorage.setItem('customers', JSON.stringify(customers));
};

export const addCustomer = (customer) => {
  const customers = getCustomers();
  const newCustomer = {
    ...customer,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  customers.push(newCustomer);
  saveCustomers(customers);
  return newCustomer;
};

export const updateCustomer = (id, updatedData) => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updatedData };
    saveCustomers(customers);
  }
};

export const deleteCustomer = (id) => {
  const customers = getCustomers();
  const filtered = customers.filter(c => c.id !== id);
  saveCustomers(filtered);
};

export const calculateEndDate = (startDate, plan) => {
  const start = new Date(startDate);
  const months = plan === '3' ? 3 : plan === '6' ? 6 : 12;
  start.setMonth(start.getMonth() + months);
  return start.toISOString().split('T')[0];
};

export const getDaysUntilExpiry = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
