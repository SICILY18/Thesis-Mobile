import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function AllServicesScreen(props) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Services</Text>
      </View>
      <View style={styles.content}>
        {/* Services Section */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesGrid}>
          <TouchableOpacity style={styles.serviceItem} onPress={() => navigation.navigate('Ticket')}>
            <View style={styles.iconBox}><Feather name="file-text" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceText}>Send Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.iconBox}><Feather name="bookmark" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceText}>Track your{"\n"}Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.iconBox}><Feather name="book-open" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceText}>Billing Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.iconBox}><MaterialIcons name="attach-money" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceText}>Pay Bills</Text>
          </TouchableOpacity>
        </View>
        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.servicesGrid}>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.iconBox}><Feather name="map-pin" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceText}>Payment Centers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.iconBox}><Feather name="phone-call" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Bottom Navigation Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home" size={24} color="#222" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('AllServices')}>
          <Ionicons name="grid" size={24} color="#1a237e" />
          <Text style={[styles.tabLabel, { color: '#1a237e' }]}>All Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Account')}>
          <Ionicons name="person" size={24} color="#222" />
          <Text style={styles.tabLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 20,
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  serviceItem: {
    width: width / 2.5,
    alignItems: 'center',
    marginBottom: 28,
  },
  iconBox: {
    backgroundColor: '#f2f7fd',
    borderRadius: 16,
    padding: 18,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#222',
    marginTop: 2,
  },
}); 