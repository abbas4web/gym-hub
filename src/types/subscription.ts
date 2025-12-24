export type PlanType = 'free' | 'pro' | 'business';
export type BillingCycle = 'monthly' | 'yearly';

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    maxClients: number;
    smsNotifications: boolean;
    analytics: boolean;
    brandedReceipts: boolean;
    pdfExport: boolean;
    multiStaff: boolean;
    prioritySupport: boolean;
  };
  popular?: boolean;
}

export interface Subscription {
  planId: PlanType;
  billingCycle: BillingCycle;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodEnd: string;
  clientsUsed: number;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Up to 10 clients',
      'Basic receipts',
      'Client management',
      'Dashboard overview',
    ],
    limits: {
      maxClients: 10,
      smsNotifications: false,
      analytics: false,
      brandedReceipts: false,
      pdfExport: false,
      multiStaff: false,
      prioritySupport: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing gyms',
    monthlyPrice: 499,
    yearlyPrice: 4999,
    popular: true,
    features: [
      'Unlimited clients',
      'SMS & WhatsApp notifications',
      'Branded receipts',
      'Basic analytics',
      'Email support',
    ],
    limits: {
      maxClients: Infinity,
      smsNotifications: true,
      analytics: true,
      brandedReceipts: true,
      pdfExport: false,
      multiStaff: false,
      prioritySupport: false,
    },
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For professional gyms',
    monthlyPrice: 999,
    yearlyPrice: 9999,
    features: [
      'Everything in Pro',
      'PDF receipt export',
      'Advanced analytics',
      'Multi-staff accounts',
      'Priority support',
      'Custom branding',
    ],
    limits: {
      maxClients: Infinity,
      smsNotifications: true,
      analytics: true,
      brandedReceipts: true,
      pdfExport: true,
      multiStaff: true,
      prioritySupport: true,
    },
  },
];
