import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'expired' | 'expiring' | 'warning' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'active':
        return 'bg-primary/20 border-primary';
      case 'expired':
        return 'bg-destructive/20 border-destructive';
      case 'expiring':
        return 'bg-yellow-500/20 border-yellow-500';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500';
      case 'default':
        return 'bg-muted border-border';
      default:
        return 'bg-muted border-border';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'active':
        return 'text-primary';
      case 'expired':
        return 'text-destructive';
      case 'expiring':
        return 'text-yellow-500';
      case 'warning':
        return 'text-yellow-500';
      case 'default':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <View className={`px-2 py-1 rounded-md border ${getVariantClasses()} ${className}`}>
      <Text className={`text-xs font-bold ${getTextClasses()}`}>
        {children}
      </Text>
    </View>
  );
};
