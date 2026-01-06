import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Receipt } from '@/types/models';
import { formatDate, formatCurrency, getMembershipTypeName } from '@/utils/membership.utils';
import { Card } from './ui/Card';

interface ReceiptCardProps {
  receipt: Receipt;
  onPress: () => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card className="mb-3">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-foreground font-bold text-lg">
              {receipt.clientName}
            </Text>
            <Text className="text-muted-foreground text-sm">
              {getMembershipTypeName(receipt.membershipType)} Membership
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-primary font-bold text-xl">
              {formatCurrency(receipt.amount)}
            </Text>
            <Text className="text-muted-foreground text-xs">
              {formatDate(receipt.generatedAt)}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between pt-3 border-t border-border">
          <View>
            <Text className="text-muted-foreground text-xs">Start Date</Text>
            <Text className="text-foreground text-sm font-medium">
              {formatDate(receipt.startDate)}
            </Text>
          </View>
          <View>
            <Text className="text-muted-foreground text-xs">End Date</Text>
            <Text className="text-foreground text-sm font-medium">
              {formatDate(receipt.endDate)}
            </Text>
          </View>
          <View>
            <Text className="text-muted-foreground text-xs">Receipt ID</Text>
            <Text className="text-foreground text-sm font-medium">
              #{receipt.id.slice(-6)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
