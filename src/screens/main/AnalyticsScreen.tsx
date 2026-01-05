import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { TrendingUp, Users, DollarSign } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(TrendingUp, { className: { target: "style" } });
cssInterop(Users, { className: { target: "style" } });
cssInterop(DollarSign, { className: { target: "style" } });

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  const chartConfig = {
    backgroundGradientFrom: "#1a1d24",
    backgroundGradientTo: "#1a1d24",
    color: (opacity = 1) => `rgba(132, 204, 22, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`,
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [2000, 4500, 2800, 8000, 9900, 4300],
        color: (opacity = 1) => `rgba(132, 204, 22, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Revenue"]
  };

  const attendanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [45, 62, 58, 65, 50, 85, 30]
      }
    ]
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="py-6">
          <Text className="text-2xl font-bold text-foreground mb-6">Analytics</Text>

          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <DollarSign size={20} color="#84cc16" />
              <Text className="text-lg font-bold text-foreground ml-2">Revenue Overview</Text>
            </View>
            <LineChart
              data={revenueData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16,
                paddingRight: 40,
              }}
            />
          </View>

          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Users size={20} color="#84cc16" />
              <Text className="text-lg font-bold text-foreground ml-2">Weekly Attendance</Text>
            </View>
            <BarChart
              data={attendanceData}
              width={screenWidth - 32}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={{
                borderRadius: 16,
                paddingRight: 40,
              }}
            />
          </View>

          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] bg-card p-4 rounded-xl border border-border mb-4">
              <Text className="text-muted-foreground text-sm mb-1">Growth Rate</Text>
              <View className="flex-row items-center">
                <TrendingUp size={20} color="#84cc16" />
                <Text className="text-2xl font-bold text-foreground ml-2">+12%</Text>
              </View>
            </View>
            <View className="w-[48%] bg-card p-4 rounded-xl border border-border mb-4">
              <Text className="text-muted-foreground text-sm mb-1">Retention</Text>
              <View className="flex-row items-center">
                <Users size={20} color="#84cc16" />
                <Text className="text-2xl font-bold text-foreground ml-2">94%</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;
