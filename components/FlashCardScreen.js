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

import { updateWords } from '../store/words';
import { connect } from 'react-redux'
import firebase from 'firebase'

class flashCards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      unlearned: this.props.words.filter(word => !word.learned),
      idx: 0
    }
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

  nextWord() {
    if (this.state.idx < this.state.unlearned.length) {
      this.setState({idx: this.state.idx+1})
    }
    this.flipCard()
  }

  async knewThisWord(word) {
    const { uid } = await firebase.auth().currentUser;
    await firebase.database().ref(`${uid}/spanish/${word}`).update({ learned: true })
    this.nextWord()
  }

  didNotKnowWord() {
    this.nextWord()
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
                {
                  this.props.words[this.state.idx].word
                }
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
                {
                  this.props.words[this.state.idx].translation
                }
              </Text>
              <Button onPress={() => this.knewThisWord(this.props.words[this.state.idx].word)} style={styles.button}  title="I know this word" color="green" />
              <Button onPress={() => this.didNotKnowWord()} style={styles.button} title="I don't know this word" color="red" />
            </Animated.View>
          </View>
          <Text>Touch Card to flip</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  words: state.words.words
})

const mapDispatchToProps = dispatch => ({
  updateWords: (words) => dispatch(updateWords(words))
})

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
    backgroundColor: "pink",
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

export default connect(mapStateToProps, mapDispatchToProps)(flashCards)