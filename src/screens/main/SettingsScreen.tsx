
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { User, Bell, Shield, LogOut, ChevronRight, Moon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { useState } from 'react';

cssInterop(User, { className: { target: "style" } });
cssInterop(Bell, { className: { target: "style" } });
cssInterop(Shield, { className: { target: "style" } });
cssInterop(LogOut, { className: { target: "style" } });
cssInterop(ChevronRight, { className: { target: "style" } });
cssInterop(Moon, { className: { target: "style" } });

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const SettingItem = ({ icon: Icon, title, value, type = 'arrow', onPress }: any) => (
    <TouchableOpacity 
      className="flex-row items-center justify-between py-4 border-b border-border"
      onPress={onPress}
      disabled={type === 'switch'}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-secondary rounded-full items-center justify-center mr-3">
          <Icon size={20} color="#84cc16" />
        </View>
        <Text className="text-foreground font-medium text-base">{title}</Text>
      </View>
      
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#272a30', true: '#84cc16' }}
          thumbColor={'#fcfcfc'}
        />
      ) : (
        <ChevronRight size={20} color="#a1a1aa" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4">
        <View className="items-center py-8 border-b border-border mb-6">
          <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-4">
            <Text className="text-primary text-4xl font-bold">{user?.name?.charAt(0)}</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground">{user?.name}</Text>
          <Text className="text-muted-foreground">{user?.email}</Text>
          <View className="bg-primary/20 px-3 py-1 rounded-full mt-2">
            <Text className="text-primary text-xs font-bold uppercase">{user?.role}</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-muted-foreground font-bold mb-2 uppercase text-xs tracking-wider">General</Text>
          <SettingItem 
            icon={User} 
            title="Edit Profile" 
            onPress={() => {}} 
          />
          <SettingItem 
            icon={Moon} 
            title="Dark Mode" 
            type="switch" 
            value={isDarkMode} 
            onPress={setIsDarkMode} 
          />
          <SettingItem 
            icon={Bell} 
            title="Notifications" 
            type="switch" 
            value={notifications} 
            onPress={setNotifications} 
          />
        </View>

        <View className="mb-8">
          <Text className="text-muted-foreground font-bold mb-2 uppercase text-xs tracking-wider">Security</Text>
          <SettingItem 
            icon={Shield} 
            title="Change Password" 
            onPress={() => {}} 
          />
          <SettingItem 
            icon={Shield} 
            title="Privacy Policy" 
            onPress={() => {}} 
          />
        </View>

        <TouchableOpacity 
          className="flex-row items-center justify-center bg-destructive/10 h-12 rounded-xl mb-8"
          onPress={logout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="text-destructive font-bold ml-2">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
