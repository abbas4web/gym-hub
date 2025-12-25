import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ClientProvider } from '@/contexts/ClientContext';
import { Home, Users, Receipt, Settings, BarChart3 } from 'lucide-react-native';

// Auth screens
import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';

// Main screens
import DashboardScreen from '@/screens/main/DashboardScreen';
import ClientsScreen from '@/screens/main/ClientsScreen';
import ClientDetailScreen from '@/screens/main/ClientDetailScreen';
import ReceiptsScreen from '@/screens/main/ReceiptsScreen';
import ReceiptDetailScreen from '@/screens/main/ReceiptDetailScreen';
import SettingsScreen from '@/screens/main/SettingsScreen';
import EditProfileScreen from '@/screens/main/EditProfileScreen';
import AnalyticsScreen from '@/screens/main/AnalyticsScreen';
import AddClientScreen from '@/screens/main/AddClientScreen';

// Placeholder for Subscription screen
const SubscriptionScreen = () => {
  const { View, Text, SafeAreaView } = require('react-native');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0d0f14', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ color: '#fcfcfc', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Subscription Plans</Text>
      <Text style={{ color: '#a1a1aa', textAlign: 'center' }}>Coming soon! Upgrade to Pro or Business plans.</Text>
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d0f14',
          borderTopColor: '#272a30',
        },
        tabBarActiveTintColor: '#84cc16',
        tabBarInactiveTintColor: '#a1a1aa',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen 
        name="Clients" 
        component={ClientsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
          tabBarLabel: 'Clients'
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
          tabBarLabel: 'Analytics'
        }}
      />
      <Tab.Screen 
        name="Receipts" 
        component={ReceiptsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} />,
          tabBarLabel: 'Receipts'
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          tabBarLabel: 'Settings'
        }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="AddClient" 
              component={AddClientScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="ClientDetail" 
              component={ClientDetailScreen}
            />
            <Stack.Screen 
              name="ReceiptDetail" 
              component={ReceiptDetailScreen}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
            />
            <Stack.Screen 
              name="Subscription" 
              component={SubscriptionScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <ClientProvider>
              <Navigation />
              <StatusBar style="light" />
            </ClientProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
