import React from 'react';
import { Button, Text, View } from 'react-native';
import { useTheme } from '../constants/ui-design-system';
import { useAuth } from '../hooks/AuthContext';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();

  if (!user) return <Text style={[theme.error] as any}>Not logged in</Text>;

  return (
    <View style={[theme.container] as any}>
      <Text style={[theme.title] as any}>Profile</Text>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Notifications: {user.notificationsEnabled ? 'Enabled' : 'Disabled'}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
