import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { AntDesign } from '@expo/vector-icons';

const slides = [
  {
    key: 'one',
    title: 'Welcome to Hermosa Water',
    text: 'The only mobile app you need for your water needs.',
    image: require('./assets/welcome1.png'), 
    backgroundColor: '#fff',
  },
  {
    key: 'two',
    title: 'View and Pay Bills Online!',
    text: 'Easily access your billing statements, monthly consumptions and pay online.',
    image: require('./assets/welcome2.jpg'),
    backgroundColor: '#fff',
  },
  {
    key: 'three',
    title: 'Report Leaks',
    text: 'Report water pipe leaks in your community.',
    image: require('./assets/welcome3.png'),
    backgroundColor: '#fff',
  },
  {
    key: 'four',
    title: 'Get Notified',
    text: 'Receive latest announcements and water advisories.',
    image: require('./assets/welcome4.png'),
    backgroundColor: '#fff',
  },
];

export default function WelcomeScreen({ navigation }) {
  const _renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const _onDone = () => {
    navigation.replace('Login');
  };

  // Custom arrow button centered
  const _renderNextButton = () => (
    <View style={styles.centeredButtonWrapper}>
      <View style={styles.buttonCircle}>
        <AntDesign name="arrowright" color="#fff" size={24} />
      </View>
    </View>
  );

  const _renderDoneButton = () => (
    <View style={styles.centeredButtonWrapper}>
      <View style={styles.buttonCircle}>
        <AntDesign name="check" color="#fff" size={24} />
      </View>
    </View>
  );

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      onDone={_onDone}
      showSkipButton
      onSkip={_onDone}
      renderNextButton={_renderNextButton}
      renderDoneButton={_renderDoneButton}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  buttonCircle: {
    width: 50,
    height: 50,
    backgroundColor: '#1a237e',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 500, // Adjust as needed for vertical position
  },
});