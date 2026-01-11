import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Client, Receipt } from '@/types/models';
import { clientAPI, receiptAPI } from '@/services/api.service';
import { isClientActive } from '@/utils/membership.utils';
import { useAuth } from './AuthContext';

interface ClientContextType {
  clients: Client[];
  receipts: Receipt[];
  isLoading: boolean;
  addClient: (clientData: Omit<Client, 'id' | 'createdAt' | 'isActive'> & { endDate?: string; fee?: number }) => Promise<any>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
  renewMembership: (id: string, membershipType: string) => Promise<void>;
  searchClients: (query: string) => Client[];
  refreshData: () => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within ClientProvider');
  }
  return context;
};

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Clear data when user logs out
      setClients([]);
      setReceipts([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [clientsResponse, receiptsResponse] = await Promise.all([
        clientAPI.getAll(),
        receiptAPI.getAll()
      ]);

      if (clientsResponse.success) {
        // Update is_active status and convert snake_case to camelCase
        const updatedClients = clientsResponse.clients.map((client: any) => ({
          id: client.id,
          name: client.name,
          phone: client.phone,
          email: client.email,
          photo: client.photo,
          adharPhoto: client.adhar_photo, // Convert snake_case to camelCase
          membershipType: client.membership_type,
          startDate: client.start_date,
          endDate: client.end_date,
          fee: client.fee,
          isActive: isClientActive(client.end_date),
          terms_accepted: client.terms_accepted,
          terms_accepted_at: client.terms_accepted_at,
          createdAt: client.created_at
        }));
        setClients(updatedClients);
      }

      if (receiptsResponse.success) {
        // Convert snake_case to camelCase for receipts
        const updatedReceipts = receiptsResponse.receipts.map((receipt: any) => ({
          id: receipt.id,
          clientId: receipt.client_id,
          clientName: receipt.client_name,
          amount: receipt.amount,
          membershipType: receipt.membership_type,
          startDate: receipt.start_date,
          endDate: receipt.end_date,
          generatedAt: receipt.generated_at
        }));
        setReceipts(updatedReceipts);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty arrays on error so app doesn't crash
      setClients([]);
      setReceipts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'isActive'> & { endDate?: string; fee?: number }) => {
    try {
      const response = await clientAPI.add({
        name: clientData.name,
        phone: clientData.phone,
        email: clientData.email,
        photo: clientData.photo,
        adhar_photo: clientData.adharPhoto, // Convert camelCase to snake_case for backend
        membershipType: clientData.membershipType,
        startDate: clientData.startDate,
        endDate: clientData.endDate,  // Pass endDate
        fee: clientData.fee,            // Pass fee
      });

      if (response.success) {
        // Transform client data from snake_case to camelCase
        const transformedClient = {
          id: response.client.id || response.client._id,
          name: response.client.name,
          phone: response.client.phone,
          email: response.client.email,
          photo: response.client.photo,
          adharPhoto: response.client.adhar_photo, // Convert snake_case to camelCase
          membershipType: response.client.membership_type,
          startDate: response.client.start_date,
          endDate: response.client.end_date,
          fee: response.client.fee,
          isActive: response.client.is_active === 1,
          terms_accepted: response.client.terms_accepted,
          terms_accepted_at: response.client.terms_accepted_at,
          createdAt: response.client.created_at
        };
        
        setClients(prev => [transformedClient, ...prev]);
        
        let transformedReceipt: Receipt | undefined;
        if (response.receipt) {
          // Transform receipt data
          transformedReceipt = {
            id: response.receipt.id || response.receipt._id,
            clientId: response.receipt.client_id || response.receipt.clientId,
            clientName: response.receipt.client_name,
            amount: response.receipt.amount,
            membershipType: response.receipt.membership_type,
            startDate: response.receipt.start_date,
            endDate: response.receipt.end_date,
            generatedAt: response.receipt.generated_at,
            receipt_url: response.receipt.receipt_url || response.receipt.url || response.receipt.link || response.receipt.pdf_url
          };
          setReceipts(prev => [transformedReceipt!, ...prev]);
        }

        return { 
          success: true, 
          client: transformedClient, 
          receipt: transformedReceipt,
          whatsappMessage: response.whatsapp_message 
        };
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add client');
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const response = await clientAPI.update(id, updates);

      if (response.success && response.client) {
        // Transform backend response from snake_case to camelCase
        const transformedClient: Client = {
          ...response.client,
          adharPhoto: response.client.adhar_photo || response.client.adharPhoto,
          membershipType: response.client.membership_type || response.client.membershipType,
          startDate: response.client.start_date || response.client.startDate,
          endDate: response.client.end_date || response.client.endDate,
          createdAt: response.client.created_at || response.client.createdAt,
          isActive: response.client.is_active !== undefined ? response.client.is_active : response.client.isActive,
          terms_accepted: response.client.terms_accepted,
          terms_accepted_at: response.client.terms_accepted_at
        };
        
        setClients(prev => prev.map(c => c.id === id ? transformedClient : c));
      } else {
        throw new Error(response.error || 'Failed to update client');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update client');
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const response = await clientAPI.delete(id);
      
      if (response.success) {
        setClients(prev => prev.filter(c => c.id !== id));
        // Also remove receipts for this client
        setReceipts(prev => prev.filter(r => r.clientId !== id));
      } else {
        throw new Error(response.error || 'Failed to delete client');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete client');
    }
  };

  const deleteReceipt = async (id: string) => {
    try {
      const response = await receiptAPI.delete(id);
      
      if (response.success) {
        setReceipts(prev => prev.filter(r => r.id !== id));
      } else {
        throw new Error(response.error || 'Failed to delete receipt');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete receipt');
    }
  };

  const renewMembership = async (id: string, membershipType: string) => {
    try {
      const response = await clientAPI.renew(id, membershipType);

      if (response.success) {
        setClients(prev => prev.map(c => c.id === id ? response.client : c));
        if (response.receipt) {
          setReceipts(prev => [response.receipt, ...prev]);
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to renew membership');
    }
  };

  const searchClients = (query: string): Client[] => {
    if (!query.trim()) return clients;

    const lowerQuery = query.toLowerCase();
    return clients.filter(client =>
      client.name.toLowerCase().includes(lowerQuery) ||
      client.phone.includes(query) ||
      client.email?.toLowerCase().includes(lowerQuery)
    );
  };

  const refreshData = async () => {
    await loadData();
  };

  const clearData = () => {
    setClients([]);
    setReceipts([]);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        receipts,
        isLoading,
        addClient,
        updateClient,
        deleteClient,
        deleteReceipt,
        renewMembership,
        searchClients,
        refreshData
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
