import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useTheme } from '../constants/ui-design-system';
import { useAuth } from '../hooks/AuthContext';

export default function ProfileMenu() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  if (!user) {
    return (
      <View style={[theme.container] as any}>
        <Text style={[theme.title] as any}>Please Login</Text>
        <Button title="Login" onPress={() => navigation.navigate('login')} />
      </View>
    );
  }

  return (
    <View style={[theme.container] as any}>
      <Text style={[theme.title] as any}>Profile Menu</Text>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
