import React, { Component } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native";

export default class FlashCardScreen extends Component {
  static navigationOptions = {
    title: 'Flash Cards'
  }

  render() {
    return (
      <Text>Here is a single Word Screen!</Text>
    );
  }
}