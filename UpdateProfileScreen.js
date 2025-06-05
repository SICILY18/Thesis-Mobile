import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // Re-added ImagePicker

export default function UpdateProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  // const [middleName, setMiddleName] = useState(''); // Middle Name removed
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  // const [currentPassword, setCurrentPassword] = useState(''); // Removed
  // const [newPassword, setNewPassword] = useState(''); // Removed
  // const [confirmNewPassword, setConfirmNewPassword] = useState(''); // Removed
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null);

  useEffect(() => {
    loadUserData();
    requestMediaLibraryPermission(); // Request permission on load
  }, []);

  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setUsername(parsedData.username || ''); // Use username from userData
        const nameParts = (parsedData.full_name || '').split(' ');
        setFirstName(parsedData.first_name || nameParts[0] || '');
        // Middle Name parsing removed
        if (nameParts.length >= 2) {
            setLastName(nameParts.slice(1).join(' ') || '');
        } else {
            setLastName('');
        }
        setEmail(parsedData.email || '');
        // Set initial profile image URI if available from user data (assuming it's a full URL)
        if (parsedData.profile_picture) {
             // The backend stores profile_picture as BYTEA, so we need to construct the URL
             // to fetch it via the /api/customers/:id/profile-picture GET endpoint
            setProfileImageUri(`http://172.16.109.33:3000/api/customers/${parsedData.id}/profile-picture?t=${new Date().getTime()}`);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'First name and last name are required');
      return;
    }

    // --- Profile Update Logic (Password change logic removed) ---
    try {
      setIsLoading(true);
      const profilePayload = {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: userData.phone_number, // Preserve existing phone number
      };

      const profileUpdateResponse = await fetch(`http://172.16.109.33:3000/api/customers/${userData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload),
      });

      const profileUpdateData = await profileUpdateResponse.json();

      if (profileUpdateResponse.ok) {
        // Update AsyncStorage with the latest user data from profile update
        const updatedUser = { ...userData, ...profileUpdateData.user }; // Merge with existing userData to keep all fields
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        setUserData(updatedUser); // Update local state as well

        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Profile update failed
        throw new Error(profileUpdateData.message || 'Failed to update profile information.');
      }
    } catch (profileError) {
      console.error('Error updating profile:', profileError);
      Alert.alert('Profile Update Error', profileError.message || 'Failed to update profile information.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Reduced quality for faster uploads
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedImageUri = result.assets[0].uri;
      setProfileImageUri(pickedImageUri); // Show preview immediately

      // Now, upload the picked image
      if (userData && userData.id) {
        await uploadProfilePictureToServer(userData.id, pickedImageUri);
      }
    }
  };

  const uploadProfilePictureToServer = async (userId, imageUri) => {
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`; // Default to jpeg

    const formData = new FormData();
    formData.append('photo', { uri: imageUri, name: filename, type });

    try {
      setIsLoading(true); // Indicate loading for image upload
      const response = await fetch(`http://172.16.109.33:3000/api/customers/${userId}/profile-picture`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'multipart/form-data' // Let fetch set this with boundary
        },
      });
      const responseData = await response.json();
      if (response.ok && responseData.success) {
        Alert.alert('Success', 'Profile picture updated!');
        // Update user data in AsyncStorage and state if backend returns updated user object
        if (responseData.user) {
            const updatedUser = { ...userData, ...responseData.user, profile_picture: profileImageUri }; // Use the local URI for immediate display
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            setUserData(updatedUser);
             // Force refresh of image by appending a timestamp
            setProfileImageUri(`http://172.16.109.33:3000/api/customers/${userId}/profile-picture?t=${new Date().getTime()}`);
        }
      } else {
        throw new Error(responseData.message || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Error', error.message || 'Could not upload profile picture.');
      // Revert to old image if upload fails? Or keep preview? For now, keep preview.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.profileImageContainer}>
        <Image
          source={profileImageUri ? { uri: profileImageUri } : (userData?.profile_picture ? {uri: `http://172.16.109.33:3000/api/customers/${userData.id}/profile-picture?t=${new Date().getTime()}`} : require('./assets/logo.png'))}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            editable={true} // Username is now editable
          />
          {/* Note for username might need to be re-evaluated or removed if username isn't tied to real name */}
          <Text style={styles.note}>Note: Please use your real name</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />
        </View>

        {/* Middle Name input group removed */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password input fields removed */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { // This style is now for the main root View
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContentContainer: { // New style for ScrollView's content
    paddingBottom: 24, // Add some padding at the bottom
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1a237e',
  },
  cameraButton: {
    position: 'absolute',
    right: '35%',
    bottom: 0,
    backgroundColor: '#1a237e',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1a237e',
  },
  saveButton: {
    backgroundColor: '#1a237e',
  },
  cancelButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 