import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const monthlyData = {
  2025: {
    Jan: 11,
    Feb: 8,
    Mar: 9,
    Apr: 10,
    May: 7,
  },
  2024: {
    Jan: 6,
    Feb: 9,
    Mar: 7,
    Apr: 5,
    May: 8,
    Jun: 11,
    Jul: 8,
    Aug: 15,
    Sep: 17,
    Oct: 7,
    Nov: 9,
    Dec: 8,
  }
};

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

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

  const renderConsumptionGraph = () => {
    const maxValue = 21; // Maximum value on Y-axis
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return (
      <View style={styles.graphContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          {[21, 18, 15, 12, 9, 6, 3, 0].map((value) => (
            <Text key={value} style={styles.yAxisLabel}>{value}</Text>
          ))}
        </View>
        
        {/* Graph bars */}
        <View style={styles.barsContainer}>
          {months.map((month, index) => {
            const value2025 = monthlyData[2025]?.[month] || 0;
            const value2024 = monthlyData[2024]?.[month] || 0;
            const height2025 = (value2025 / maxValue) * 200;
            const height2024 = (value2024 / maxValue) * 200;
            
            return (
              <View key={month} style={styles.barGroup}>
                <View style={styles.barWrapper}>
                  {value2025 > 0 && (
                    <View style={[styles.bar, styles.bar2025, { height: height2025 }]} />
                  )}
                  {value2024 > 0 && (
                    <View style={[styles.bar, styles.bar2024, { height: height2024 }]} />
                  )}
                </View>
                <Text style={styles.monthLabel}>{month}</Text>
                <Text style={styles.yearValue}>{value2025 || '-'}</Text>
                <Text style={styles.yearValue}>{value2024 || '-'}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Image source={require('./assets/logo.png')} style={styles.userAvatar} />
            <Text style={styles.userName}>Hello, {userData ? userData.username : 'User'}!</Text>
          </View>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>Home</Text>
            <Ionicons name="chevron-down" size={24} color="#1a237e" />
          </View>
        </View>

        {/* Account Card */}
        <View style={styles.accountCard}>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountNumber}>Account No: 5119-0120-0173</Text>
            <Text style={styles.balance}>-P 0.44</Text>
            <Text style={styles.statementDate}>Statement Date: May 6, 2025</Text>
          </View>
        </View>

        <View style={styles.dueDate}>
          <Text style={styles.dueDateText}>Due: May 16, 2025</Text>
          <Text style={styles.paidStatus}>PAID</Text>
        </View>

        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesGrid}>
          <TouchableOpacity style={styles.serviceItem} onPress={() => navigation.navigate('Ticket')}>
            <View style={styles.serviceIcon}>
              <Feather name="file-text" size={24} color="#1a237e" />
            </View>
            <Text style={styles.serviceText}>Send Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <Feather name="bookmark" size={24} color="#1a237e" />
            </View>
            <Text style={styles.serviceText}>Track your{'\n'}Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <Feather name="file" size={24} color="#1a237e" />
            </View>
            <Text style={styles.serviceText}>Billing{'\n'}Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <Feather name="activity" size={24} color="#1a237e" />
            </View>
            <Text style={styles.serviceText}>Meter{'\n'}Calculator</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <Feather name="grid" size={24} color="#1a237e" />
            </View>
            <Text style={styles.serviceText}>Show more...</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.consumptionCard}>
          <View style={styles.consumptionHeader}>
            <Text style={styles.consumptionTitle}>Your water consumption last May</Text>
            <View style={styles.waterDrops}>
              <Ionicons name="water" size={24} color="#fff" />
              <Ionicons name="water" size={24} color="#fff" />
            </View>
          </View>
          <Text style={styles.consumptionValue}>7 m³</Text>
        </View>

        <View style={styles.reportContainer}>
          <Text style={styles.reportTitle}>Consumption Report as of May 2025</Text>
          <Text style={styles.averageUsage}>Average Usage for 12 months: 9 m³</Text>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#1a237e' }]} />
              <Text style={styles.legendText}>2025</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#c5cae9' }]} />
              <Text style={styles.legendText}>2024</Text>
            </View>
          </View>
          
          {renderConsumptionGraph()}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#1a237e" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid" size={24} color="#1a237e" />
          <Text style={styles.navText}>All Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#1a237e" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Account')}
        >
          <Ionicons name="person" size={24} color="#1a237e" />
          <Text style={styles.navText}>Account</Text>
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
    backgroundColor: '#1a237e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  scrollView: {
    flex: 1,
  },
  userHeader: {
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: '#1a237e',
  },
  accountCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  accountInfo: {
    marginTop: 8,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginVertical: 4,
  },
  statementDate: {
    fontSize: 14,
    color: '#666',
  },
  dueDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  dueDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  paidStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginLeft: 16,
    marginTop: 8,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '18%',
    alignItems: 'center',
    marginVertical: 8,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 12,
    color: '#1a237e',
    textAlign: 'center',
  },
  consumptionCard: {
    backgroundColor: '#1a237e',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  consumptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consumptionTitle: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  waterDrops: {
    flexDirection: 'row',
  },
  consumptionValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  reportContainer: {
    padding: 16,
  },
  reportTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  averageUsage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    color: '#666',
  },
  graphContainer: {
    flexDirection: 'row',
    height: 250,
    marginTop: 16,
  },
  yAxisLabels: {
    width: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#666',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  barGroup: {
    alignItems: 'center',
    width: 24,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
  },
  bar: {
    width: 10,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  bar2025: {
    backgroundColor: '#1a237e',
  },
  bar2024: {
    backgroundColor: '#c5cae9',
  },
  monthLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  yearValue: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#1a237e',
    marginTop: 4,
  },
}); 