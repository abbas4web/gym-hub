import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Client } from '@/types/models';
import { Badge } from './ui/Badge';
import { formatDate, getDaysUntilExpiry, getMembershipTypeName } from '@/utils/membership.utils';

interface ClientCardProps {
  client: Client;
  onPress: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onPress }) => {
  const daysUntilExpiry = getDaysUntilExpiry(client.endDate);
  
  const getBadgeVariant = () => {
    if (!client.isActive) return 'expired';
    if (daysUntilExpiry <= 7) return 'expiring';
    return 'active';
  };

  const getStatusText = () => {
    if (!client.isActive) return 'Expired';
    if (daysUntilExpiry <= 7) return `${daysUntilExpiry}d left`;
    return 'Active';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-card p-4 mb-3 rounded-xl border border-border"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center flex-1">
          {client.photo ? (
            <Image
              source={{ uri: client.photo }}
              className="w-12 h-12 rounded-full mr-3"
            />
          ) : (
            <View className="w-12 h-12 bg-secondary rounded-full items-center justify-center mr-3">
              <Text className="text-primary font-bold text-lg">
                {client.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-foreground font-bold text-lg">
              {client.name}
            </Text>
            <Text className="text-muted-foreground text-sm">
              {client.phone}
            </Text>
          </View>
        </View>
        <Badge variant={getBadgeVariant()}>
          {getStatusText()}
        </Badge>
      </View>

      <View className="flex-row mt-4 pt-4 border-t border-border justify-between">
        <View>
          <Text className="text-muted-foreground text-xs">Membership</Text>
          <Text className="text-foreground font-medium">
            {getMembershipTypeName(client.membershipType)}
          </Text>
        </View>
        <View>
          <Text className="text-muted-foreground text-xs">Expires</Text>
          <Text className="text-foreground font-medium">
            {formatDate(client.endDate)}
          </Text>
        </View>
        <View>
          <Text className="text-muted-foreground text-xs">Fee</Text>
          <Text className="text-foreground font-medium">
            ₹{client.fee}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
