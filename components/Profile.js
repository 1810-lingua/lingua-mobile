import React, { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Button } from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import firebase from "../firebase";
import {gotLanguage, gotWords} from '../store/words'
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
    const { uid } = await firebase.auth().currentUser;
    await firebase
      .database()
      .ref(`${uid}/${value.toLowerCase()}`)
      .on("value", snapshot => {
        const words = Object.values(snapshot.val() || {});
        this.props.gotWords(words);
        this.props.gotLanguage(value.toLowerCase())
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
            console.log(value.toLowerCase())
            console.log('state: ' + this.props.language)
            console.log('words:' + this.props.words)
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
  words: state.words.words
});

const mapDispatchToProps = dispatch => ({
  gotLanguage: lang => dispatch(gotLanguage(lang)),
  gotWords: words => dispatch(gotWords(words))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
