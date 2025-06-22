import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useTheme } from '../constants/ui-design-system';
import { useAuth } from '../hooks/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    try {
      await login(email, password);
      // Navigation handled by AuthGate
    } catch (e) {
      setError('Invalid credentials');
    }
  };

  return (
    <View style={[theme.container] as any}>
      <Text style={[theme.title] as any}>Login</Text>
      <TextInput
        style={[theme.input] as any}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={[theme.input] as any}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={[theme.error] as any}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      {/* Navigation to Register handled by AuthGate stack */}
    </View>
  );
}
