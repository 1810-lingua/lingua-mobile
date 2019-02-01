import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements'
import { Button } from 'react-native-elements';
import Swipeout from 'react-native-swipeout'
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
  

  render() {
    const swipeBtns = word => ([
      {
      text: 'X',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => { this.deleteWord(word.word) }
      },
      {
        text: 'Learned',
        backgroundColor: 'green'
      }   
    ]);

    return (
      <ScrollView style={styles.container}>
        <Button
          onPress={() => firebase.auth().signOut()}
          title="Log Out"
        />
        <List containerStyle={{marginBottom: 20}}>
          {
            this.props.words.map((word, idx) => (
            <Swipeout key={idx} right={swipeBtns(word)}>
              <ListItem
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
          </List>    
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

const TabNavigator = createBottomTabNavigator({
  AllWords: connect(msp,mdp)(AllWordsScreen),
  FlashCards: FlashCardScreen
});

export default createAppContainer(TabNavigator);
