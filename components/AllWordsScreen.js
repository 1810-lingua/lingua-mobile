import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ScrollView, StyleSheet } from "react-native";
import { ButtonGroup } from "react-native-elements";
import ListItem from "./react-native-elements/ListItem";
import Swipeout from "react-native-swipeout";
import firebase from "../firebase";
import { updateWords, filteredWords } from "../store/words";

class AllWordsScreen extends Component {
  static navigationOptions = {
    title: "Words"
  };
  
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      // language: this.props.language || 'spanish'
    };
  }
  
  componentDidMount = async () => {
    if (this.props.words.length === 0) {
      const { uid } = await firebase.auth().currentUser;
      this.unsubscribe = await firebase
      .database()
      .ref(`${uid}/${this.props.language}`)
      .on("value", snapshot => {
        const words = Object.values(snapshot.val() || {});
        this.props.updateWords(words);
        this.props.filteredWords(words);
      });
    } 
  };
  
  componentWillUnmount = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };
  
  deleteWord = async word => {
    const { uid } = await firebase.auth().currentUser;
    await firebase
    .database()
    .ref(`${uid}/${this.props.language}/${word}`)
    .remove();
  };
  
  markLearned = async word => {
    const { uid } = await firebase.auth().currentUser;
    await firebase
    .database()
    .ref(`${uid}/${this.props.language}/${word}`)
    .update({ learned: true });
  };
  
  markUnlearned = async word => {
    const { uid } = await firebase.auth().currentUser;
    await firebase
    .database()
    .ref(`${uid}/${this.props.language}/${word}`)
    .update({ learned: false });
  };
  
  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };
  
  getFilteredWords = () => {
    const { words, learned, unlearned } = this.props;
    const { selectedIndex } = this.state;
    if (selectedIndex === 0) {
      return words;
    } else if (selectedIndex === 1) {
      return unlearned;
    } else {
      return learned;
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
            this.deleteWord(word.word);
          }
        }
      ];
    } else if (selectedIndex === 1) {
      return word => [
        {
          text: "Delete",
          backgroundColor: "red",
          onPress: () => {
            this.deleteWord(word.word);
          }
        },
        {
          text: "Archive",
          backgroundColor: "green",
          onPress: () => {
            this.markLearned(word.word);
          }
        }
      ];
    } else {
      return word => [
        {
          text: "Delete",
          backgroundColor: "red",
          onPress: () => {
            this.deleteWord(word.word);
          }
        },
        {
          text: "Unarchive",
          backgroundColor: "green",
          onPress: () => {
            this.markUnlearned(word.word);
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
  flex: {
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

const mapStateToProps = state => ({
  words: state.words.words,
  language: state.words.language,
  learned: state.words.learned,
  unlearned: state.words.unlearned
});

const mapDispatchToProps = dispatch => ({
  updateWords: words => dispatch(updateWords(words)),
  filteredWords: words => dispatch(filteredWords(words))
});
export default connect(mapStateToProps, mapDispatchToProps)(AllWordsScreen);