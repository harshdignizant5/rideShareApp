import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '../../utils/colors';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  style,
  textStyle,
  icon,
  disabled,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.textPlaceholder;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'danger':
        return 'transparent'; // Outline style for logout usually
      case 'outline':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return colors.border;
    if (variant === 'danger') return colors.accent;
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'outline') return colors.textPrimary;
    if (variant === 'danger') return colors.accent;
    return colors.textWhite;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' || variant === 'danger' ? 1 : 0,
        },
        style,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && (
            <Text style={[styles.icon, { color: getTextColor() }]}>{icon}</Text>
          )}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: perfectSize(16),
    borderRadius: perfectSize(8),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: scaleAndClampFontSize(16),
    fontWeight: '700',
  },
  icon: {
    fontSize: scaleAndClampFontSize(18),
    marginRight: perfectSize(8),
  },
});

export default Button;
