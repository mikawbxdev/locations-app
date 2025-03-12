import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
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

// Initialize Firebase if it hasn't been initialized yet
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // App already initialized
  app = initializeApp(firebaseConfig, 'secondary');
}

const db = getFirestore(app);
const auth = getAuth(app);

// Define the Location type
export type Location = {
  id: string;
  name: string;
  description: string;
  rating: number;
  createdAt: Date;
  userId?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

// Define the context type
type LocationsContextType = {
  locations: Location[];
  addLocation: (location: Omit<Location, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  getLocations: () => Location[];
  geocodeLocation: (locationName: string) => Promise<{latitude: number, longitude: number} | null>;
  loading: boolean;
  error: string | null;
};

// Create the context with default values
const LocationsContext = createContext<LocationsContextType>({
  locations: [],
  addLocation: async () => {},
  getLocations: () => [],
  geocodeLocation: async () => null,
  loading: false,
  error: null,
});

// Create a provider component
export function LocationsProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch locations from Firestore when the user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchLocations(user.uid);
      } else {
        // Clear locations when user logs out
        setLocations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch locations from Firestore
  const fetchLocations = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'locations'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const locationsList: Location[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        locationsList.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          rating: data.rating,
          createdAt: data.createdAt.toDate(),
          userId: data.userId,
        });
      });
      
      setLocations(locationsList);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to load locations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new location to Firestore
  const addLocation = async (newLocation: Omit<Location, 'id' | 'createdAt' | 'userId'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Add location to Firestore
      const docRef = await addDoc(collection(db, 'locations'), {
        ...newLocation,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      
      // Add to local state
      const location: Location = {
        ...newLocation,
        id: docRef.id,
        createdAt: new Date(),
        userId: user.uid,
      };
      
      setLocations((prevLocations) => [...prevLocations, location]);
    } catch (err) {
      console.error('Error adding location:', err);
      setError('Failed to add location. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLocations = () => {
    return locations;
  };

  // Geocode a location name to coordinates
  const geocodeLocation = async (locationName: string): Promise<{latitude: number, longitude: number} | null> => {
    try {
      // Using Nominatim OpenStreetMap API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  return (
    <LocationsContext.Provider value={{ locations, addLocation, getLocations, geocodeLocation, loading, error }}>
      {children}
    </LocationsContext.Provider>
  );

}

// Create a hook to use the context
export function useLocations() {
  return useContext(LocationsContext);
}