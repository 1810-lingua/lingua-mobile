import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../firebase';
import AllWordsScreen from './AllWordsScreen'
import FlashCardScreen from './FlashCardScreen'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

class Component1 extends Component {
  render() {
    return (
    <View>
      <Text>Hello World</Text>
      <Button
        onPress={() => firebase.auth().signOut()}
        title="Log Out"
      />
    </View>
    )
  }
}

const TabNavigator = createBottomTabNavigator({
  Component1,
  AllWords: AllWordsScreen,
  FlashCards: FlashCardScreen
});


export default createAppContainer(TabNavigator);