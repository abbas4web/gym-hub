import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Plus, Trash2, X } from 'lucide-react-native';
import { styled } from 'nativewind';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { workerAPI } from '@/services/api.service';
import { usePopup } from '@/hooks/usePopup';
import CustomPopup from '@/components/CustomPopup';

const StyledUsers = styled(Users);
const StyledPlus = styled(Plus);
const StyledTrash2 = styled(Trash2);
const StyledX = styled(X);

interface Worker {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ManageStaffScreen = ({ navigation }: any) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { popupState, showSuccess, showError, showConfirm, hidePopup } = usePopup();

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      setIsLoading(true);
      const response = await workerAPI.getAll();
      if (response.success && response.workers) {
        setWorkers(response.workers);
      }
    } catch (error: any) {
      showError('Failed to load workers', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWorker = async () => {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      showError('Validation Error', 'All fields are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showError('Validation Error', 'Invalid email format');
      return;
    }

    if (password.length < 6) {
      showError('Validation Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await workerAPI.create(name, email, password);
      
      if (response.success) {
        showSuccess('Success', 'Worker account created successfully');
        setShowAddModal(false);
        setName('');
        setEmail('');
        setPassword('');
        await loadWorkers();
      } else {
        showError('Error', response.error || 'Failed to create worker');
      }
    } catch (error: any) {
      showError('Error', error.message || 'Failed to create worker');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWorker = (worker: Worker) => {
    showConfirm(
      'Delete Worker',
      `Are you sure you want to delete ${worker.name}? This action cannot be undone.`,
      async () => {
        try {
          const response = await workerAPI.delete(worker.id);
          if (response.success) {
            showSuccess('Success', 'Worker deleted successfully');
            await loadWorkers();
          } else {
            showError('Error', response.error || 'Failed to delete worker');
          }
        } catch (error: any) {
          showError('Error', error.message || 'Failed to delete worker');
        }
      }
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#84cc16" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CustomPopup {...popupState} onClose={hidePopup} />
      
      <View className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-foreground">Manage Staff</Text>
            <Text className="text-muted-foreground text-sm mt-1">
              {workers.length} {workers.length === 1 ? 'worker' : 'workers'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="w-12 h-12 bg-primary items-center justify-center rounded-xl"
          >
            <StyledPlus size={24} color="#0d0f14" />
          </TouchableOpacity>
        </View>

        {/* Workers List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {workers.length === 0 ? (
            <View className="items-center justify-center py-20 px-8">
              <StyledUsers size={64} color="#52525b" />
              <Text className="text-muted-foreground text-center mt-4 mb-2">
                No workers yet
              </Text>
              <Text className="text-muted-foreground text-center text-sm mb-6">
                Add your first worker to help manage your gym
              </Text>
              <Button onPress={() => setShowAddModal(true)} variant="primary">
                Add First Worker
              </Button>
            </View>
          ) : (
            workers.map((worker) => (
              <Card key={worker.id} className="mb-3">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-lg">{worker.name}</Text>
                    <Text className="text-muted-foreground text-sm mt-1">{worker.email}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteWorker(worker)}
                    className="w-10 h-10 bg-destructive/20 items-center justify-center rounded-lg"
                  >
                    <StyledTrash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          )}
        </ScrollView>
      </View>

      {/* Add Worker Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 pb-8">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-foreground">Add New Worker</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="w-8 h-8 items-center justify-center"
              >
                <StyledX size={24} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View className="gap-4">
              <View>
                <Text className="text-foreground font-medium mb-2">Name</Text>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter worker name"
                  autoCapitalize="words"
                />
              </View>

              <View>
                <Text className="text-foreground font-medium mb-2">Email</Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="worker@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-foreground font-medium mb-2">Password</Text>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Minimum 6 characters"
                  secureTextEntry
                />
              </View>

              <Button
                onPress={handleAddWorker}
                variant="primary"
                className="mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Worker Account'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageStaffScreen;
