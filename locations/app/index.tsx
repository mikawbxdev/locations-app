import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

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

// Set persistence based on platform
// On web, we use browserLocalPersistence
// On native, Firebase handles persistence automatically

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Set persistence based on platform
    if (Platform.OS === 'web') {
      setPersistence(auth, browserLocalPersistence).catch(error => {
        console.error('Error setting persistence:', error);
      });
    } else {
      // For mobile platforms, explicitly set persistence
      setPersistence(auth, inMemoryPersistence).catch(error => {
        console.error('Error setting persistence:', error);
      });
    }
    
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);


  // Show loading or splash screen while checking auth state
  if (isAuthenticated === null) {
    return null;
  }

  // Redirect based on authentication status
return isAuthenticated ? <Redirect href="/(tabs)/locations" /> : <Redirect href="/auth/login" />;
}