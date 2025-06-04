import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Added useFocusEffect
// import * as ImagePicker from 'expo-image-picker'; // Removed ImagePicker

export default function AccountScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [isUploading, setIsUploading] = useState(false); // Removed isUploading state

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      return () => {
        // Optional: any cleanup actions when the screen goes out of focus
      };
    }, [])
  );

  // Removed requestMediaLibraryPermission function

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Removed handleProfilePictureUpdate function

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile');
  };

  const handleChangePassword = () => { // Removed async as navigation is synchronous
    navigation.navigate('ChangePasswordScreen');
  };

  const handleChangeMobile = async () => {
    // Navigate to ChangeMobile screen when implemented
    Alert.alert('Coming Soon', 'Mobile number update feature will be available soon!');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* <TouchableOpacity onPress={handleProfilePictureUpdate} disabled={isUploading}> */}
            <View style={styles.profileImageContainer}>
              {isLoading ? (
                <View style={[styles.profileImage, styles.loadingContainer]}>
                  <ActivityIndicator size="large" color="#1a237e" />
                </View>
              ) : (
                <>
                  <Image
                    source={require('./assets/logo.png')} // Using default logo, actual profile pic logic was tied to upload
                    style={styles.profileImage}
                    resizeMode="contain"
                  />
                  {/* {isUploading && ( // Removed uploading overlay
                    <View style={styles.uploadingOverlay}>
                      <ActivityIndicator size="large" color="#fff" />
                    </View>
                  )} */}
                  {/* <View style={styles.editIconContainer}> // Removed edit icon
                    <Ionicons name="camera" size={20} color="#fff" />
                  </View> */}
                </>
              )}
            </View>
          {/* </TouchableOpacity> */}
          <Text style={styles.name}>{isLoading ? 'Loading...' : (userData?.full_name || 'Loading...')}</Text>
          <Text style={styles.username}>{isLoading ? 'Loading...' : (userData?.username || 'Loading...')}</Text>
          <Text style={styles.phoneNumber}>{isLoading ? 'Loading...' : (userData?.phone_number || 'Loading...')}</Text>
          <Text style={styles.email}>{isLoading ? 'Loading...' : (userData?.email || 'Loading...')}</Text>
        </View>

        {/* App Security Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-outline" size={24} color="#1a237e" />
            <Text style={styles.sectionTitle}>App Security</Text>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleUpdateProfile}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Update Profile</Text>
              <Text style={styles.menuItemSubtitle}>Change profile name</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Change Password</Text>
              <Text style={styles.menuItemSubtitle}>Nominate new password</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleChangeMobile}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Change Mobile Number</Text>
              <Text style={styles.menuItemSubtitle}>Update your mobile number for this account</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Quick Links Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="link-outline" size={24} color="#1a237e" />
            <Text style={styles.sectionTitle}>Quick Links</Text>
          </View>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemTitle, styles.logoutText]}>Logout</Text>
            </View>
            <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation - Moved outside ScrollView */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home-outline" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={24} color="#666" />
          <Text style={styles.navText}>All Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#1a237e" />
          <Text style={[styles.navText, styles.activeNavText]}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { // This style is now for the main root View
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContentContainer: { // New style for ScrollView's content
    paddingBottom: 60, // To avoid content being hidden by the fixed bottom nav
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
    marginTop: 60,
    elevation: 2,
  },
  profileImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#1a237e',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    color: '#1a237e',
  },
  loadingContainer: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
}); 