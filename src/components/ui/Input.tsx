import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { styled } from 'nativewind';

const StyledEye = styled(Eye);
const StyledEyeOff = styled(EyeOff);

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  containerClassName = '',
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry === true;

  return (
    <View className={containerClassName}>
      {/* {label && <Text className="text-foreground mb-2 font-medium">{label}</Text>} */}
      <View className="relative">
        <View className="flex-row items-center bg-secondary border border-border rounded-xl px-4 h-12">
          {icon && <View className="mr-3">{icon}</View>}
          <TextInput
            className="flex-1 text-foreground"
            placeholderTextColor="#71717a"
            secureTextEntry={isPassword && !isPasswordVisible}
            {...props}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="ml-2"
            >
              {isPasswordVisible ? (
                <StyledEyeOff size={20} color="#71717a" />
              ) : (
                <StyledEye size={20} color="#71717a" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      {error && <Text className="text-destructive text-sm mt-1">{error}</Text>}
    </View>
  );
};
