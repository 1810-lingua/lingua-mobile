import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import FlashCardScreen from './FlashCardScreen'
import firebase from '../firebase';

import { connect } from 'react-redux';
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
      const words = Object.values(snapshot.val());
      this.props.updateWords(words);
    });
  }

  componentWillUnmount = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  deleteWord = async (word) => {
    console.log('word', word);
    const { uid } = await firebase.auth().currentUser;
    await firebase.database().ref(`${uid}/spanish/${word}`).remove();
  }
  
  render() {
    return (
      <ScrollView style={styles.container}>
        <Button
          onPress={() => firebase.auth().signOut()}
          title="Log Out"
        />
        {
          this.props.words.map((word, idx) =>
            <Text key={idx} onPress={() => {this.deleteWord(word.word)}}>{word.word}</Text>
          )
        }
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

// connect(msp, mdp)(AllWordsScreen);

const TabNavigator = createBottomTabNavigator({
  AllWords: connect(msp,mdp)(AllWordsScreen),
  FlashCards: FlashCardScreen
});

export default createAppContainer(TabNavigator);