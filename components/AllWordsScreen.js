import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ScrollView, StyleSheet } from "react-native";
import { ButtonGroup } from "react-native-elements";
import ListItem from "./react-native-elements/ListItem";
import Swipeout from "react-native-swipeout";
import firebase from "../firebase";
import {
  updateWords,
  deleteWord,
  markLearned,
  markUnlearned
} from "../store/words";

const mapStateToProps = state => ({
  words: state.words.words
});

const mapDispatchToProps = dispatch => ({
  updateWords: words => dispatch(updateWords(words))
});

class AllWordsScreen extends Component {
  static navigationOptions = {
    title: "Words"
  };

  constructor() {
    super();
    this.state = {
      selectedIndex: 0
    };
  }

  componentDidMount = async () => {
    const { uid } = await firebase.auth().currentUser;
    this.props.updateWords(uid);
  };

  componentWillUnmount = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  getFilteredWords = () => {
    const { words } = this.props;
    const { selectedIndex } = this.state;
    if (selectedIndex === 0) {
      return words;
    } else if (selectedIndex === 1) {
      return words.filter(word => word.learned === false);
    } else {
      return words.filter(word => word.learned === true);
    }
  };

  getSwipeButtons = () => {
    const { selectedIndex } = this.state;
    if (selectedIndex === 0) {
      return word => [
        {
          text: "Delete",
          backgroundColor: "red",
          onPress: () => {
            deleteWord(word.word);
          }
        }
      ];
    } else if (selectedIndex === 1) {
      return word => [
        {
          text: "Delete",
          backgroundColor: "red",
          onPress: () => {
            deleteWord(word.word);
          }
        },
        {
          text: "Archive",
          backgroundColor: "green",
          onPress: () => {
            markLearned(word.word);
          }
        }
      ];
    } else {
      return word => [
        {
          text: "Delete",
          backgroundColor: "red",
          onPress: () => {
            deleteWord(word.word);
          }
        },
        {
          text: "Unarchive",
          backgroundColor: "green",
          onPress: () => {
            markUnlearned(word.word);
          }
        }
      ];
    }
  };

  render() {
    const buttons = ["All", "To Learn", "Learned"];
    const swipeButtons = this.getSwipeButtons();
    const filteredWords = this.getFilteredWords();

    return (
      <View style={{ flex: 1 }}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={this.state.selectedIndex}
          buttons={buttons}
          textStyle={{ color: "#7995b5" }}
          containerStyle={styles.buttonGroupContainer}
          selectedTextStyle={styles.buttonGroupSelectedText}
          selectedButtonStyle={styles.buttonGroupSelectedButton}
          innerBorderStyle={{ color: "#7995b5", width: 0.5 }}
        />
        <ScrollView>
          {filteredWords.map((word, idx) => (
            <Swipeout key={idx} left={swipeButtons(word)} autoClose={true}>
              <ListItem
                key={idx}
                title={word.word}
                subtitle={word.translation}
              />
            </Swipeout>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sflex: {
    flex: 1
  },
  buttonGroupContainer: {
    height: 40,
    backgroundColor: "white",
    borderColor: "#7995b5",
    borderWidth: 0.5
  },
  buttonGroupSelectedText: {
    color: "white"
  },
  buttonGroupSelectedButton: {
    backgroundColor: "#7995b5"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllWordsScreen);
