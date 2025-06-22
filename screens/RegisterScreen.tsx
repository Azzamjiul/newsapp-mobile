import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/ui-design-system';
import { useAuth } from '../hooks/AuthContext';
import { registerUser } from '../services/userService';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const { login } = useAuth();
  const navigation = useNavigation<any>();

  const handleRegister = async () => {
    setError('');
    try {
      // Register then login for seamless UX
      await registerUser({ name, email, password });
      await login(email, password);
    } catch (e) {
      setError('Registration failed');
    }
  };

  const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: theme.container.backgroundColor,
    },
    registerCard: {
      width: '90%',
      alignSelf: 'center',
      // Remove borderRadius, backgroundColor, shadow, and elevation for a flat look
      // borderRadius: theme.card.borderRadius,
      // padding: theme.card.padding,
      // backgroundColor: theme.card.backgroundColor,
      // shadowColor: theme.card.shadowColor,
      // shadowOffset: theme.card.shadowOffset,
      // shadowOpacity: theme.card.shadowOpacity,
      // shadowRadius: theme.card.shadowRadius,
      // elevation: theme.card.elevation,
    },
    logo: {
      height: 80,
      width: 80,
      alignSelf: 'center',
      marginBottom: 24,
    },
    welcomeText: {
      textAlign: 'center',
      marginBottom: 8,
      fontSize: theme.title.fontSize,
      fontWeight: '700',
      color: theme.title.color,
    },
    subtitle: {
      textAlign: 'center',
      fontSize: 16,
      color: '#6B7280',
      marginBottom: 32,
    },
    inputContainer: {
      marginBottom: 24,
    },
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.registerCard}>
          <Image 
            source={require('../assets/images/react-logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          
          <Text style={[theme.title as any, styles.welcomeText]}>Create Account</Text>
          <Text style={styles.subtitle}>Join our news community</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[theme.input as any]}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            
            <TextInput
              style={[theme.input as any]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <TextInput
              style={[theme.input as any]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          {error ? <Text style={[theme.error as any]}>{error}</Text> : null}
          
          <TouchableOpacity style={[theme.button as any]} onPress={handleRegister}>
            <Text style={[theme.buttonText as any]}>Sign Up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[theme.secondaryButton as any]} 
            onPress={() => navigation.navigate('login')}
          >
            <Text style={[theme.secondaryButtonText as any]}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
