import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useTheme } from '../constants/ui-design-system';
import { useAuth } from '../hooks/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const { login } = useAuth();

  const handleRegister = async () => {
    setError('');
    try {
      // Register then login for seamless UX
      await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      await login(email, password);
    } catch (e) {
      setError('Registration failed');
    }
  };

  return (
    <View style={[theme.container] as any}>
      <Text style={[theme.title] as any}>Register</Text>
      <TextInput
        style={[theme.input] as any}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
