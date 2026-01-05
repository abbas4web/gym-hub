import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, User as UserIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api.service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

cssInterop(ArrowLeft, { className: { target: "style" } });
cssInterop(Camera, { className: { target: "style" } });
cssInterop(UserIcon, { className: { target: "style" } });

const EditProfileScreen = ({ navigation }: any) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState<string | null>(user?.profile_image || null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' });

  // Convert image to base64
  const convertToBase64 = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduce quality to keep base64 size smaller
      });

      if (!result.canceled && result.assets[0]) {
        const base64 = await convertToBase64(result.assets[0].uri);
        setProfileImage(base64);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduce quality to keep base64 size smaller
      });

      if (!result.canceled && result.assets[0]) {
        const base64 = await convertToBase64(result.assets[0].uri);
        setProfileImage(base64);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validate = () => {
    const newErrors = { name: '', email: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      
      // Call API to update profile
      const response = await authAPI.updateProfile({
        name,
        email,
        profileImage,
      });

      if (response.success) {
        // Update user context with new data
        updateUser(response.user);
        
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.error || 'Failed to update profile');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground ml-4">Edit Profile</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Picture */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={showImageOptions}
            className="relative"
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-32 h-32 rounded-full"
              />
            ) : (
              <View className="w-32 h-32 bg-primary/20 rounded-full items-center justify-center">
                <Text className="text-primary font-bold text-4xl">
                  {getInitials(name || user?.name || 'U')}
                </Text>
              </View>
            )}
            
            {/* Camera Icon Overlay */}
            <View className="absolute bottom-0 right-0 bg-primary rounded-full p-3">
              <Camera size={20} color="#0d0f14" />
            </View>
          </TouchableOpacity>
          
          <Text className="text-muted-foreground text-sm mt-3">
            Tap to change profile picture
          </Text>
        </View>

        {/* Form */}
        <Card className="mb-6">
          <Text className="text-foreground font-bold text-lg mb-4">Personal Information</Text>
          
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            error={errors.name}
            containerClassName="mb-4"
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
        </Card>

        {/* Save Button */}
        <Button
          onPress={handleSave}
          disabled={isLoading}
          className="mb-6"
        >
          {isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#0d0f14" />
              <Text className="text-primary-foreground font-bold ml-2">Saving...</Text>
            </View>
          ) : (
            <Text className="text-primary-foreground font-bold">Save Changes</Text>
          )}
        </Button>

        {/* Info Card */}
        <Card className="mb-6 bg-muted/50">
          <Text className="text-muted-foreground text-sm">
            💡 Your profile information will be visible across the app. Make sure to use a professional photo and accurate details.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
