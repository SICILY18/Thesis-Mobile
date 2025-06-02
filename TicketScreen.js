import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TicketScreen() {
  const navigation = useNavigation();
  const [accountNumber] = useState('5119-0120-0173');
  const [category, setCategory] = useState('');
  const [concern, setConcern] = useState('');
  const [description, setDescription] = useState('');
  // Placeholder for image upload
  const [image, setImage] = useState(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Send Ticket</Text>
        {/* Account Number Dropdown */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Account Number *</Text>
          <TouchableOpacity style={styles.inputBox}>
            <Text style={styles.inputText}>{accountNumber}</Text>
            <Ionicons name="chevron-down" size={22} color="#888" />
          </TouchableOpacity>
        </View>
        {/* Category Dropdown */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Category *</Text>
          <TouchableOpacity style={styles.inputBox}>
            <Text style={styles.inputText}>{category || 'Select Category'}</Text>
            <Ionicons name="chevron-down" size={22} color="#888" />
          </TouchableOpacity>
        </View>
        {/* Particular Concern Dropdown */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Particular Concern *</Text>
          <TouchableOpacity style={styles.inputBox}>
            <Text style={styles.inputText}>{concern || 'Select Concern'}</Text>
            <Ionicons name="chevron-down" size={22} color="#888" />
          </TouchableOpacity>
        </View>
        {/* Description */}
        <Text style={styles.descLabel}>Tell us about your concern.</Text>
        <View style={styles.textAreaWrapper}>
          <TextInput
            style={styles.textArea}
            placeholder="Description *"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>
        {/* Image Upload */}
        <View style={styles.uploadBox}>
          <View style={styles.uploadImageBox}>
            <Ionicons name="image" size={32} color="#bbb" />
          </View>
          <TouchableOpacity style={styles.uploadBtn}>
            <Text style={styles.uploadBtnText}>UPLOAD IMAGE</Text>
          </TouchableOpacity>
        </View>
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 18,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    marginLeft: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bbb',
    borderRadius: 10,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 16,
    color: '#222',
  },
  descLabel: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
    marginLeft: 2,
  },
  textAreaWrapper: {
    borderWidth: 2,
    borderColor: '#bbb',
    borderRadius: 10,
    marginBottom: 18,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 90,
    fontSize: 16,
    color: '#222',
    padding: 14,
    textAlignVertical: 'top',
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#bbb',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 12,
    marginBottom: 28,
  },
  uploadImageBox: {
    width: 70,
    height: 70,
    backgroundColor: '#ededed',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  uploadBtn: {
    borderWidth: 1.5,
    borderColor: '#1a237e',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
  },
  uploadBtnText: {
    color: '#1a237e',
    fontWeight: 'bold',
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: '#1a237e',
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 