import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useClients } from '@/contexts/ClientContext';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Calendar, Camera, ArrowLeft } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MembershipType } from '@/types/models';
import { getMembershipFee, getMembershipDuration, calculateEndDate, formatDate, formatCurrency } from '@/utils/membership.utils';
import { usePopup } from '@/hooks/usePopup';
import CustomPopup from '@/components/CustomPopup';

cssInterop(User, { className: { target: "style" } });
cssInterop(Mail, { className: { target: "style" } });
cssInterop(Phone, { className: { target: "style" } });
cssInterop(Calendar, { className: { target: "style" } });
cssInterop(Camera, { className: { target: "style" } });
cssInterop(ArrowLeft, { className: { target: "style" } });

const EditClientScreen = ({ route, navigation }: any) => {
  const { clientId } = route.params;
  const { clients, updateClient } = useClients();
  const { user } = useAuth();
  const { popupState, showError, showSuccess, hidePopup } = usePopup();

  const client = clients.find(c => c.id === clientId);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [adharPhoto, setAdharPhoto] = useState<string | undefined>(undefined);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  const adminPlans = user?.membershipPlans || [];

  // Pre-populate form with client data
  useEffect(() => {
    if (client && adminPlans.length > 0) {
      setName(client.name);
      setPhone(client.phone);
      setEmail(client.email || '');
      setPhoto(client.photo);
      setAdharPhoto(client.adharPhoto);
      
      // Find matching plan index - match by name
      const planIndex = adminPlans.findIndex(
        plan => plan.name.toLowerCase() === client.membershipType.toLowerCase()
      );
      
      if (planIndex !== -1) {
        setSelectedPlanIndex(planIndex);
      } else {
        // If exact match not found, try to find by duration
        const durationMatch = adminPlans.findIndex(
          plan => plan.duration === getMembershipDuration(client.membershipType as MembershipType)
        );
        if (durationMatch !== -1) {
          setSelectedPlanIndex(durationMatch);
        }
      }
    }
  }, [client, adminPlans]);

  if (!client) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Client not found</Text>
      </SafeAreaView>
    );
  }

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
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
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const base64 = result.assets[0].base64;
      if (base64) {
        setPhoto(`data:image/jpeg;base64,${base64}`);
      }
    }
  };

  const pickAdharFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const base64 = result.assets[0].base64;
      if (base64) {
        setAdharPhoto(`data:image/jpeg;base64,${base64}`);
      }
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    if (selectedPlanIndex === null) {
      showError('Error', 'Please select a membership plan');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPlan = adminPlans[selectedPlanIndex];
      
      // Check if membership plan changed (case-insensitive comparison)
      const currentPlanName = client.membershipType.toLowerCase().trim();
      const newPlanName = selectedPlan.name.toLowerCase().trim();
      const planChanged = currentPlanName !== newPlanName;
      
      let startDate = client.startDate;
      let endDate = client.endDate;
      
      // If plan changed, recalculate dates from today
      if (planChanged) {
        startDate = new Date().toISOString();
        endDate = calculateEndDate(startDate, selectedPlan.name as MembershipType);
      }

      await updateClient(client.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        photo: photo,
        adharPhoto: adharPhoto,
        membershipType: selectedPlan.name as MembershipType,
        startDate: startDate,
        endDate: endDate,
        fee: selectedPlan.fee,
      });

      showSuccess('Success', 'Client updated successfully!');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to update client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CustomPopup {...popupState} onClose={hidePopup} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-border">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#84cc16" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground ml-4">Edit Client</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-6">
          {/* Profile Photo */}
          <View className="items-center mb-6">
            <TouchableOpacity onPress={pickImageFromGallery}>
              {photo ? (
                <Image
                  source={{ uri: photo }}
                  className="w-24 h-24 rounded-full mb-2"
                />
              ) : (
                <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-2">
                  <Camera size={32} color="#84cc16" />
                </View>
              )}
              <Text className="text-primary text-sm">Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Basic Information */}
          <Card className="mb-6">
            <Text className="text-foreground font-bold text-lg mb-4">Basic Information</Text>
            
            <Input
              label="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors({ ...errors, name: undefined });
              }}
              placeholder="Enter client name"
              error={errors.name}
              icon={<User size={20} color="#a1a1aa" />}
            />

            <Input
              label="Phone Number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setErrors({ ...errors, phone: undefined });
              }}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              error={errors.phone}
              icon={<Phone size={20} color="#a1a1aa" />}
              containerClassName="mt-4"
            />

            <Input
              label="Email (Optional)"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: undefined });
              }}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              icon={<Mail size={20} color="#a1a1aa" />}
              containerClassName="mt-4"
            />
          </Card>

          {/* Aadhar Photo */}
          <Card className="mb-6">
            <Text className="text-foreground font-bold text-lg mb-4">Aadhar Card (Optional)</Text>
            <TouchableOpacity
              onPress={pickAdharFromGallery}
              className="border-2 border-dashed border-border rounded-lg p-4 items-center"
            >
              {adharPhoto ? (
                <Image
                  source={{ uri: adharPhoto }}
                  className="w-full h-40 rounded-lg mb-2"
                  resizeMode="contain"
                />
              ) : (
                <View className="w-full h-40 bg-muted rounded-lg items-center justify-center mb-2">
                  <Camera size={32} color="#a1a1aa" />
                </View>
              )}
              <Text className="text-primary font-medium">
                {adharPhoto ? 'Change Aadhar Photo' : 'Upload Aadhar Photo'}
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Membership Plans */}
          <Card className="mb-6">
            <Text className="text-foreground font-bold text-lg mb-4">Membership Plan</Text>
            
            {adminPlans.length > 0 ? (
              <View className="gap-3">
                {adminPlans.map((plan, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedPlanIndex(index)}
                    className={`p-4 rounded-xl border-2 ${
                      selectedPlanIndex === index
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    }`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className={`font-bold text-lg ${
                          selectedPlanIndex === index ? 'text-primary' : 'text-foreground'
                        }`}>
                          {plan.name}
                        </Text>
                        <Text className="text-muted-foreground text-sm">
                          {plan.duration} {plan.duration === 1 ? 'month' : 'months'}
                        </Text>
                      </View>
                      <Text className={`font-bold text-xl ${
                        selectedPlanIndex === index ? 'text-primary' : 'text-foreground'
                      }`}>
                        {formatCurrency(plan.fee)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text className="text-muted-foreground text-center py-4">
                No membership plans available
              </Text>
            )}
          </Card>

          {/* Current Membership Info */}
          <Card className="mb-6">
            <Text className="text-foreground font-bold text-lg mb-4">Current Membership</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Start Date:</Text>
                <Text className="text-foreground font-medium">{formatDate(client.startDate)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">End Date:</Text>
                <Text className="text-foreground font-medium">{formatDate(client.endDate)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Current Fee:</Text>
                <Text className="text-foreground font-medium">{formatCurrency(client.fee)}</Text>
              </View>
            </View>
          </Card>

          <Button
            onPress={handleUpdate}
            disabled={isSubmitting}
            className="mb-6"
          >
            {isSubmitting ? 'Updating...' : 'Update Client'}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditClientScreen;
