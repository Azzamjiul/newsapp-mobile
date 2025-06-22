import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/hooks/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

function AuthGate() {
  const { user, loading } = useAuth();
  if (loading) return null;
  // If not logged in, show login/register stack
  if (!user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    );
  }
  // If logged in, show main app stack
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
