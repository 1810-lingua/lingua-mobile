
import React from "react";
import { ExpoConfigView } from "@expo/samples";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native";

export default class FlashCardScreen extends React.Component {
  static navigationOptions = {
    title: "Flash Cards"
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <ScrollView>
        <Text>Here is a single Word Screen!</Text>
      </ScrollView>
    );
  }
}