import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button, Surface, Text } from 'react-native-paper';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
import Constants from 'expo-constants';

import { ThemedView } from '@/components/ThemedView';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.replace('/(tabs)/locations');
    } catch (e) {
      setError(
        'Authentication failed. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          {isLogin ? 'Login' : 'Sign Up'}
        </Text>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <Button
          mode="contained"
          onPress={handleAuth}
          loading={loading}
          style={styles.button}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
        
        <Button
          mode="text"
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
        >
          {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
        </Button>
      </Surface>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  surface: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  switchButton: {
    marginTop: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
});