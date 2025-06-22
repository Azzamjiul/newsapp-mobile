import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/ui-design-system';
import { useAuth } from '../hooks/AuthContext';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  
  // Define styles at the beginning so they can be used anywhere in the component
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.container.backgroundColor,
    },
    container: {
      flex: 1,
    },
    header: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.title.color,
    },
    content: {
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.title.color,
      marginVertical: 16,
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: '400',
      color: theme.input.borderColor,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.title.color,
    },
    logoutButton: {
      backgroundColor: theme.button.backgroundColor,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 32,
    },
    logoutText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    // Styles for not logged in state
    notLoggedInContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: theme.container.backgroundColor,
    },
    notLoggedInText: {
      fontSize: 16,
      color: theme.profileItemLabel.color,
      marginBottom: 32,
      textAlign: 'center',
      lineHeight: 24,
    },
    loginButton: {
      backgroundColor: theme.button.backgroundColor,
      borderRadius: 8,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
      width: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    }
  });

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notLoggedInContainer}>
          <Text style={[styles.title, { marginBottom: 16 }]}>Profile</Text>
          <Text style={styles.notLoggedInText}>
            You need to be logged in to view and manage your profile information.
          </Text>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => navigation.navigate('login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>GO TO LOGIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={[styles.content, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Profile Menu</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{user.name}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Notifications:</Text>
            <Text style={styles.infoValue}>{user.notificationsEnabled ? 'Enabled' : 'Disabled'}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
