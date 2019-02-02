import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ScrollView, StyleSheet } from "react-native";
import { ButtonGroup } from "react-native-elements";
import ListItem from "./react-native-elements/ListItem";
import Swipeout from "react-native-swipeout";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";

import firebase from "../firebase";

import { Ionicons } from "@expo/vector-icons";
import FlashCardScreen from "./FlashCardScreen";
import Profile from "./Profile";

import { updateWords } from "../store/words";

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
    this.unsubscribe = await firebase
      .database()
      .ref(`${uid}/spanish`)
      .on("value", snapshot => {
        const words = Object.values(snapshot.val() || {});
        this.props.updateWords(words);
      });
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
      .ref(`${uid}/spanish/${word}`)
      .remove();
  };

  markLearned = async word => {
    const { uid } = await firebase.auth().currentUser;
    await firebase
      .database()
      .ref(`${uid}/spanish/${word}`)
      .update({ learned: true });
  };

  markUnlearned = async word => {
    const { uid } = await firebase.auth().currentUser;
    await firebase
      .database()
      .ref(`${uid}/spanish/${word}`)
      .update({ learned: false });
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
      <View>
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
                containerStyle={styles.listItem}
                hideChevron
                titleNumberOfLines={0}
                subtitleNumberOfLines={0}
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
  listItem: {
    backgroundColor: "white"
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

const TabNavigator = createBottomTabNavigator({
  Words: {
    screen: connect(
      mapStateToProps,
      mapDispatchToProps
    )(AllWordsScreen),
    navigationOptions: {
      tabBarLabel: "Words",
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? "ios-list" : "ios-list"}
          size={26}
          style={{ color: tintColor }}
        />
      )
    }
  },
  FlashCards: {
    screen: FlashCardScreen,
    navigationOptions: {
      tabBarLabel: "Flash Cards",
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={
            focused
              ? "ios-checkmark-circle-outline"
              : "ios-checkmark-circle-outline"
          }
          size={26}
          style={{ color: tintColor }}
        />
      )
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: "Profile",
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? "ios-person" : "ios-person"}
          size={26}
          style={{ color: tintColor }}
        />
      )
    }
  }
});

export default createAppContainer(TabNavigator);
