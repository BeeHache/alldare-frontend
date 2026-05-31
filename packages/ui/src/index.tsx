import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styled } from "nativewind";

const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, className }) => {
  return (
    <StyledButton
      onPress={onPress}
      className={`bg-primary p-4 rounded-xl items-center justify-center ${className}`}
    >
      <StyledText className="text-white font-bold text-lg">{title}</StyledText>
    </StyledButton>
  );
};
