import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, User, Mail, Lock, Building2, ImageIcon, Plus, Trash2, ArrowLeft } from 'lucide-react-native';
import { styled } from 'nativewind';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { usePopup } from '@/hooks/usePopup';
import CustomPopup from '@/components/CustomPopup';

const StyledDumbbell = styled(Dumbbell);
const StyledUser = styled(User);
const StyledMail = styled(Mail);
const StyledLock = styled(Lock);
const StyledBuilding2 = styled(Building2);
const StyledImageIcon = styled(ImageIcon);
const StyledPlus = styled(Plus);
const StyledTrash2 = styled(Trash2);
const StyledArrowLeft = styled(ArrowLeft);

interface MembershipPlan {
  name: string;
  duration: number;
  fee: number;
}

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gymName, setGymName] = useState('');
  const [gymAddress, setGymAddress] = useState('');
  const [gymType, setGymType] = useState<'male' | 'female' | 'unisex'>('unisex');
  const [gymLogo, setGymLogo] = useState<string | undefined>(undefined);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([
    { name: '', duration: 1, fee: 0 }
  ]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const { signup } = useAuth();
  const { popupState, showError, showSuccess, hidePopup } = usePopup();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showError('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setGymLogo(`data:image/png;base64,${result.assets[0].base64}`);
    }
  };

  const addMembershipPlan = () => {
    setMembershipPlans([...membershipPlans, { name: '', duration: 1, fee: 0 }]);
  };

  const removeMembershipPlan = (index: number) => {
    if (membershipPlans.length > 1) {
      setMembershipPlans(membershipPlans.filter((_, i) => i !== index));
    }
  };

  const updateMembershipPlan = (index: number, field: keyof MembershipPlan, value: string | number) => {
    const updated = [...membershipPlans];
    updated[index] = { ...updated[index], [field]: value };
    setMembershipPlans(updated);
  };

  const validateStep1 = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      newErrors.password = 'Password must contain at least one number and one special character';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};

    // Step 1 checks removed from here as they are in validateStep1
    // But we should double check if needed, or just rely on flow.
    // For final submission we might want to validate all, but separate functions are cleaner.
    
    if (!gymName.trim()) newErrors.gymName = 'Gym name is required';
    
    // Validate membership plans
    membershipPlans.forEach((plan, index) => {
      if (!plan.name.trim()) {
        newErrors[`plan_${index}_name`] = 'Plan name is required';
      }
      if (plan.duration < 1) {
        newErrors[`plan_${index}_duration`] = 'Duration must be at least 1 month';
      }
      if (plan.fee < 0) {
        newErrors[`plan_${index}_fee`] = 'Fee must be positive';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignup = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    
    const result = await signup(
      name.trim(),
      email.trim().toLowerCase(),
      password,
      gymName.trim(),
      gymLogo,
      membershipPlans.map(plan => ({
        name: plan.name.trim(),
        duration: Number(plan.duration),
        fee: Number(plan.fee)
      })),
      gymAddress.trim(),
      gymType
    );
    
    setIsSubmitting(false);

    if (result.error) {
      showError('Signup Failed', result.error);
    } else {
      showSuccess('Success', 'Account created successfully!');
      setTimeout(() => {
        navigation.replace('Main');
      }, 1500);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-8">
            <Image 
              source={require('@/assets/icons/Icon.png')} 
              style={{ width: 200, height: 80, marginBottom: 16 }}
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-foreground">Create Account</Text>
            <Text className="text-muted-foreground mt-2">Start managing your gym today</Text>
          </View>

          {step === 1 && (
            <>
              <Text className="text-foreground font-bold text-lg mb-4">Personal Information</Text>
              
              <Input
                label="Full Name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrors({ ...errors, name: undefined });
                }}
                placeholder="Enter your name"
                error={errors.name}
                icon={<StyledUser size={20} color="#a1a1aa" />}
              />

              <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: undefined });
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter your email"
                error={errors.email}
                icon={<StyledMail size={20} color="#a1a1aa" />}
                containerClassName="mt-4"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry
                placeholder="Create a password"
                error={errors.password}
                icon={<StyledLock size={20} color="#a1a1aa" />}
                containerClassName="mt-4"
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors({ ...errors, confirmPassword: undefined });
                }}
                secureTextEntry
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                icon={<StyledLock size={20} color="#a1a1aa" />}
                containerClassName="mt-4"
              />
            </>
          )}

          {step === 2 && (
            <>
              <TouchableOpacity onPress={() => setStep(1)} className="flex-row items-center mb-4">
                <StyledArrowLeft size={24} color="#84cc16" />
                <Text className="text-primary font-medium ml-2">Back to Personal Info</Text>
              </TouchableOpacity>

              <Text className="text-foreground font-bold text-lg mb-4">Gym Information</Text>
              
              <Input
                label="Gym Name"
                value={gymName}
                onChangeText={(text) => {
                  setGymName(text);
                  setErrors({ ...errors, gymName: undefined });
                }}
                placeholder="Enter your gym name"
                error={errors.gymName}
                icon={<StyledBuilding2 size={20} color="#a1a1aa" />}
              />

              <Input
                label="Gym Address"
                value={gymAddress}
                onChangeText={setGymAddress}
                placeholder="Enter your gym address"
                containerClassName="mt-4"
                icon={<StyledBuilding2 size={20} color="#a1a1aa" />}
              />

              {/* Gym Type Selector */}
              <View className="mt-4">
                <Text className="text-foreground font-medium mb-2">Gym Type</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setGymType('male')}
                    className={`flex-1 h-12 rounded-lg border-2 items-center justify-center ${
                      gymType === 'male' ? 'border-primary bg-primary/10' : 'border-border bg-card'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      gymType === 'male' ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setGymType('female')}
                    className={`flex-1 h-12 rounded-lg border-2 items-center justify-center ${
                      gymType === 'female' ? 'border-primary bg-primary/10' : 'border-border bg-card'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      gymType === 'female' ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      Female
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setGymType('unisex')}
                    className={`flex-1 h-12 rounded-lg border-2 items-center justify-center ${
                      gymType === 'unisex' ? 'border-primary bg-primary/10' : 'border-border bg-card'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      gymType === 'unisex' ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      Unisex
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Gym Logo */}
              <View className="mt-4">
                <Text className="text-foreground font-medium mb-2">Gym Logo (Optional)</Text>
                <TouchableOpacity
                  onPress={pickImage}
                  className="border-2 border-dashed border-border rounded-lg p-4 items-center"
                >
                  {gymLogo ? (
                    <Image
                      source={{ uri: gymLogo }}
                      className="w-24 h-24 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-24 h-24 bg-muted rounded-lg items-center justify-center mb-2">
                      <StyledImageIcon size={32} color="#a1a1aa" />
                    </View>
                  )}
                  <Text className="text-primary font-medium">
                    {gymLogo ? 'Change Logo' : 'Upload Logo'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Membership Plans */}
              <View className="mt-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-foreground font-bold text-lg">Membership Plans</Text>
                  <TouchableOpacity
                    onPress={addMembershipPlan}
                    className="bg-primary/20 px-3 py-2 rounded-lg flex-row items-center"
                  >
                    <StyledPlus size={16} color="#84cc16" />
                    <Text className="text-primary font-bold ml-1">Add Plan</Text>
                  </TouchableOpacity>
                </View>

                {membershipPlans.map((plan, index) => (
                  <Card key={index} className="mb-4 p-4">
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-foreground font-semibold">Plan {index + 1}</Text>
                      {membershipPlans.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeMembershipPlan(index)}
                          className="p-2"
                        >
                          <StyledTrash2 size={18} color="#ef4444" />
                        </TouchableOpacity>
                      )}
                    </View>

                    <Input
                      label="Plan Name"
                      value={plan.name}
                      onChangeText={(text) => updateMembershipPlan(index, 'name', text)}
                      placeholder="e.g., Basic Monthly"
                      error={errors[`plan_${index}_name`]}
                    />

                    <View className="flex-row gap-3 mt-3">
                      <View className="flex-1">
                        <Input
                          label="Duration (months)"
                          value={plan.duration.toString()}
                          onChangeText={(text) => updateMembershipPlan(index, 'duration', parseInt(text) || 1)}
                          keyboardType="numeric"
                          placeholder="1"
                          error={errors[`plan_${index}_duration`]}
                        />
                      </View>
                      <View className="flex-1">
                        <Input
                          label="Fee (₹)"
                          value={plan.fee.toString()}
                          onChangeText={(text) => updateMembershipPlan(index, 'fee', parseInt(text) || 0)}
                          keyboardType="numeric"
                          placeholder="1500"
                          error={errors[`plan_${index}_fee`]}
                        />
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            </>
          )}

          <Button
            onPress={step === 1 ? handleNext : handleSignup}
            loading={isSubmitting}
            className="mt-6"
          >
            {step === 1 ? 'Next' : 'Create Account'}
          </Button>

          <View className="flex-row justify-center mt-4 mb-8">
            <Text className="text-muted-foreground">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-primary font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomPopup
        visible={popupState.visible}
        type={popupState.type}
        title={popupState.title}
        message={popupState.message}
        onClose={hidePopup}
        confirmText={popupState.confirmText}
        onConfirm={popupState.onConfirm}
        cancelText={popupState.cancelText}
      />
    </SafeAreaView>
  );
};

export default SignupScreen;
