import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  // Placeholder for more complex components like Chart
  const renderConsumptionChart = () => (
    <View style={styles.chartPlaceholder}>
      <Text style={{ color: '#ccc' }}>[ Consumption Chart Placeholder ]</Text>
      {/* Integrate a charting library here, e.g., react-native-chart-kit */}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerWave} />{/* Placeholder for the wave background */}
        <View style={styles.headerContent}>
          <Ionicons name="menu" size={30} color="#fff" style={styles.menuIcon} />
          <Image source={require('./assets/logo.png')} style={styles.logo} />{/* Replace with your logo */}
          <View style={styles.notificationContainer}>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>70</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollViewContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeTextContainer}>
             <AntDesign name="user" size={24} color="#1a237e" />
            <Text style={styles.welcomeText}>Hello, Faith Jane Cielo!</Text>
          </View>
          <View style={styles.accountSelector}>
            <View style={styles.dropdownPlaceholder}>
              <Text>Home</Text>
               <AntDesign name="down" size={16} color="#333" />
            </View>
             <TouchableOpacity style={styles.addButton}>
              <AntDesign name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Card */}
        <TouchableOpacity style={styles.accountCard} onPress={() => navigation.navigate('AccountDetails')}>{/* Add navigation target */}
          <View style={styles.accountCardLeft}>
            {/* Placeholder for water drop icon */}
            <View style={styles.waterDropIconPlaceholder} />
            <Text style={styles.activeStatus}>• Active</Text>
          </View>
          <View style={styles.accountCardRight}>
            <Text style={styles.accountNumber}>Account No: 5119-0120-0173</Text>
            <Text style={styles.balance}>-P 0.44</Text>
            <Text style={styles.statementDate}>Statement Date: May 6, 2025</Text>
          </View>
          <AntDesign name="right" size={20} color="#ccc" />
        </TouchableOpacity>

        <View style={styles.dueDateContainer}>
            <Text style={styles.dueDateText}>Due: May 16, 2025</Text>
            <Text style={styles.paidStatus}>PAID</Text>
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesRow}>
            {/* Service Icons - Replace with actual icons and functionality */}
            <TouchableOpacity style={styles.serviceItem}>
               <Feather name="file-text" size={28} color="#1a237e" />
              <Text style={styles.serviceText}>Send Ticket</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.serviceItem}>
               <Feather name="bookmark" size={28} color="#1a237e" />
              <Text style={styles.serviceText}>Track your Ticket</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.serviceItem}>
               <Feather name="book-open" size={28} color="#1a237e" />
              <Text style={styles.serviceText}>Billing Information</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.serviceItem}>
               <Feather name="watch" size={28} color="#1a237e" />
              <Text style={styles.serviceText}>Meter Calculator</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.serviceItem}>
               <Feather name="grid" size={28} color="#1a237e" />
              <Text style={styles.serviceText}>Show more...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Water Consumption Section */}
        <View style={styles.consumptionCard}>
          <Text style={styles.consumptionTitle}>Your water consumption last May</Text>
          <View style={styles.consumptionDetails}>
            <Text style={styles.consumptionAmount}>7 m³</Text>
             {/* Placeholder for water drop icon */}
            <View style={styles.waterDropIconPlaceholderLarge} />
          </View>
        </View>

        {/* Consumption Report Section */}
        <View style={styles.consumptionReportSection}>
           <Text style={styles.consumptionReportTitle}>Consumption Report as of May 2025</Text>
           <Text style={styles.averageUsage}>Average Usage for 12 months : 9 m³</Text>
           {renderConsumptionChart()}
           {/* Legend */}
           <View style={styles.legendContainer}>
             <View style={styles.legendItem}>
               <View style={[styles.legendColor, { backgroundColor: '#1a237e' }]} />
               <Text style={styles.legendText}>2025</Text>
             </View>
              <View style={styles.legendItem}>
               <View style={[styles.legendColor, { backgroundColor: '#ccc' }]} />{/* Use a lighter color for 2024 */}
               <Text style={styles.legendText}>2024</Text>
             </View>
           </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation Placeholder */}
      {/* This would typically be a Tab Navigator */}
      <View style={styles.bottomNavPlaceholder}>
        <Text style={{ color: '#fff' }}>[ Bottom Navigation ]</Text>
         {/* Implement with @react-navigation/bottom-tabs */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light gray background
  },
  scrollViewContent: {
      flex: 1,
      padding: 16,
      paddingBottom: 80, // Add padding at the bottom to prevent content from being hidden by the bottom nav
  },
  header: {
    height: 180, // Adjust height as needed
    backgroundColor: '#1a237e', // Dark blue background
    overflow: 'hidden', // Hide the part of the wave that goes beyond the header
  },
  headerWave: {
    position: 'absolute',
    bottom: -50, // Adjust to position the wave correctly
    left: 0,
    right: 0,
    height: 100, // Height of the wave shape
    backgroundColor: '#f4f4f4', // Match the background color of the content area
    borderTopLeftRadius: 200, // Create the wave shape
    borderTopRightRadius: 200, // Create the wave shape
    transform: [{ scaleX: 2 }], // Stretch the wave horizontally
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40, // Adjust for status bar height
  },
  menuIcon: {
    // Styles for menu icon
  },
  logo: {
    width: 50, // Adjust size as needed
    height: 50, // Adjust size as needed
    resizeMode: 'contain',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  welcomeSection: {
    marginTop: -40, // Pull this section up into the wave
    marginBottom: 20,
    paddingHorizontal: 16,
  },
   welcomeTextContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 10,
   },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e', // Dark blue
    marginLeft: 8,
  },
  accountSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 10,
      justifyContent: 'space-between',
      elevation: 2, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
  },
   dropdownPlaceholder: {
     flexDirection: 'row',
     alignItems: 'center',
   },
  addButton: {
      backgroundColor: '#1da1f2', // Light blue
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
     elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  accountCardLeft: {
    backgroundColor: '#4caf50', // Green
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginRight: 15,
  },
   waterDropIconPlaceholder: {
     width: 30,
     height: 30,
     backgroundColor: '#fff', // Placeholder for white water drop icon
     borderRadius: 15, // Make it round for now
     marginBottom: 5,
   },
  activeStatus: {
    color: '#fff',
    fontSize: 12,
  },
  accountCardRight: {
    flex: 1,
    marginRight: 10,
  },
  accountNumber: {
    fontSize: 14,
    color: '#555',
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e', // Dark blue
    marginVertical: 4,
  },
  statementDate: {
    fontSize: 14,
    color: '#555',
  },
  dueDateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 16,
  },
  dueDateText: {
      fontSize: 16,
      color: '#d32f2f', // Reddish color for due date
      fontWeight: 'bold',
  },
  paidStatus: {
      fontSize: 16,
      color: '#4caf50', // Green for paid status
      fontWeight: 'bold',
  },
  servicesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e', // Dark blue
    marginBottom: 15,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // flexWrap: 'wrap', // Use if services might wrap to the next line
  },
  serviceItem: {
    alignItems: 'center',
    width: width / 5.5, // Adjust width based on number of items
  },
  serviceText: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    textAlign: 'center',
  },
  consumptionCard: {
    backgroundColor: '#1a237e', // Dark blue
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  consumptionTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  consumptionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consumptionAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
   waterDropIconPlaceholderLarge: {
     width: 50,
     height: 50,
     backgroundColor: '#fff', // Placeholder for white water drop icon
     borderRadius: 25, // Make it round for now
   },
   consumptionReportSection: {
       backgroundColor: '#fff',
       borderRadius: 8,
       padding: 16,
       marginBottom: 20,
         elevation: 2, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
   },
   consumptionReportTitle: {
       fontSize: 16,
       fontWeight: 'bold',
       color: '#555',
       marginBottom: 8,
   },
    averageUsage: {
        fontSize: 14,
        color: '#888',
        marginBottom: 16,
    },
    chartPlaceholder: {
        height: 150,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
        color: '#555',
    },
  bottomNavPlaceholder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Height of the bottom navigation bar
    backgroundColor: '#1a237e', // Dark blue
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 