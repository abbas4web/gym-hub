import { Client, Receipt, MembershipType } from '@/types/client';

const CLIENTS_KEY = 'gym_clients';
const RECEIPTS_KEY = 'gym_receipts';

export const getMembershipDuration = (type: MembershipType): number => {
  switch (type) {
    case 'monthly': return 1;
    case 'quarterly': return 3;
    case 'yearly': return 12;
  }
};

export const getMembershipFee = (type: MembershipType): number => {
  switch (type) {
    case 'monthly': return 1500;
    case 'quarterly': return 4000;
    case 'yearly': return 15000;
  }
};

export const getClients = (): Client[] => {
  const data = localStorage.getItem(CLIENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveClient = (client: Client): void => {
  const clients = getClients();
  const existingIndex = clients.findIndex(c => c.id === client.id);
  if (existingIndex >= 0) {
    clients[existingIndex] = client;
  } else {
    clients.push(client);
  }
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const deleteClient = (id: string): void => {
  const clients = getClients().filter(c => c.id !== id);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const getReceipts = (): Receipt[] => {
  const data = localStorage.getItem(RECEIPTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  receipts.push(receipt);
  localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
};

export const calculateEndDate = (startDate: string, membershipType: MembershipType): string => {
  const start = new Date(startDate);
  const months = getMembershipDuration(membershipType);
  start.setMonth(start.getMonth() + months);
  return start.toISOString().split('T')[0];
};

export const isClientActive = (endDate: string): boolean => {
  return new Date(endDate) >= new Date();
};
