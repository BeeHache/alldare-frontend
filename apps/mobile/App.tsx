import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '@alldare/ui';
import { useHealth } from '@alldare/hooks';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function App() {
  const { status, isLoading } = useHealth();

  return (
    <StyledView className="flex-1 items-center justify-center bg-secondary p-6">
      <StyledText className="text-5xl font-bold text-primary">Alldare</StyledText>
      <StyledText className="text-white mt-2 text-lg">Mobile Application</StyledText>
      
      <StyledView className="mt-10 items-center">
        <StyledText className="text-gray-400 mb-4">
          Gateway: {isLoading ? "Checking..." : status?.status || "Offline"}
        </StyledText>
        
        <Button 
          title="Join the Community" 
          onPress={() => Alert.alert("Coming Soon", "Mobile registration is under construction.")}
        />
      </StyledView>

      <StatusBar style="light" />
    </StyledView>
  );
}
