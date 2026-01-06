import { MembershipType, Client } from '@/types/models';

// Simple UUID generator for React Native
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get membership duration in months
 */
export const getMembershipDuration = (type: MembershipType): number => {
  switch (type) {
    case 'monthly':
      return 1;
    case 'quarterly':
      return 3;
    case 'yearly':
      return 12;
    default:
      return 1;
  }
};

/**
 * Get membership fee in rupees
 */
export const getMembershipFee = (type: MembershipType): number => {
  switch (type) {
    case 'monthly':
      return 1500;
    case 'quarterly':
      return 4000;
    case 'yearly':
      return 15000;
    default:
      return 1500;
  }
};

/**
 * Calculate end date based on start date and membership type
 */
export const calculateEndDate = (startDate: string, membershipType: MembershipType | string): string => {
  const start = new Date(startDate);
  
  // Normalize the membership type to lowercase for comparison
  const normalizedType = typeof membershipType === 'string' ? membershipType.toLowerCase() : membershipType;
  
  // Get duration in months based on type
  let months = 1; // default to monthly
  
  if (normalizedType === 'monthly') {
    months = 1;
  } else if (normalizedType === 'quarterly') {
    months = 3;
  } else if (normalizedType === 'yearly') {
    months = 12;
  }
  
  // Add months to start date
  const end = new Date(start);
  end.setMonth(end.getMonth() + months);
  
  return end.toISOString();
};

/**
 * Check if client membership is active
 */
export const isClientActive = (endDate: string): boolean => {
  const end = new Date(endDate);
  const now = new Date();
  return end > now;
};

/**
 * Get clients expiring within specified days
 */
export const getExpiringClients = (clients: Client[], daysThreshold: number = 7): Client[] => {
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  return clients.filter(client => {
    const endDate = new Date(client.endDate);
    return endDate > now && endDate <= thresholdDate;
  });
};

/**
 * Get expired clients within last N days
 */
export const getExpiredClients = (clients: Client[], daysBack: number = 30): Client[] => {
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysBack);
  
  return clients.filter(client => {
    const endDate = new Date(client.endDate);
    return endDate < now && endDate >= thresholdDate;
  });
};

/**
 * Generate unique receipt ID
 */
export const generateReceiptId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `RCP-${timestamp}-${random}`;
};

/**
 * Generate unique client ID
 */
export const generateClientId = (): string => {
  return generateUUID();
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Get days until expiry
 */
export const getDaysUntilExpiry = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Get membership type display name
 */
export const getMembershipTypeName = (type: MembershipType): string => {
  switch (type) {
    case 'monthly':
      return 'Monthly';
    case 'quarterly':
      return 'Quarterly';
    case 'yearly':
      return 'Yearly';
    case 'custom':
      return 'Custom';
    default:
      return type;
  }
};
