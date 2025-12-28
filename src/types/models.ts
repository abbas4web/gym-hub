export type MembershipType = "monthly" | "quarterly" | "yearly" | "custom";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string; // base64 or URI
  membershipType: MembershipType;
  startDate: string; // ISO date
  endDate: string; // ISO date
  fee: number;
  isActive: boolean;
  createdAt: string; // ISO date
}

export interface Receipt {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  membershipType: MembershipType;
  startDate: string;
  endDate: string;
  generatedAt: string; // ISO date
}

export interface MembershipPlan {
  name: string;
  duration: number; // in months
  fee: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // hashed in production
  profile_image?: string; // base64 or URI
  gym_name?: string;
  gym_logo?: string; // base64 or URI
  membership_plans?: MembershipPlan[];
  createdAt: string; // ISO date
}

export type SubscriptionPlan = "free" | "pro" | "business";

export interface Subscription {
  plan: SubscriptionPlan;
  billingCycle: "monthly" | "yearly";
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface SubscriptionPlanDetails {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  clientLimit: number | null; // null = unlimited
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlan,
  SubscriptionPlanDetails
> = {
  free: {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    clientLimit: 10,
    features: [
      "Up to 10 clients",
      "Basic client management",
      "Receipt generation",
    ],
  },
  pro: {
    name: "Pro",
    monthlyPrice: 499,
    yearlyPrice: 4999,
    clientLimit: null,
    features: [
      "Unlimited clients",
      "SMS/WhatsApp notifications",
      "Analytics dashboard",
      "Priority support",
    ],
  },
  business: {
    name: "Business",
    monthlyPrice: 999,
    yearlyPrice: 9999,
    clientLimit: null,
    features: [
      "Everything in Pro",
      "PDF export",
      "Multi-staff access",
      "Advanced analytics",
      "Priority support",
    ],
  },
};
