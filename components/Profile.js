import React, { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Button } from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import firebase from "../firebase";
import {gotLanguage, gotWords, filteredWords} from '../store/words'
import {updateWords} from '../store/words'


class Profile extends Component {
 
  changeHandler = async (value) => {
    const { uid } = await firebase.auth().currentUser;
    await firebase
      .database()
      .ref(`${uid}/${value.toLowerCase()}`)
      .on("value", snapshot => {
        const words = Object.values(snapshot.val() || {});
        this.props.gotWords(words);
        this.props.filteredWords(words);
        this.props.gotLanguage(value.toLowerCase());
      });
  }

  render() {
    let data = [{
      value: 'Spanish',
    }, {
      value: 'French',
    }, {
      value: 'German',
    }, {
      value: 'Italian',
    }, {
      value: 'Polish',
    }, {
      value: 'Portuguese',
    }];
    
    return (
      <View>
        <Dropdown
        label='Select Language'
        data={data}
        dropdownOffset= {{top: 40, left: 0}}
        onChangeText = {async value => {
            await this.changeHandler(value)
          }}
      />
        <Button
          onPress={() => firebase.auth().signOut()}
          style={styles.button}
          title="Log Out"
          color="steelblue"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "stretch"
  }
});
const mapStateToProps = state => ({
  language: state.words.language,
  words: state.words.words,
  learned: state.words.learned,
  unlearned: state.words.unlearned
});

const mapDispatchToProps = dispatch => ({
  gotLanguage: lang => dispatch(gotLanguage(lang)),
  gotWords: words => dispatch(gotWords(words)),
  filteredWords: words => dispatch(filteredWords(words))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
