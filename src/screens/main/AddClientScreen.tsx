import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, DollarSign } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(User, { className: { target: "style" } });
cssInterop(Mail, { className: { target: "style" } });
cssInterop(DollarSign, { className: { target: "style" } });

const AddClientScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [membershipType, setMembershipType] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  const [fee, setFee] = useState('');

  const handleAddClient = () => {
    if (!name || !email || !fee) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Mock API call
    console.log('Adding client:', { name, email, membershipType, fee });
    
    Alert.alert('Success', 'Client added successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-xl font-bold text-foreground">Add New Client</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-foreground mb-2 font-medium">Full Name</Text>
            <View className="flex-row items-center bg-secondary rounded-xl px-4 h-12 border border-border">
              <User size={20} color="#a1a1aa" />
              <TextInput
                className="flex-1 ml-3 text-foreground"
                placeholder="Client name"
                placeholderTextColor="#a1a1aa"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View>
            <Text className="text-foreground mb-2 font-medium">Email</Text>
            <View className="flex-row items-center bg-secondary rounded-xl px-4 h-12 border border-border">
              <Mail size={20} color="#a1a1aa" />
              <TextInput
                className="flex-1 ml-3 text-foreground"
                placeholder="Client email"
                placeholderTextColor="#a1a1aa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View>
            <Text className="text-foreground mb-2 font-medium">Membership Type</Text>
            <View className="flex-row justify-between space-x-2">
              {['Monthly', 'Quarterly', 'Yearly'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setMembershipType(type as any)}
                  className={`flex-1 h-10 items-center justify-center rounded-lg border ${
                    membershipType === type 
                      ? 'bg-primary border-primary' 
                      : 'bg-secondary border-border'
                  }`}
                >
                  <Text className={`font-medium ${
                    membershipType === type ? 'text-background' : 'text-muted-foreground'
                  }`}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-foreground mb-2 font-medium">Membership Fee</Text>
            <View className="flex-row items-center bg-secondary rounded-xl px-4 h-12 border border-border">
              <DollarSign size={20} color="#a1a1aa" />
              <TextInput
                className="flex-1 ml-3 text-foreground"
                placeholder="Amount"
                placeholderTextColor="#a1a1aa"
                value={fee}
                onChangeText={setFee}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary h-12 rounded-xl items-center justify-center mb-6"
          onPress={handleAddClient}
        >
          <Text className="text-background font-bold text-lg">Save Client</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddClientScreen;
