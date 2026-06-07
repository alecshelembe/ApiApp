import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Linking,
  Button,
} from 'react-native';
import axios from 'axios';
import ImageViewing from 'react-native-image-viewing';

const API_BASE_URL = 'https://localhost.beyourownself.co.za/api';
const IMAGE_BASE_URL = 'https://localhost.beyourownself.co.za/'; 

type SearchResult = {
  id: number;
  place_name: string;
  description: string;
  email: string;
  images: string; // JSON string array
  address: string;
  fee: string;
  extras: string[];
  note?: string;
  video_link?: string;
  comments?: any[];
};

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  // Modal & Viewer State
  const [selectedPost, setSelectedPost] = useState<SearchResult | null>(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch logic
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/search`, { query: debouncedQuery });
        setResults(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  // Image helpers
  const getImagesArray = (imgString: string | undefined) => {
    if (!imgString) return [];
    try {
      return JSON.parse(imgString).map((img: string) => ({ 
        uri: `${IMAGE_BASE_URL}${img.replace(/\\/g, '')}` 
      }));
    } catch (e) { return []; }
  };

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewVisible(true);
  };

  const handleCloseModal = () => {
    if (isImageViewVisible) {
      setIsImageViewVisible(false);
    } else {
      setSelectedPost(null);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for car wash..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {loading && <ActivityIndicator style={styles.loader} size="small" color="#000" />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem} 
            onPress={() => setSelectedPost(item)}
          >
            <Text style={styles.resultTitle}>{item.place_name}</Text>
		{item.fee > 0 && (
		  <Text style={styles.resultSubtitle}> • R {item.fee}</Text>
		)}
          </TouchableOpacity>
        )}
      />

      {/* PopUp Modal */}
      <Modal
        transparent={true}
        visible={!!selectedPost}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedPost && (
              <ScrollView style={styles.card}>
                <Text style={styles.placeName}>{selectedPost.place_name}</Text>

                {/* Horizontal Thumbnails */}
                {getImagesArray(selectedPost.images).length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {getImagesArray(selectedPost.images).map((img, index) => (
                      <TouchableOpacity key={index} onPress={() => openImageViewer(index)}>
                        <Image source={img} style={styles.thumbnail} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                <Text style={styles.label}>{selectedPost.address}</Text>
                <Text style={styles.description}>{selectedPost.description}</Text>
                <Text style={styles.label}>R {selectedPost.fee}</Text>

                {selectedPost.extras && (
                  <Text style={styles.label}>
                    {selectedPost.extras.join(', ')}
                  </Text>
                )}

                {selectedPost.note && (
                  <Text style={styles.note}>Note: {selectedPost.note}</Text>
                )}

                {selectedPost.video_link && (
                  <Text
                    style={styles.link}
                    onPress={() => Linking.openURL(selectedPost.video_link!)}
                  >
                    ▶ Watch Video
                  </Text>
                )}
              </ScrollView>
            )}

            <View style={styles.closeButtonWrapper}>
              <Button title="✕ Close" onPress={() => setSelectedPost(null)} color="#333" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Viewing Overlay */}
      <ImageViewing
        images={getImagesArray(selectedPost?.images)}
        imageIndex={currentImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
},
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    placeholderTextColor: 'black',
  },
  loader: { marginBottom: 10 },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultTitle: { fontWeight: 'bold', fontSize: 16 },
  resultSubtitle: { color: '#666', fontSize: 13, marginTop: 4 },
  
  // Modal Styles mirrored from your example
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  card: { marginBottom: 10 },
  placeName: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  thumbnail: { width: 100, height: 100, borderRadius: 8, marginBottom: 10, marginRight: 10 },
  label: { fontSize: 14, color: '#333', marginBottom: 4 },
  description: { fontSize: 14, marginBottom: 6, lineHeight: 20 },
  note: { fontStyle: 'italic', marginBottom: 6, color: '#555' },
  email: { color: 'blue', textDecorationLine: 'underline', marginBottom: 6 },
  link: { color: 'blue', fontWeight: 'bold', marginBottom: 6 },
  closeButtonWrapper: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default SearchComponent;
