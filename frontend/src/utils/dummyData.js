export const dummyCustomers = [
  {
    id: 1001,
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@email.com',
    address: 'Flat 301, Green Valley Apartments, Banjara Hills, Hyderabad - 500034',
    plan: '12',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 1002,
    name: 'Priya Sharma',
    phone: '+91 9123456789',
    email: 'priya.sharma@email.com',
    address: 'House No 45, Jubilee Hills, Hyderabad - 500033',
    plan: '6',
    startDate: '2024-06-10',
    endDate: '2024-12-10',
    createdAt: '2024-06-10T11:30:00.000Z'
  },
  {
    id: 1003,
    name: 'Amit Patel',
    phone: '+91 9988776655',
    email: 'amit.patel@email.com',
    address: 'Plot 12, Gachibowli, Hyderabad - 500032',
    plan: '3',
    startDate: '2024-09-20',
    endDate: '2024-12-20',
    createdAt: '2024-09-20T09:15:00.000Z'
  },
  {
    id: 1004,
    name: 'Sneha Reddy',
    phone: '+91 9876512345',
    email: 'sneha.reddy@email.com',
    address: 'Villa 8, Kondapur, Hyderabad - 500084',
    plan: '12',
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    createdAt: '2024-02-01T14:20:00.000Z'
  },
  {
    id: 1005,
    name: 'Vikram Singh',
    phone: '+91 9123498765',
    email: 'vikram.singh@email.com',
    address: 'Flat 502, Madhapur, Hyderabad - 500081',
    plan: '6',
    startDate: '2024-07-15',
    endDate: '2025-01-15',
    createdAt: '2024-07-15T16:45:00.000Z'
  },
  {
    id: 1006,
    name: 'Ananya Iyer',
    phone: '+91 9876501234',
    email: 'ananya.iyer@email.com',
    address: 'Apartment 201, Kukatpally, Hyderabad - 500072',
    plan: '3',
    startDate: '2024-09-25',
    endDate: '2024-12-25',
    createdAt: '2024-09-25T10:30:00.000Z'
  },
  {
    id: 1007,
    name: 'Karthik Rao',
    phone: '+91 9988112233',
    email: 'karthik.rao@email.com',
    address: 'House 15, Miyapur, Hyderabad - 500049',
    plan: '12',
    startDate: '2024-03-10',
    endDate: '2025-03-10',
    createdAt: '2024-03-10T12:00:00.000Z'
  },
  {
    id: 1008,
    name: 'Divya Menon',
    phone: '+91 9123445566',
    email: 'divya.menon@email.com',
    address: 'Flat 405, Ameerpet, Hyderabad - 500016',
    plan: '6',
    startDate: '2024-08-01',
    endDate: '2025-02-01',
    createdAt: '2024-08-01T15:30:00.000Z'
  }
];

export const initializeDummyData = () => {
  const existing = localStorage.getItem('customers');
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem('customers', JSON.stringify(dummyCustomers));
  }
};
