import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen(props) {
  const navigation = useNavigation();
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
      <View style={styles.headerBlue}>
        <TouchableOpacity style={styles.menuIconWrapper}>
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
        <View style={styles.logoCircleWrapper}>
          <Image source={require('./assets/logo.png')} style={styles.logoCircle} />
        </View>
        <View style={styles.notificationWrapper}>
          <Ionicons name="notifications-outline" size={30} color="#fff" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>70</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.scrollViewContent} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Account Card */}
        <View style={styles.accountCardNew}>
          <View style={styles.accountCardLeftNew}>
            <View style={styles.accountStatusCircle} />
            <Text style={styles.activeStatusNew}>• Active</Text>
          </View>
          <View style={styles.accountCardRightNew}>
            <Text style={styles.accountNumberNew}>Account No: 5119-0120-0173</Text>
            <Text style={styles.balanceNew}>-P 0.44</Text>
            <Text style={styles.statementDateNew}>Statement Date: May 6, 2025</Text>
          </View>
          <AntDesign name="right" size={24} color="#bbb" style={styles.accountArrow} />
        </View>
        {/* Due Date Row */}
        <View style={styles.dueDateRow}>
          <Text style={styles.dueDateTextNew}>Due: May 16, 2025</Text>
          <Text style={styles.paidStatusNew}>PAID</Text>
        </View>
        {/* Services Row */}
        <Text style={styles.sectionTitleNew}>Services</Text>
        <View style={styles.servicesRowNew}>
          <TouchableOpacity style={styles.serviceItemNew}>
            <View style={styles.serviceIconBox}><Feather name="file-text" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceTextNew}>Send Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItemNew}>
            <View style={styles.serviceIconBox}><Feather name="bookmark" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceTextNew}>Track your Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItemNew}>
            <View style={styles.serviceIconBox}><Feather name="book-open" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceTextNew}>Billing Information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItemNew}>
            <View style={styles.serviceIconBox}><Feather name="watch" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceTextNew}>Meter Calculator</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceItemNew}>
            <View style={styles.serviceIconBox}><Feather name="grid" size={28} color="#1a237e" /></View>
            <Text style={styles.serviceTextNew}>Show more...</Text>
          </TouchableOpacity>
        </View>
        {/* Water Consumption Card */}
        <View style={styles.consumptionCardNew}>
          <Text style={styles.consumptionTitleNew}>Your water consumption last May</Text>
          <View style={styles.consumptionDetailsNew}>
            <Text style={styles.consumptionAmountNew}>7 m³</Text>
            <View style={styles.consumptionCircle} />
          </View>
        </View>
        {/* Consumption Report Card */}
        <View style={styles.consumptionReportSectionNew}>
          <Text style={styles.consumptionReportTitleNew}>Consumption Report as of May 2025</Text>
          <Text style={styles.averageUsageNew}>Average Usage for 12 months : 9 m³</Text>
          <View style={styles.chartPlaceholderNew}>
            <Text style={{ color: '#bbb', textAlign: 'center' }}>[ Consumption Chart Placeholder ]</Text>
          </View>
        </View>
      </ScrollView>
      {/* Bottom Navigation Tab Bar */}
      <View style={styles.tabBarNew}>
        <TouchableOpacity style={styles.tabItemNew} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home" size={24} color="#fff" />
          <Text style={[styles.tabLabelNew, { color: '#fff' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItemNew} onPress={() => navigation.navigate('AllServices')}>
          <Ionicons name="grid" size={24} color="#fff" />
          <Text style={[styles.tabLabelNew, { color: '#fff' }]}>All Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItemNew} onPress={() => navigation.navigate('Account')}>
          <Ionicons name="person" size={24} color="#fff" />
          <Text style={[styles.tabLabelNew, { color: '#fff' }]}>Account</Text>
        </TouchableOpacity>
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
  headerBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a237e',
    height: 110,
    paddingHorizontal: 18,
    paddingTop: 32,
  },
  menuIconWrapper: {
    flex: 1,
  },
  logoCircleWrapper: {
    flex: 2,
    alignItems: 'center',
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1a237e',
    resizeMode: 'contain',
  },
  notificationWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'relative',
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
  accountCardNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 12,
    marginTop: -32,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  accountCardLeftNew: {
    alignItems: 'center',
    marginRight: 16,
  },
  accountStatusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4caf50',
    marginBottom: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeStatusNew: {
    color: '#fff',
    fontSize: 13,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    top: 38,
    backgroundColor: 'transparent',
  },
  accountCardRightNew: {
    flex: 1,
  },
  accountNumberNew: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  balanceNew: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 2,
  },
  statementDateNew: {
    fontSize: 13,
    color: '#888',
  },
  accountArrow: {
    marginLeft: 8,
  },
  dueDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 8,
  },
  dueDateTextNew: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paidStatusNew: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitleNew: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  servicesRowNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginBottom: 18,
  },
  serviceItemNew: {
    alignItems: 'center',
    width: width / 5.5,
  },
  serviceIconBox: {
    backgroundColor: '#f2f7fd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  serviceTextNew: {
    fontSize: 12,
    color: '#222',
    textAlign: 'center',
  },
  consumptionCardNew: {
    backgroundColor: '#1a237e',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 12,
    marginBottom: 14,
    flexDirection: 'column',
  },
  consumptionTitleNew: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 8,
  },
  consumptionDetailsNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  consumptionAmountNew: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
  },
  consumptionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  consumptionReportSectionNew: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  consumptionReportTitleNew: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  averageUsageNew: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  chartPlaceholderNew: {
    height: 90,
    backgroundColor: '#ededed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarNew: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#1a237e',
    borderTopWidth: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItemNew: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelNew: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
}); 