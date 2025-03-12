import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  const theme = useTheme();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || 'Not logged in';

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <Appbar.Header
      style={[styles.header, { backgroundColor: theme.colors.background }]}
      mode="center-aligned"
    >
      <Appbar.Content title={title || userEmail} titleStyle={styles.title} />
      <Appbar.Action icon="logout" onPress={handleLogout} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    fontSize: 16,
  },
});