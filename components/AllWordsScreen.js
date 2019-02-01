import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements'
import Swipeout from 'react-native-swipeout'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FlashCardScreen from './FlashCardScreen'
import Profile from './Profile'
import firebase from '../firebase';

import { updateWords } from '../store/words';

const msp = state => ({
  words: state.words.words
});

const mdp = dispatch => ({
  updateWords: (words) => dispatch(updateWords(words))
});

class AllWordsScreen extends Component {
  static navigationOptions = {
    title: 'All Words'
  }

  componentDidMount = async () => {
    const { uid } = await firebase.auth().currentUser;
    this.unsubscribe = await firebase.database().ref(`${uid}/spanish`).on('value', snapshot => {
      const words = Object.values(snapshot.val() || {});
      this.props.updateWords(words);
    });
  }

  componentWillUnmount = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  deleteWord = async (word) => {
    const { uid } = await firebase.auth().currentUser;
    await firebase.database().ref(`${uid}/spanish/${word}`).remove();
  }

  markLearned = async (word) => {
    const { uid } = await firebase.auth().currentUser;
      await firebase.database().ref(`${uid}/spanish/${word}`).update({ learned: true });
  }
  
  render() {
    const swipeBtns = word => ([
      {
        text: 'X',
        backgroundColor: 'red',
        onPress: () => { this.deleteWord(word.word) }
        },
      {
        text: 'Learned',
        backgroundColor: 'green',
        onPress: () => { this.markLearned(word.word) }
      }   
    ]);

    return (
      <ScrollView>
        {
          this.props.words.map((word, idx) => (
            <Swipeout key={idx} left={swipeBtns(word)}>
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
          ))
        }   
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: 'white'
  }
});

const TabNavigator = createBottomTabNavigator({
  AllWords: connect(msp, mdp)(AllWordsScreen),
  FlashCards: FlashCardScreen,
  Profile
});

export default createAppContainer(TabNavigator);