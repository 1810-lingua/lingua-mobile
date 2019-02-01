import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Button
} from "react-native";

export default class flashCards extends Component {
  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ["0deg", "180deg"]
    });
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ["180deg", "360deg"]
    });
    this.frontOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [1, 0]
    });
    this.backOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [0, 1]
    });
  }

  flipCard() {
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10
      }).start();
    }
  }

  render() {
    const frontAnimatedStyle = {
      transform: [{ rotateY: this.frontInterpolate }]
    };
    const backAnimatedStyle = {
      transform: [{ rotateY: this.backInterpolate }]
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.flipCard()}>
          <View>
            <Animated.View
              style={[
                styles.flipCard,
                frontAnimatedStyle,
                { opacity: this.frontOpacity }
              ]}
            >
              <Text style={styles.flipText}>
                This text is flipping on the front.
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.flipCard,
                styles.flipCardBack,
                backAnimatedStyle,
                { opacity: this.backOpacity }
              ]}
            >
              <Text style={styles.flipText}>
                This text is flipping on the back.
              </Text>
              <Button style={styles.button}  title="I don't know this word" color="red" />
              <Button style={styles.button} title="I know this word" color="green" />
            </Animated.View>
          </View>
          <Text>Touch Card to flip</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  flipCard: {
    width: 350,
    height: 600,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    backfaceVisibility: "hidden"
  },
  flipCardBack: {
    backgroundColor: "red",
    position: "absolute",
    top: 0
  },
  flipText: {
    width: 90,
    fontSize: 20,
    color: "white",
    fontWeight: "bold"
  },
  button: {
    flex: 2,
    alignItems: "stretch"
  }
});

AppRegistry.registerComponent("flashCards", () => flashCards);
