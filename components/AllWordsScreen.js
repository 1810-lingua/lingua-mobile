
import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { ExpoLinksView } from "@expo/samples";

export default class AllWords extends React.Component {
  static navigationOptions = {
    title: "All Words"
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Here are all your words!</Text>
        {/* Go ahead and delete ExpoLinksView and replace it with your
         * content, we just wanted to provide you with some helpful links */}
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




