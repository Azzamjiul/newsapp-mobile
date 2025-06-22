import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  getProfile,
  loginUser,
  registerDeviceToken,
  logoutUser as serviceLogoutUser,
  updateNotificationPreference
} from '../services/userService';
import { User } from '../types/api';
import { configureNotifications, registerForPushNotifications } from '../utils/notificationUtils';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleNotifications: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configure notifications
    configureNotifications();
    
    // Request notification permissions
    (async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('Notification permission status:', status);
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    })();
    
    // Load token and user from storage on mount
    (async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await getProfile(storedToken);
          setUser(profile);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token: newToken, user: newUser } = await loginUser({ email, password });
      setToken(newToken);
      setUser(newUser);
      await AsyncStorage.setItem('token', newToken);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
    serviceLogoutUser();
  };
  
  const toggleNotifications = async (enabled: boolean) => {
    if (!token || !user) return;
    
    try {
      setLoading(true);
      const response = await updateNotificationPreference(enabled, token);
      
      // If enabling notifications, register the device token
      if (enabled) {
        const deviceToken = await registerForPushNotifications();
        if (deviceToken) {
          await registerDeviceToken(deviceToken, token);
        }
      }
      
      // Update user state with new notification preference
      setUser(prev => prev ? { ...prev, notificationsEnabled: response.notificationsEnabled } : null);
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, toggleNotifications }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
