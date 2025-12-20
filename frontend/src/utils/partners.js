export const defaultPartners = [
  { id: 1, name: 'Kent RO', price3Months: 1500 },
  { id: 2, name: 'Aquaguard', price3Months: 1200 },
  { id: 3, name: 'Pureit', price3Months: 1000 },
  { id: 4, name: 'Livpure', price3Months: 1300 },
  { id: 5, name: 'Blue Star', price3Months: 1400 },
];

export const getPartners = () => {
  const partners = localStorage.getItem('partners');
  return partners ? JSON.parse(partners) : defaultPartners;
};

export const savePartners = (partners) => {
  localStorage.setItem('partners', JSON.stringify(partners));
};

export const addPartner = (partner) => {
  const partners = getPartners();
  const newPartner = {
    ...partner,
    id: Date.now(),
  };
  partners.push(newPartner);
  savePartners(partners);
  return newPartner;
};

export const deletePartner = (id) => {
  const partners = getPartners();
  const filtered = partners.filter(p => p.id !== id);
  savePartners(filtered);
};

export const calculatePrice = (price3Months, plan) => {
  const months = parseInt(plan);
  return price3Months * (months / 3);
};

export const initializePartners = () => {
  const existing = localStorage.getItem('partners');
  if (!existing) {
    localStorage.setItem('partners', JSON.stringify(defaultPartners));
  }
};
