import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, Mail, Lock, User } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(Dumbbell, { className: { target: "style" } });
cssInterop(Mail, { className: { target: "style" } });
cssInterop(Lock, { className: { target: "style" } });
cssInterop(User, { className: { target: "style" } });

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const result = await signup(name, email, password);
    setIsSubmitting(false);

    if (result.error) {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-primary/20 rounded-2xl items-center justify-center mb-4">
          <Dumbbell size={32} color="#84cc16" />
        </View>
        <Text className="text-2xl font-bold text-foreground">Create Account</Text>
        <Text className="text-muted-foreground mt-2">Join us and start your journey</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-foreground mb-2 font-medium">Full Name</Text>
          <View className="flex-row items-center bg-secondary rounded-xl px-4 h-12 border border-border">
            <User size={20} color="#a1a1aa" />
            <TextInput
              className="flex-1 ml-3 text-foreground"
              placeholder="Enter your name"
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
              placeholder="Create a password"
              placeholderTextColor="#a1a1aa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <View>
          <Text className="text-foreground mb-2 font-medium">Confirm Password</Text>
          <View className="flex-row items-center bg-secondary rounded-xl px-4 h-12 border border-border">
            <Lock size={20} color="#a1a1aa" />
            <TextInput
              className="flex-1 ml-3 text-foreground"
              placeholder="Confirm your password"
              placeholderTextColor="#a1a1aa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary h-12 rounded-xl items-center justify-center mt-6"
          onPress={handleSignup}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#0d0f14" />
          ) : (
            <Text className="text-background font-bold text-lg">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-muted-foreground">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-primary font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;
