import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const BASE_URL = 'https://pc.beyourownself.co.za/';

const AuthSection: React.FC = () => {
  const handlePress = (path: string) => {
    Linking.openURL(`${BASE_URL}${path}`);
  };

  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.headerText}>Welcome to Phoenix Cleaners</Text>
      
      <View style={styles.buttonRow}>
        
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]} 
          onPress={() => handlePress('register')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.loginButton]} 
          onPress={() => handlePress('login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    margin:10,
  },
  loginButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  registerButton: {
    backgroundColor: '#f5f5f5', // Match your ActivityIndicator color
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
});

export default AuthSection;
