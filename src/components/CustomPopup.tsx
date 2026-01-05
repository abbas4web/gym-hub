import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PopupType = 'success' | 'error' | 'warning' | 'info';

interface CustomPopupProps {
  visible: boolean;
  type?: PopupType;
  title: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  autoClose?: boolean;
}

const { width } = Dimensions.get('window');

const CustomPopup: React.FC<CustomPopupProps> = ({
  visible,
  type = 'info',
  title,
  message,
  onClose,
  confirmText = 'OK',
  onConfirm,
  cancelText,
  autoClose = true,
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide down
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: insets.top + 10,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close success/info popups
      if (autoClose && (type === 'success' || type === 'info') && !onConfirm && !cancelText) {
        const timer = setTimeout(() => {
          handleClose();
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      // Move off screen when not visible (initial state)
      slideAnim.setValue(-200);
      opacityAnim.setValue(0);
    }
  }, [visible, insets.top]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    handleClose();
  };

  if (!visible) return null;

  const getIcon = () => {
    const iconProps = { size: 24, strokeWidth: 2.5 };
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} color="#84cc16" />;
      case 'error':
        return <XCircle {...iconProps} color="#ef4444" />;
      case 'warning':
        return <AlertCircle {...iconProps} color="#f59e0b" />;
      default:
        return <Info {...iconProps} color="#3b82f6" />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.islandContainer}>
        <View style={styles.contentRow}>
          <View style={styles.iconBox}>{getIcon()}</View>
          <View style={styles.textBox}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.message} numberOfLines={2}>{message}</Text>
          </View>
          
          {(onConfirm || cancelText) ? (
            <View style={styles.actionRow}>
              {cancelText && (
                <TouchableOpacity onPress={handleClose} style={styles.actionBtn}>
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={18} color="#a1a1aa" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  islandContainer: {
    backgroundColor: 'rgba(26, 29, 36, 0.95)',
    borderRadius: 24,
    padding: 12,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textBox: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 1,
  },
  message: {
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 16,
  },
  closeBtn: {
    padding: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  confirmBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#84cc16',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  confirmText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d0f14',
  },
});

export default CustomPopup;
