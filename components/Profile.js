import React, { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Button } from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import firebase from "../firebase";
import {updateLanguage} from '../store/language'
import {updateWords} from '../store/words'


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: this.props.language,
      words: this.props.words
    };
  }

  changeHandler = async (value) => {
    console.log(value.toLowerCase())
    const { uid } = await firebase.auth().currentUser;
    this.unsubscribe = await firebase
      .database()
      .ref(`${uid}/${value.toLowerCase()}`)
      .on("value", snapshot => {
        const words = Object.values(snapshot.val() || {});
        this.props.updateWords(words);
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
        onChangeText = {value => this.changeHandler(value)}
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
  language: state.language.language,
  words: state.words.words
});

const mapDispatchToProps = dispatch => ({
  updateLanguage: lang => dispatch(updateLanguage(lang)),
  updateWords: words => dispatch(updateWords(words))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
