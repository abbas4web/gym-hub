import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Mail, Calendar, CreditCard, Trash2, Edit } from 'lucide-react-native';
import { styled } from 'nativewind';
import { useClients } from '@/contexts/ClientContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatCurrency, getMembershipTypeName } from '@/utils/membership.utils';
import { usePopup } from '@/hooks/usePopup';
import CustomPopup from '@/components/CustomPopup';

const StyledArrowLeft = styled(ArrowLeft);
const StyledPhone = styled(Phone);
const StyledMail = styled(Mail);
const StyledCalendar = styled(Calendar);
const StyledCreditCard = styled(CreditCard);
const StyledTrash2 = styled(Trash2);
const StyledEdit = styled(Edit);

const ClientDetailScreen = ({ route, navigation }: any) => {
  const { clientId } = route.params;
  const { clients, deleteClient } = useClients();
  const { popupState, showError, showSuccess, showConfirm, hidePopup } = usePopup();
  
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Client not found</Text>
      </SafeAreaView>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${client.phone}`);
  };

  const handleEmail = () => {
    if (client.email) {
      Linking.openURL(`mailto:${client.email}`);
    }
  };

  const handleDelete = () => {
    showConfirm(
      'Delete Client',
      `Are you sure you want to delete ${client.name}? This will also delete all associated receipts. This action cannot be undone.`,
      async () => {
        try {
          await deleteClient(client.id);
          showSuccess('Success', 'Client deleted successfully');
          setTimeout(() => {
            navigation.navigate('Clients');
          }, 1500);
        } catch (error: any) {
          showError('Error', error.message || 'Failed to delete client');
        }
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CustomPopup {...popupState} onClose={hidePopup} />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <StyledArrowLeft size={24} color="#84cc16" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-3">
          {/* Show Pending if no Aadhar, otherwise show membership status */}
          {!client.adharPhoto ? (
            <Badge variant="warning">
              Pending
            </Badge>
          ) : (
            <Badge variant={client.isActive ? 'active' : 'active'}>
              {client.isActive ? 'Active' : 'Expired'}
            </Badge>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('EditClient', { clientId: client.id })}>
            <StyledEdit size={24} color="#84cc16" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <StyledTrash2 size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Section */}
        <View className="items-center py-6 px-4">
          {client.photo ? (
            <Image
              source={{ uri: client.photo }}
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-4">
              <Text className="text-primary font-bold text-3xl">
                {client.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          <Text className="text-foreground font-bold text-2xl mb-2">{client.name}</Text>
        </View>

        {/* Contact Information */}
        <Card className="mb-6 mx-4">
          <Text className="text-foreground font-bold text-lg mb-4">Contact Information</Text>
          
          <TouchableOpacity
            onPress={handleCall}
            className="flex-row items-center py-3 border-b border-border"
          >
            <StyledPhone size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-xs">Phone</Text>
              <Text className="text-foreground">{client.phone}</Text>
            </View>
          </TouchableOpacity>

          {client.email && (
            <TouchableOpacity
              onPress={handleEmail}
              className="flex-row items-center py-3"
            >
              <StyledMail size={20} color="#84cc16" />
              <View className="ml-3 flex-1">
                <Text className="text-muted-foreground text-xs">Email</Text>
                <Text className="text-foreground">{client.email}</Text>
              </View>
            </TouchableOpacity>
          )}
        </Card>

        {/* Membership Details */}
        <Card className="mb-6 mx-4">
          <Text className="text-foreground font-bold text-lg mb-4">Membership Details</Text>
          
          <View className="flex-row items-center py-3 border-b border-border">
            <StyledCreditCard size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-xs">Membership Type</Text>
              <Text className="text-foreground">{getMembershipTypeName(client.membershipType)}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3 border-b border-border">
            <StyledCalendar size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-xs">Start Date</Text>
              <Text className="text-foreground">{formatDate(client.startDate)}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3 border-b border-border">
            <StyledCalendar size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-xs">End Date</Text>
              <Text className="text-foreground">{formatDate(client.endDate)}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3">
            <StyledCreditCard size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-xs">Membership Fee</Text>
              <Text className="text-foreground font-bold">{formatCurrency(client.fee)}</Text>
            </View>
          </View>
        </Card>

        {/* Aadhar Card */}
        {client.adharPhoto && (
          <Card className="mb-6 mx-4">
            <Text className="text-foreground font-bold text-lg mb-4">Aadhar Card</Text>
            <Image
              source={{ uri: client.adharPhoto }}
              className="w-full h-48 rounded-lg"
              resizeMode="contain"
            />
          </Card>
        )}

        {/* Additional Information */}
        <Card className="mb-6 mx-4">
          <Text className="text-foreground font-bold text-lg mb-4">Additional Information</Text>
          
          <View className="py-2">
            <Text className="text-muted-foreground text-xs">Member Since</Text>
            <Text className="text-foreground">{formatDate(client.createdAt)}</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientDetailScreen;
