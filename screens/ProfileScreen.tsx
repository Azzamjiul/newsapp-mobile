import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../constants/ui-design-system';
import { useAuth } from '../hooks/AuthContext';
import { getNotificationStatus } from '../services/userService';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, token, logout, toggleNotifications } = useAuth();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [isToggling, setIsToggling] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(user?.notificationsEnabled ?? false);

  useEffect(() => {
    let isMounted = true;
    const fetchNotificationStatus = async () => {
      if (!user || !token) return;
      try {
        const result = await getNotificationStatus(token);
        if (isMounted) {
          setNotificationEnabled(result.notificationsEnabled);
        }
      } catch (e) {
        // Optionally handle error
      }
    };
    if (isFocused) {
      fetchNotificationStatus();
    }
    return () => { isMounted = false; };
  }, [isFocused, user]);

  // Update notificationEnabled state when user.notificationsEnabled changes
  useEffect(() => {
    setNotificationEnabled(user?.notificationsEnabled ?? false);
  }, [user?.notificationsEnabled]);

  const handleToggleNotifications = async (value: boolean) => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await toggleNotifications(value);
      setNotificationEnabled(value);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to update notification settings. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsToggling(false);
    }
  };
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
    notificationHelpText: {
      fontSize: 14,
      color: theme.input.borderColor,
      marginTop: 8,
      marginBottom: 16,
      paddingHorizontal: 16,
      lineHeight: 20,
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
            <Switch
              trackColor={{ false: '#767577', true: theme.button.backgroundColor }}
              thumbColor={notificationEnabled ? '#FFFFFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleNotifications}
              value={notificationEnabled}
              disabled={isToggling}
            />
          </View>
          
          <Text style={styles.notificationHelpText}>
            {notificationEnabled 
              ? "You will receive push notifications about new articles and updates. We've registered your device for notifications."
              : "Enable to receive push notifications about new articles and updates."}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
