import { useState, useEffect } from 'react';
import { Client, Receipt } from '@/types/client';
import { getClients, saveClient, deleteClient, getReceipts, saveReceipt } from '@/lib/clientStore';
import BottomNav from '@/components/BottomNav';
import Dashboard from '@/components/Dashboard';
import ClientsList from '@/components/ClientsList';
import ReceiptsList from '@/components/ReceiptsList';
import SettingsPage from '@/components/SettingsPage';
import AddClientModal from '@/components/AddClientModal';
import ClientDetailModal from '@/components/ClientDetailModal';
import ReceiptModal from '@/components/ReceiptModal';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setClients(getClients());
    setReceipts(getReceipts());
  }, []);

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            clients={clients} 
            onAddClient={() => setIsAddClientOpen(true)}
            onClientClick={setSelectedClient}
          />
        );
      case 'clients':
        return (
          <ClientsList 
            clients={clients}
            onAddClient={() => setIsAddClientOpen(true)}
            onClientClick={setSelectedClient}
          />
        );
      case 'receipts':
        return (
          <ReceiptsList 
            receipts={receipts}
            onReceiptClick={setSelectedReceipt}
          />
        );
      case 'settings':
        return <SettingsPage />;
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
        <main className="max-w-md mx-auto px-4 pt-6">
          {renderContent()}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

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
