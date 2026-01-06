import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glass = false,
  ...props
}) => {
  return (
    <View
      className={`bg-card rounded-xl border border-border p-4 ${
        glass ? 'bg-opacity-80' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
