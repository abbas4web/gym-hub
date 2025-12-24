export type MembershipType = 'monthly' | 'quarterly' | 'yearly';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
  membershipType: MembershipType;
  startDate: string;
  endDate: string;
  fee: number;
  isActive: boolean;
  createdAt: string;
}

export interface Receipt {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  membershipType: MembershipType;
  startDate: string;
  endDate: string;
  generatedAt: string;
}
