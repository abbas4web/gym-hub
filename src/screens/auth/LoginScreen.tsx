import { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, Mail, Lock } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { usePopup } from '@/hooks/usePopup';
import CustomPopup from '@/components/CustomPopup';

cssInterop(Dumbbell, { className: { target: "style" } });
cssInterop(Mail, { className: { target: "style" } });
cssInterop(Lock, { className: { target: "style" } });

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();
  const { popupState, showError, hidePopup } = usePopup();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.error) {
      showError('Login Failed', result.error);
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
          contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-primary/20 rounded-2xl items-center justify-center mb-4">
              <Dumbbell size={40} color="#84cc16" />
            </View>
            <Text className="text-3xl font-bold text-foreground">Welcome Back</Text>
            <Text className="text-muted-foreground mt-2">Sign in to your gym account</Text>
          </View>

          <View className="space-y-4">
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: undefined });
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
              icon={<Mail size={20} color="#a1a1aa" />}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: undefined });
              }}
              secureTextEntry
              error={errors.password}
              icon={<Lock size={20} color="#a1a1aa" />}
              placeholder="Enter your password"
              containerClassName="mt-4"
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              className="self-end mt-2"
            >
              <Text className="text-primary font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              onPress={handleLogin}
              loading={isSubmitting}
              className="mt-6"
            >
              Sign In
            </Button>

            <View className="flex-row justify-center mt-4">
              <Text className="text-muted-foreground">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text className="text-primary font-bold">Sign Up</Text>
              </TouchableOpacity>
            </View>
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

export default LoginScreen;
