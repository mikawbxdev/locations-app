import { StyleSheet, FlatList, Alert, View } from 'react-native';
import { Card, ActivityIndicator, Text, Button } from 'react-native-paper';
import { router } from 'expo-router';

import SimpleScrollView from '@/components/SimpleScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocations } from '@/contexts/LocationsContext';
import { Location } from '@/contexts/LocationsContext';

export default function LocationsScreen() {
  const { locations, loading, error } = useLocations();

  const { geocodeLocation } = useLocations();

  const handleMapNavigation = async (locationName: string) => {
    try {
      const coordinates = await geocodeLocation(locationName);
      
      if (coordinates) {
        router.push({
          pathname: '/map',
          params: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            locationName: locationName
          }
        });
      } else {
        Alert.alert(
          "Location Not Found",
          `Could not find coordinates for "${locationName}". Please try a different location name.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while trying to find this location. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  const renderLocationCard = ({ item }: { item: Location }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <ThemedText type="defaultSemiBold" style={styles.locationName}>{item.name}</ThemedText>
          <Button 
            icon="map-marker" 
            mode="text" 
            onPress={() => handleMapNavigation(item.name)}
            style={styles.mapButton}
          >
            Map
          </Button>
        </View>
        <ThemedText style={styles.locationDescription}>{item.description}</ThemedText>
        
        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <IconSymbol
              key={index}
              name={index < item.rating ? "star.fill" : "star"}
              size={16}
              color={index < item.rating ? "#FFD700" : "#808080"}
              style={styles.star}
            />
          ))}
        </View>
        
        <ThemedText style={styles.dateText}>
          Added on {item.createdAt.toLocaleDateString()}
        </ThemedText>
      </Card.Content>
    </Card>
  );

  return (
    <SimpleScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Locations</ThemedText>
      </ThemedView>
      
      {locations.length === 0 ? (
        <ThemedText>Your saved locations will appear here.</ThemedText>
      ) : (
        <FlatList
          data={locations}
          renderItem={renderLocationCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SimpleScrollView>
  );
}

const styles = StyleSheet.create({

  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 18,
    flex: 1,
  },
  mapButton: {
    marginLeft: 8,
  },
  locationDescription: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
  },
  listContainer: {
    paddingBottom: 16,
  },
});