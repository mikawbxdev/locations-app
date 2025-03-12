import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';
import { useState, useEffect } from 'react';

import SimpleScrollView from '@/components/SimpleScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Country {
  name: {
    common: string;
  };
  capital: string[];
  flags: {
    png: string;
  };
}

export default function CapitalsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data = await response.json();
      setCountries(data);
      setError('');
    } catch (err) {
      setError('Failed to load countries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = countries.filter(country => {
    const searchLower = searchQuery.toLowerCase();
    return (
      country.name.common.toLowerCase().includes(searchLower) ||
      (country.capital?.[0]?.toLowerCase().includes(searchLower))
    );
  });

  const renderCountryCard = ({ item }: { item: Country }) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.flags.png }} style={styles.flag} />
      <Card.Content style={styles.cardContent}>
        <ThemedText type="defaultSemiBold" style={styles.countryName}>
          {item.name.common}
        </ThemedText>
        <ThemedText style={styles.capitalName}>
          Capital: {item.capital?.[0] || 'N/A'}
        </ThemedText>
      </Card.Content>
    </Card>
  );

  return (
    <SimpleScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Capitals</ThemedText>
      </ThemedView>

      <Searchbar
        placeholder="Search countries or capitals"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : error ? (
        <ThemedText style={styles.error}>{error}</ThemedText>
      ) : (
        <FlatList
          data={filteredCountries}
          renderItem={renderCountryCard}
          keyExtractor={item => item.name.common}
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
  searchBar: {
    marginBottom: 16,
    elevation: 0,
  },
  card: {
    marginBottom: 16,
  },
  flag: {
    height: 160,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  countryName: {
    fontSize: 18,
    marginBottom: 4,
  },
  capitalName: {
    fontSize: 14,
    opacity: 0.8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  loader: {
    marginTop: 32,
  },
  error: {
    textAlign: 'center',
    marginTop: 32,
    color: 'red',
  },
});