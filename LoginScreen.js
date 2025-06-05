import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    console.log('Attempting login...');

    try {
      console.log('Sending request to server...');
      const response = await fetch('http://172.16.109.33:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      });

      console.log('Server response received:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Login successful, storing user data...');
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        console.log('Navigating to Dashboard...');
        setIsLoading(false); // Set loading to false before navigation
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else {
        console.log('Login failed:', data.message);
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Connection Error',
        'Could not connect to the server. Please check your internet connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!isLoading}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
      <View style={styles.row}>
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox} />
          <Text style={styles.rememberMe}>Remember Me</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot}>forgot password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 24 
  },
  logo: { 
    width: 80, 
    height: 80, 
    alignSelf: 'center', 
    marginTop: 24, 
    marginBottom: 16, 
    resizeMode: 'contain' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1a237e', 
    marginBottom: 24, 
    marginTop: 8 
  },
  label: { 
    fontSize: 16, 
    color: '#1a237e', 
    marginBottom: 4, 
    marginTop: 12 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#1da1f2', 
    borderRadius: 6, 
    padding: 10, 
    marginBottom: 4, 
    backgroundColor: '#fafafa' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 12 
  },
  checkboxRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  checkbox: { 
    width: 18, 
    height: 18, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 3, 
    marginRight: 6, 
    backgroundColor: '#f5f5f5' 
  },
  rememberMe: { 
    color: '#888', 
    fontSize: 14 
  },
  forgot: { 
    color: '#1da1f2', 
    fontSize: 14 
  },
  loginButton: { 
    backgroundColor: '#1da1f2', 
    borderRadius: 6, 
    paddingVertical: 12, 
    alignItems: 'center', 
    marginTop: 16 
  },
  loginButtonDisabled: {
    backgroundColor: '#a0d8ef'
  },
  loginButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
