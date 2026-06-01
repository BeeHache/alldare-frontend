import React from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  StyleSheet,
  Platform
} from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  error,
  className 
}) => {
  return (
    <StyledView className={`w-full mb-4 ${className}`}>
      {label && <StyledText className="text-white mb-2 font-semibold text-sm">{label}</StyledText>}
      <StyledTextInput
        className={`bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} text-white p-4 rounded-xl text-base`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      {error && <StyledText className="text-red-500 mt-1 text-xs">{error}</StyledText>}
    </StyledView>
  );
};

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading, 
  disabled,
  className 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary': return 'bg-slate-700';
      case 'outline': return 'bg-transparent border border-slate-700';
      default: return 'bg-blue-600';
    }
  };

  return (
    <StyledTouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`p-4 rounded-xl items-center justify-center flex-row ${getVariantClasses()} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <StyledText className="text-white font-bold text-lg">{title}</StyledText>
      )}
    </StyledTouchableOpacity>
  );
};

export const Card = styled(View, "bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800");
