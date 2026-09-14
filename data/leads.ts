export type LeadRecord = {
  id: string;
  name: string;
  phone: string;
  source: string;
  category: string;
  product: string;
  size: string;
  colour: string;
  budget: string;
  intent: string;
  status: string;
  followUp: string;
  createdAt: string;
};

export const demoLead: LeadRecord = {
  id: 'CL-1042',
  name: 'Sara A.',
  phone: '+965 5XX XXX XX',
  source: 'Instagram',
  category: 'Dresses',
  product: 'Luna Satin Dress',
  size: 'M',
  colour: 'Black',
  budget: 'KWD 45–70',
  intent: 'Save / recovery',
  status: 'Follow-up scheduled',
  followUp: '2h product reminder',
  createdAt: 'Just now'
};
