import { StyleSheet, Dimensions, Alert } from 'react-native';
import React, { useRef, useEffect, useState } from'react';
import MapView, { Marker, Region } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

export default function MapScreen() {
  const bottom = useBottomTabOverflow();
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const params = useLocalSearchParams<{ latitude?: string; longitude?: string; locationName?: string }>();
  
  // Parse coordinates from params
  const latitude = params.latitude ? parseFloat(params.latitude) : undefined;
  const longitude = params.longitude ? parseFloat(params.longitude) : undefined;
  const locationName = params.locationName;
  
  // Initial region - default or from params
  const initialRegion = latitude && longitude ? {
    latitude,
    longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : undefined;

  // Effect to animate to marker when coordinates are available
  useEffect(() => {
    if (latitude && longitude && mapRef.current && mapReady) {
      console.log('Animating to coordinates:', { latitude, longitude });
      // Increased delay to ensure map is fully loaded
      const timer = setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01, // Closer zoom than initialRegion
          longitudeDelta: 0.01,
        }, 1000); // 1 second animation
      }, 1000); // Increased from 500ms to 1000ms
      
      return () => clearTimeout(timer);
    }
  }, [latitude, longitude, mapReady]);
  
  return (
    <ThemedView style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        showsCompass
        initialRegion={initialRegion}
        onMapReady={() => {
          console.log('Map is ready');
          setMapReady(true);
        }}
      >
        {latitude && longitude && (
          <Marker 
            coordinate={{ latitude, longitude }}
            title={locationName || 'Selected Location'}
          />
        )}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});