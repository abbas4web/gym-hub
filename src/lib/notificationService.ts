import { Client } from '@/types/client';

export type NotificationType = 'sms' | 'whatsapp' | 'both';

export interface NotificationResult {
  success: boolean;
  type: NotificationType;
  message: string;
  clientName: string;
  phone: string;
}

// Simulated notification service - in production, this would call Twilio API
export const sendExpiryNotification = async (
  client: Client,
  type: NotificationType
): Promise<NotificationResult[]> => {
  const results: NotificationResult[] = [];
  const daysUntilExpiry = Math.ceil(
    (new Date(client.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const message = daysUntilExpiry <= 0
    ? `Hi ${client.name}, your gym membership has expired. Please renew to continue your fitness journey!`
    : `Hi ${client.name}, your gym membership expires in ${daysUntilExpiry} day(s). Renew now to avoid interruption!`;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (type === 'sms' || type === 'both') {
    console.log(`[SIMULATED SMS] To: ${client.phone} - ${message}`);
    results.push({
      success: true,
      type: 'sms',
      message,
      clientName: client.name,
      phone: client.phone
    });
  }

  if (type === 'whatsapp' || type === 'both') {
    console.log(`[SIMULATED WHATSAPP] To: ${client.phone} - ${message}`);
    results.push({
      success: true,
      type: 'whatsapp',
      message,
      clientName: client.name,
      phone: client.phone
    });
  }

  return results;
};

export const getExpiringClients = (clients: Client[], daysThreshold: number = 7): Client[] => {
  const today = new Date();
  return clients.filter(client => {
    const endDate = new Date(client.endDate);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= daysThreshold && daysUntilExpiry >= -30; // Include recently expired
  });
};

export const formatNotificationType = (type: NotificationType): string => {
  switch (type) {
    case 'sms': return 'SMS';
    case 'whatsapp': return 'WhatsApp';
    case 'both': return 'SMS & WhatsApp';
  }
};
