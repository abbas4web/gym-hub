import { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Mail } from 'lucide-react-native';
import { styled } from 'nativewind';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const StyledMail = styled(Mail);

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (result.success) {
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', result.error || 'An error occurred');
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
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Forgot Password?
            </Text>
            <Text className="text-muted-foreground">
              Enter your email address and we'll send you instructions to reset your password.
            </Text>
          </View>

          <Input
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            error={error}
            icon={<StyledMail size={20} color="#a1a1aa" />}
            placeholder="Enter your email"
          />

          <Button
            onPress={handleResetPassword}
            loading={isSubmitting}
            className="mt-6"
          >
            Send Reset Link
          </Button>

          <Button
            onPress={() => navigation.goBack()}
            variant="outline"
            className="mt-4"
          >
            Back to Login
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
