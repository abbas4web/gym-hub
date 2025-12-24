import { useState, useEffect } from 'react';
import { Client, Receipt, MembershipType } from '@/types/client';
import { getClients, saveClient, deleteClient, getReceipts, saveReceipt } from '@/lib/clientStore';
import BottomNav from '@/components/BottomNav';
import Dashboard from '@/components/Dashboard';
import ClientsList from '@/components/ClientsList';
import ReceiptsList from '@/components/ReceiptsList';
import SettingsPage from '@/components/SettingsPage';
import NotificationCenter from '@/components/NotificationCenter';
import SubscriptionPage from '@/components/SubscriptionPage';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import AddClientModal from '@/components/AddClientModal';
import ClientDetailModal from '@/components/ClientDetailModal';
import RenewMembershipModal from '@/components/RenewMembershipModal';
import ReceiptModal from '@/components/ReceiptModal';
import ClientLimitBanner from '@/components/ClientLimitBanner';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Helmet } from 'react-helmet';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [renewClient, setRenewClient] = useState<Client | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const { toast } = useToast();
  const { canAddClient } = useSubscription();

  useEffect(() => {
    setClients(getClients());
    setReceipts(getReceipts());
  }, []);

  const handleAddClientClick = () => {
    if (!canAddClient(clients.length)) {
      toast({
        title: "Client Limit Reached",
        description: "Upgrade your plan to add more clients.",
        variant: "destructive",
      });
      setActiveTab('subscription');
      return;
    }
    setIsAddClientOpen(true);
  };

  const handleSaveClient = (client: Client) => {
    saveClient(client);
    setClients(getClients());
    
    // Auto-generate receipt
    const receipt: Receipt = {
      id: Date.now().toString(),
      clientId: client.id,
      clientName: client.name,
      amount: client.fee,
      membershipType: client.membershipType,
      startDate: client.startDate,
      endDate: client.endDate,
      generatedAt: new Date().toISOString(),
    };
    saveReceipt(receipt);
    setReceipts(getReceipts());
    setSelectedReceipt(receipt);

    toast({
      title: "Client Added!",
      description: `${client.name} has been registered successfully.`,
    });
  };

  const handleDeleteClient = (clientId: string) => {
    deleteClient(clientId);
    setClients(getClients());
    toast({
      title: "Client Deleted",
      description: "The client has been removed.",
    });
  };

  const handleGenerateReceipt = (client: Client) => {
    const receipt: Receipt = {
      id: Date.now().toString(),
      clientId: client.id,
      clientName: client.name,
      amount: client.fee,
      membershipType: client.membershipType,
      startDate: client.startDate,
      endDate: client.endDate,
      generatedAt: new Date().toISOString(),
    };
    saveReceipt(receipt);
    setReceipts(getReceipts());
    setSelectedClient(null);
    setSelectedReceipt(receipt);
  };

  const handleRenewMembership = (updatedClient: Client, membershipType: MembershipType) => {
    saveClient(updatedClient);
    setClients(getClients());
    
    // Generate renewal receipt
    const receipt: Receipt = {
      id: Date.now().toString(),
      clientId: updatedClient.id,
      clientName: updatedClient.name,
      amount: updatedClient.fee,
      membershipType: updatedClient.membershipType,
      startDate: updatedClient.startDate,
      endDate: updatedClient.endDate,
      generatedAt: new Date().toISOString(),
    };
    saveReceipt(receipt);
    setReceipts(getReceipts());
    setSelectedClient(null);
    setRenewClient(null);
    setSelectedReceipt(receipt);

    toast({
      title: "Membership Renewed!",
      description: `${updatedClient.name}'s membership has been extended.`,
    });
  };

  const handleOpenRenew = (client: Client) => {
    setSelectedClient(null);
    setRenewClient(client);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <ClientLimitBanner 
              currentClientCount={clients.length} 
              onUpgrade={() => setActiveTab('subscription')} 
            />
            <Dashboard 
              clients={clients} 
              onAddClient={handleAddClientClick}
              onClientClick={setSelectedClient}
            />
          </>
        );
      case 'clients':
        return (
          <>
            <ClientLimitBanner 
              currentClientCount={clients.length} 
              onUpgrade={() => setActiveTab('subscription')} 
            />
            <ClientsList 
              clients={clients}
              onAddClient={handleAddClientClick}
              onClientClick={setSelectedClient}
            />
          </>
        );
      case 'notifications':
        return <NotificationCenter clients={clients} />;
      case 'analytics':
        return <AnalyticsDashboard clients={clients} receipts={receipts} />;
      case 'receipts':
        return (
          <ReceiptsList 
            receipts={receipts}
            onReceiptClick={setSelectedReceipt}
          />
        );
      case 'subscription':
        return <SubscriptionPage onBack={() => setActiveTab('settings')} />;
      case 'settings':
        return <SettingsPage onUpgrade={() => setActiveTab('subscription')} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>FitZone - Gym Management App</title>
        <meta name="description" content="Manage your gym clients, memberships, and generate fee receipts with FitZone gym management app." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0d0f14" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="max-w-md mx-auto px-4 pt-6 space-y-4">
          {renderContent()}
        </main>

        {activeTab !== 'subscription' && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        <AddClientModal
          isOpen={isAddClientOpen}
          onClose={() => setIsAddClientOpen(false)}
          onSave={handleSaveClient}
        />

        <ClientDetailModal
          client={selectedClient}
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          onGenerateReceipt={handleGenerateReceipt}
          onDelete={handleDeleteClient}
          onRenew={handleOpenRenew}
        />

        <RenewMembershipModal
          client={renewClient}
          isOpen={!!renewClient}
          onClose={() => setRenewClient(null)}
          onRenew={handleRenewMembership}
        />

        <ReceiptModal
          receipt={selectedReceipt}
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      </div>
    </>
  );
};

export default Index;
