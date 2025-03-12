import { useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Card, HelperText, ActivityIndicator } from 'react-native-paper';

import SimpleScrollView from '@/components/SimpleScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocations } from '@/contexts/LocationsContext';

export default function AddLocationScreen() {
  const { addLocation, loading, error } = useLocations();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [formError, setFormError] = useState('');

  
  const handleSubmit = async () => {
    setFormError('');
    
    if (name.trim() === '') {
      setFormError('Location name is required');
      return;
    }
    
    try {
      await addLocation({
        name,
        description,
        rating,
      });
      
      // Reset form on success
      setName('');
      setDescription('');
      setRating(0);
    } catch (err) {
      // Error is handled by the context and displayed below
      console.error('Error adding location:', err);
    }
  };
  
  return (
    <KeyboardAwareScrollView
    style={{ flex: 1 }}
    resetScrollToCoords={{ x: 0, y: 0 }}
    scrollEnabled={true}
  >
      <SimpleScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Add Location</ThemedText>
        </ThemedView>
        
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <TextInput
              label="Location Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              returnKeyType="done"
              blurOnSubmit={false}
            />
            
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.descriptionInput]}
              mode="outlined"
              multiline
              numberOfLines={3}
              scrollEnabled={false}
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
            />
            
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button key={star} onPress={() => setRating(star)}>
                      <IconSymbol
                      name={star <= rating ? "star.fill" : "star"}
                      size={24}
                      color={star <= rating ? "#FFD700" : "#808080"}
                      style={styles.star}
                      />
                  </Button>
                ))}
              </View>
            </View>
            
            <Button 
              mode="contained" 
              onPress={handleSubmit}
              style={styles.button}
            >
              Add Location
            </Button>
          </Card.Content>
        </Card>
      </SimpleScrollView>
    </KeyboardAwareScrollView>
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
  cardContent: {
    gap: 16,
  },
  input: {
    width: '100%',
  },
  descriptionInput: {
    height: 100,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 4,
  },
  button: {
    marginTop: 16,
  },
});