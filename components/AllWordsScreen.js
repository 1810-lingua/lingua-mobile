import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FlashCardScreen from './FlashCardScreen'
import firebase from '../firebase';

class AllWordsScreen extends Component {
  static navigationOptions = {
    title: 'All Words'
  }
  
  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Here are all your words!</Text>
        <Button
          onPress={() => firebase.auth().signOut()}
          title="Log Out"
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});

const TabNavigator = createBottomTabNavigator({
  AllWords: AllWordsScreen,
  FlashCards: FlashCardScreen
});

export default createAppContainer(TabNavigator);


