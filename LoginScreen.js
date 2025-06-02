import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Login button clicked');
    console.log('Attempting login for username:', username);
    // Replace with your backend API endpoint URL
    const apiUrl = 'http://192.168.100.34:3000/api/login';

    try {
      console.log('Sending login request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        console.log('Login successful:', data);
        // You might want to store the token (data.token) using AsyncStorage
        navigation.replace('Dashboard');
      } else {
        // Login failed
        console.error('Login failed:', data.message);
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Fetch request failed:', error);
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
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
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  logo: { width: 80, height: 80, alignSelf: 'center', marginTop: 24, marginBottom: 16, resizeMode: 'contain' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a237e', marginBottom: 24, marginTop: 8 },
  label: { fontSize: 16, color: '#1a237e', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#1da1f2', borderRadius: 6, padding: 10, marginBottom: 4, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: '#ccc', borderRadius: 3, marginRight: 6, backgroundColor: '#f5f5f5' },
  rememberMe: { color: '#888', fontSize: 14 },
  forgot: { color: '#1da1f2', fontSize: 14 },
  loginButton: { backgroundColor: '#1da1f2', borderRadius: 6, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
