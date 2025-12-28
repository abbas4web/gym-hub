import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Mail, Calendar, CreditCard } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useClients } from '@/contexts/ClientContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatCurrency, getMembershipTypeName } from '@/utils/membership.utils';

cssInterop(ArrowLeft, { className: { target: "style" } });
cssInterop(Phone, { className: { target: "style" } });
cssInterop(Mail, { className: { target: "style" } });
cssInterop(Calendar, { className: { target: "style" } });
cssInterop(CreditCard, { className: { target: "style" } });

const ClientDetailScreen = ({ route, navigation }: any) => {
  const { clientId } = route.params;
  const { clients } = useClients();
  
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground ml-4">Client Details</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Profile Section */}
        <Card className="mb-6 items-center py-6">
          {client.photo ? (
            <Image
              source={{ uri: client.photo }}
              className="w-32 h-32 rounded-full mb-4"
            />
          ) : (
            <View className="w-32 h-32 bg-primary/20 rounded-full items-center justify-center mb-4">
              <Text className="text-primary font-bold text-4xl">
                {getInitials(client.name)}
              </Text>
            </View>
          )}
          
          <Text className="text-foreground font-bold text-2xl mb-2">{client.name}</Text>
          <Badge variant={client.isActive ? 'active' : 'expired'}>
            {client.isActive ? 'Active' : 'Expired'}
          </Badge>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <Text className="text-foreground font-bold text-lg mb-4">Contact Information</Text>
          
          <TouchableOpacity
            onPress={handleCall}
            className="flex-row items-center py-3 border-b border-border"
          >
            <Phone size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-sm">Phone</Text>
              <Text className="text-foreground font-medium">{client.phone}</Text>
            </View>
          </TouchableOpacity>

          {client.email && (
            <TouchableOpacity
              onPress={handleEmail}
              className="flex-row items-center py-3"
            >
              <Mail size={20} color="#84cc16" />
              <View className="ml-3 flex-1">
                <Text className="text-muted-foreground text-sm">Email</Text>
                <Text className="text-foreground font-medium">{client.email}</Text>
              </View>
            </TouchableOpacity>
          )}
        </Card>

        {/* Membership Details */}
        <Card className="mb-6">
          <Text className="text-foreground font-bold text-lg mb-4">Membership Details</Text>
          
          <View className="flex-row items-center py-3 border-b border-border">
            <CreditCard size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-sm">Membership Type</Text>
              <Text className="text-foreground font-medium">{getMembershipTypeName(client.membershipType)}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3 border-b border-border">
            <Calendar size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-sm">Start Date</Text>
              <Text className="text-foreground font-medium">{formatDate(client.startDate)}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3 border-b border-border">
            <Calendar size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-sm">End Date</Text>
              <Text className="text-foreground font-medium">{formatDate(client.endDate)}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3">
            <CreditCard size={20} color="#84cc16" />
            <View className="ml-3 flex-1">
              <Text className="text-muted-foreground text-sm">Membership Fee</Text>
              <Text className="text-primary font-bold text-lg">{formatCurrency(client.fee)}</Text>
            </View>
          </View>
        </Card>

        {/* Aadhar Card Photo */}
        {client.adharPhoto && (
          <Card className="mb-6">
            <Text className="text-foreground font-bold text-lg mb-4">Aadhar Card</Text>
            <View className="bg-secondary rounded-lg overflow-hidden">
              <Image
                source={{ uri: client.adharPhoto }}
                className="w-full h-48"
                resizeMode="contain"
              />
            </View>
            <Text className="text-muted-foreground text-xs mt-2 text-center">
              Tap to view full size
            </Text>
          </Card>
        )}

        {/* Additional Info */}
        <Card className="mb-6">
          <Text className="text-foreground font-bold text-lg mb-4">Additional Information</Text>
          
          <View className="py-2">
            <Text className="text-muted-foreground text-sm">Member Since</Text>
            <Text className="text-foreground font-medium">{formatDate(client.createdAt)}</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientDetailScreen;
