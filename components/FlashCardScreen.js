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
import { Speech } from "expo";
import { Ionicons } from "@expo/vector-icons";

import { updateWords } from "../store/words";
import { connect } from "react-redux";
import firebase from "firebase";

class flashCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unlearned: this.props.words.filter(word => !word.learned),
      idx: 0
    };
  }
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
        friction: 4,
        tension: 8
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 4,
        tension: 8
      }).start();
    }
  }

  nextWord() {
    if (this.state.idx < this.state.unlearned.length) {
      this.setState({ idx: this.state.idx + 1 });
    }
    this.flipCard();
  }

  async knewThisWord(word) {
    const { uid } = await firebase.auth().currentUser;
    await firebase
      .database()
      .ref(`${uid}/spanish/${word}`)
      .update({ learned: true });
    this.nextWord();
  }

  didNotKnowWord() {
    this.nextWord();
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
                {this.props.words[this.state.idx].word}
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
              <Text
                style={{
                  ...styles.flipText,
                  height: 250
                }}
              >
                {this.props.words[this.state.idx].translation}
                {"  "}
                <Ionicons
                  name="ios-megaphone"
                  size={30}
                  style={{ color: "steelblue" }}
                  onPress={() =>
                    Speech.speak(this.props.words[this.state.idx].translation, {
                      language: "es",
                      pitch: 1.0,
                      rate: 1.0
                    })
                  }
                />
              </Text>

              <Button
                onPress={() =>
                  this.knewThisWord(this.props.words[this.state.idx].word)
                }
                style={styles.button}
                title="I know this word"
                color="steelblue"
              />
              <Button
                onPress={() => this.didNotKnowWord()}
                style={styles.button}
                title="I don't know this word"
                color="steelblue"
              />
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  words: state.words.words
});

const mapDispatchToProps = dispatch => ({
  updateWords: words => dispatch(updateWords(words))
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  flipCard: {
    width: 350,
    height: 500,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "steelblue",
    backfaceVisibility: "hidden"
  },
  flipCardBack: {
    backgroundColor: "powderblue",
    position: "absolute",
    top: 0
  },
  flipText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "#585858",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1
  },
  button: {
    flex: 2,
    alignItems: "stretch"
  }
});

AppRegistry.registerComponent("flashCards", () => flashCards);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(flashCards);
