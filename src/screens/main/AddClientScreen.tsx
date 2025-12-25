import { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useClients } from '@/contexts/ClientContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { User, Mail, Phone, Calendar, Camera } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MembershipType } from '@/types/models';
import { getMembershipFee, calculateEndDate, formatDate, formatCurrency } from '@/utils/membership.utils';

cssInterop(User, { className: { target: "style" } });
cssInterop(Mail, { className: { target: "style" } });
cssInterop(Phone, { className: { target: "style" } });
cssInterop(Calendar, { className: { target: "style" } });
cssInterop(Camera, { className: { target: "style" } });

const AddClientScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [membershipType, setMembershipType] = useState<MembershipType>('monthly');
  const [customDuration, setCustomDuration] = useState('');
  const [customFee, setCustomFee] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  const { addClient } = useClients();
  const { canAddClient } = useSubscription();

  const calculateMembershipDetails = () => {
    const startDate = new Date();
    let endDate = new Date();
    let fee = 0;

    switch (membershipType) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        fee = 1500;
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        fee = 4000;
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        fee = 15000;
        break;
      case 'custom':
        const days = parseInt(customDuration) || 0;
        endDate.setDate(endDate.getDate() + days);
        fee = parseFloat(customFee) || 0;
        break;
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      fee,
    };
  };

  const { startDate, endDate, fee } = calculateMembershipDetails();

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera and gallery permissions to upload photos.');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImageFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validate = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (membershipType === 'custom') {
      if (!customDuration || parseInt(customDuration) <= 0) {
        Alert.alert('Error', 'Please enter a valid duration in days');
        return false;
      }
      if (!customFee || parseFloat(customFee) <= 0) {
        Alert.alert('Error', 'Please enter a valid fee amount');
        return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClient = async () => {
    if (!validate()) return;

    const canAdd = await canAddClient();
    if (!canAdd) {
      Alert.alert(
        'Client Limit Reached',
        'You have reached the maximum number of clients for your plan. Please upgrade to add more clients.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Subscription') },
        ]
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await addClient({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        photo,
        membershipType,
        startDate,
        endDate,  // ← SEND THIS
        fee,      // ← SEND THIS
      });

      Alert.alert('Success', 'Client added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Add client error:', error);
      Alert.alert('Error', error.message || 'Failed to add client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="px-6 py-4 border-b border-border flex-row justify-between items-center">
          <Text className="text-xl font-bold text-foreground">Add New Client</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-primary font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
          {/* Photo Upload */}
          <View className="items-center mb-6">
            <TouchableOpacity
              onPress={showImageOptions}
              className="w-32 h-32 rounded-full bg-secondary border-2 border-border items-center justify-center overflow-hidden"
            >
              {photo ? (
                <Image source={{ uri: photo }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <Camera size={40} color="#a1a1aa" />
                  <Text className="text-muted-foreground text-xs mt-2">Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            {photo && (
              <TouchableOpacity
                onPress={() => setPhoto(undefined)}
                className="mt-2"
              >
                <Text className="text-destructive text-sm">Remove Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <Input
            label="Full Name *"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: undefined });
            }}
            placeholder="Client name"
            error={errors.name}
            icon={<User size={20} color="#a1a1aa" />}
            containerClassName="mb-4"
          />

          <Input
            label="Phone Number *"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrors({ ...errors, phone: undefined });
            }}
            placeholder="10-digit phone number"
            keyboardType="phone-pad"
            error={errors.phone}
            icon={<Phone size={20} color="#a1a1aa" />}
            containerClassName="mb-4"
          />

          <Input
            label="Email (Optional)"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: undefined });
            }}
            placeholder="Client email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon={<Mail size={20} color="#a1a1aa" />}
            containerClassName="mb-6"
          />

          <View className="mb-6">
            <Text className="text-foreground font-medium mb-3">Membership Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {(['monthly', 'quarterly', 'yearly', 'custom'] as MembershipType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setMembershipType(type)}
                  className={`px-4 py-3 rounded-lg border ${
                    membershipType === type
                      ? 'bg-primary border-primary'
                      : 'bg-card border-border'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      membershipType === type ? 'text-primary-foreground' : 'text-foreground'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Duration and Fee Inputs */}
          {membershipType === 'custom' && (
            <View className="mb-6">
              <Input
                label="Duration (in days)"
                value={customDuration}
                onChangeText={setCustomDuration}
                placeholder="30"
                keyboardType="numeric"
                containerClassName="mb-4"
              />
              <Input
                label="Membership Fee"
                value={customFee}
                onChangeText={setCustomFee}
                placeholder="2000"
                keyboardType="numeric"
              />
            </View>
          )}

          <Card className="mb-6 bg-primary/5 border-primary/20">
            <Text className="text-foreground font-bold mb-3">Membership Summary</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Start Date</Text>
                <Text className="text-foreground font-medium">{formatDate(startDate)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">End Date</Text>
                <Text className="text-foreground font-medium">{formatDate(endDate)}</Text>
              </View>
              <View className="flex-row justify-between pt-2 border-t border-border">
                <Text className="text-foreground font-bold">Total Fee</Text>
                <Text className="text-primary font-bold text-xl">{formatCurrency(fee)}</Text>
              </View>
            </View>
          </Card>

          <Button onPress={handleAddClient} loading={isSubmitting} className="mb-6">
            Add Client & Generate Receipt
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddClientScreen;
