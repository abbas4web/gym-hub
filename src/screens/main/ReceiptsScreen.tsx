import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Receipt, Download, Share2 } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(Receipt, { className: { target: "style" } });
cssInterop(Download, { className: { target: "style" } });
cssInterop(Share2, { className: { target: "style" } });

const mockReceipts = [
  { id: '1', clientName: 'Alice Johnson', date: '2024-01-15', amount: 50, type: 'Monthly' },
  { id: '2', clientName: 'Bob Smith', date: '2024-01-14', amount: 500, type: 'Yearly' },
  { id: '3', clientName: 'Charlie Brown', date: '2024-01-12', amount: 50, type: 'Monthly' },
  { id: '4', clientName: 'David Wilson', date: '2024-01-10', amount: 140, type: 'Quarterly' },
];

const ReceiptsScreen = () => {
  const renderReceiptItem = ({ item }: { item: any }) => (
    <View className="bg-card p-4 mb-3 rounded-xl border border-border">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3">
            <Receipt size={20} color="#84cc16" />
          </View>
          <View>
            <Text className="text-foreground font-bold">{item.clientName}</Text>
            <Text className="text-muted-foreground text-xs">{item.date} • {item.type}</Text>
          </View>
        </View>
        <Text className="text-primary font-bold text-lg">${item.amount}</Text>
      </View>
      
      <View className="flex-row border-t border-border pt-3 mt-1">
        <TouchableOpacity className="flex-1 flex-row items-center justify-center">
          <Download size={16} color="#a1a1aa" />
          <Text className="text-muted-foreground ml-2 text-sm">Download</Text>
        </TouchableOpacity>
        <View className="w-[1px] h-full bg-border" />
        <TouchableOpacity className="flex-1 flex-row items-center justify-center">
          <Share2 size={16} color="#a1a1aa" />
          <Text className="text-muted-foreground ml-2 text-sm">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-foreground mb-6">Receipts</Text>
        
        <FlatList
          data={mockReceipts}
          renderItem={renderReceiptItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReceiptsScreen;
