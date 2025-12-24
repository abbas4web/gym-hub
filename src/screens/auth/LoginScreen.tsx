import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, Mail, Lock } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(Dumbbell, { className: { target: "style" } });
cssInterop(Mail, { className: { target: "style" } });
cssInterop(Lock, { className: { target: "style" } });

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.error) {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-primary/20 rounded-2xl items-center justify-center mb-4">
          <Dumbbell size={40} color="#84cc16" />
        </View>
        <Text className="text-3xl font-bold text-foreground">Welcome Back</Text>
        <Text className="text-muted-foreground mt-2">Sign in to your gym account</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-foreground mb-2 font-medium">Email</Text>
          <View className="flex-row items-center bg-secondary rounded-xl px-4 h-12 border border-border">
            <Mail size={20} color="#a1a1aa" />
            <TextInput
              className="flex-1 ml-3 text-foreground"
              placeholder="Enter your email"
              placeholderTextColor="#a1a1aa"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View>
          <Text className="text-foreground mb-2 font-medium">Password</Text>
          <View className="flex-row items-center bg-secondary rounded-xl px-4 h-12 border border-border">
            <Lock size={20} color="#a1a1aa" />
            <TextInput
              className="flex-1 ml-3 text-foreground"
              placeholder="Enter your password"
              placeholderTextColor="#a1a1aa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary h-12 rounded-xl items-center justify-center mt-6"
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#0d0f14" />
          ) : (
            <Text className="text-background font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-muted-foreground">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text className="text-primary font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
