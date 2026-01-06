import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { styled } from 'nativewind';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useClients } from '@/contexts/ClientContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { formatDate, formatCurrency, getMembershipTypeName } from '@/utils/membership.utils';
import { generateReceiptHTML } from '@/utils/receipt.utils';
import { usePopup } from '@/hooks/usePopup';
import CustomPopup from '@/components/CustomPopup';

const StyledArrowLeft = styled(ArrowLeft);
const StyledShare2 = styled(Share2);

const ReceiptDetailScreen = ({ route, navigation }: any) => {
  const { receiptId } = route.params;
  const { receipts } = useClients();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const { popupState, showError, hidePopup } = usePopup();
  
  const receipt = receipts.find(r => r.id === receiptId);

  if (!receipt) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Receipt not found</Text>
      </SafeAreaView>
    );
  }

  const handleSharePDF = async () => {
    try {
      setIsGenerating(true);
      
      // Generate HTML with gym branding
      const html = generateReceiptHTML(
        receipt,
        user?.gym_name || 'GYM HUB',
        user?.gym_logo
      );
      
      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
      
      // Share PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Receipt - ${receipt.clientName}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        showError('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      showError('Error', 'Failed to generate PDF receipt');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CustomPopup {...popupState} onClose={hidePopup} />
      
      {/* Header */}
      <View className="px-6 py-4 border-b border-border flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <StyledArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Receipt Details</Text>
        <TouchableOpacity onPress={handleSharePDF} disabled={isGenerating}>
          {isGenerating ? (
            <ActivityIndicator size="small" color="#84cc16" />
          ) : (
            <StyledShare2 size={24} color="#84cc16" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Receipt Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <View className="items-center py-4 border-b border-border">
            <Text className="text-muted-foreground text-sm mb-2">Receipt ID</Text>
            <Text className="text-foreground font-mono text-lg">#{receipt.id.slice(-8).toUpperCase()}</Text>
          </View>
          
          <View className="items-center py-6">
            <Text className="text-muted-foreground text-sm mb-2">Amount Paid</Text>
            <Text className="text-primary font-bold text-4xl">{formatCurrency(receipt.amount)}</Text>
          </View>

          <View className="items-center py-4 border-t border-border">
            <Text className="text-muted-foreground text-sm mb-2">Date Issued</Text>
            <Text className="text-foreground font-medium">{formatDate(receipt.generatedAt)}</Text>
          </View>
        </Card>

        {/* Client Details */}
        <Card className="mb-6">
          <Text className="text-foreground font-bold text-lg mb-4">Client Details</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between py-2">
              <Text className="text-muted-foreground">Name</Text>
              <Text className="text-foreground font-medium">{receipt.clientName}</Text>
            </View>
          </View>
        </Card>

        {/* Membership Details */}
        <Card className="mb-6">
          <Text className="text-foreground font-bold text-lg mb-4">Membership Details</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between py-2">
              <Text className="text-muted-foreground">Type</Text>
              <Text className="text-foreground font-medium capitalize">
                {getMembershipTypeName(receipt.membershipType)}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-t border-border">
              <Text className="text-muted-foreground">Start Date</Text>
              <Text className="text-foreground font-medium">{formatDate(receipt.startDate)}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-t border-border">
              <Text className="text-muted-foreground">End Date</Text>
              <Text className="text-foreground font-medium">{formatDate(receipt.endDate)}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-t border-border">
              <Text className="text-muted-foreground">Duration</Text>
              <Text className="text-foreground font-medium">
                {receipt.membershipType === 'monthly' ? '1 Month' : 
                 receipt.membershipType === 'quarterly' ? '3 Months' : '12 Months'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-6 bg-primary/5">
          <Text className="text-foreground font-bold text-lg mb-4">Payment Summary</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between py-2">
              <Text className="text-muted-foreground">Membership Fee</Text>
              <Text className="text-foreground font-medium">{formatCurrency(receipt.amount)}</Text>
            </View>
            <View className="flex-row justify-between py-3 border-t-2 border-primary">
              <Text className="text-foreground font-bold text-lg">Total Paid</Text>
              <Text className="text-primary font-bold text-xl">{formatCurrency(receipt.amount)}</Text>
            </View>
          </View>
        </Card>

        {/* Share Button */}
        <TouchableOpacity
          onPress={handleSharePDF}
          disabled={isGenerating}
          className="bg-primary rounded-xl py-4 mb-6 flex-row items-center justify-center"
        >
          {isGenerating ? (
            <>
              <ActivityIndicator size="small" color="#0d0f14" />
              <Text className="text-primary-foreground font-bold text-lg ml-2">Generating PDF...</Text>
            </>
          ) : (
            <>
              <StyledShare2 size={20} color="#0d0f14" />
              <Text className="text-primary-foreground font-bold text-lg ml-2">Share Receipt PDF</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View className="items-center py-6 mb-6">
          <Text className="text-muted-foreground text-sm">Thank you for your payment!</Text>
          <Text className="text-muted-foreground text-xs mt-2">
            {user?.gym_name || 'Gym Hub'} - Fitness Management
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReceiptDetailScreen;
