import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import firebase from '../firebase';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: ''
    }
  }

  login = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
    } catch (err) {
      this.setState({error: err.message});
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate('AppStack');

        // CREATE DUMMY DATA
        firebase.database().ref(`/users/${user.uid}`).set([{ word: 'hi', translation: 'hola'}, { word: 'bye', translation: 'adios' }]);

      } else {
        this.props.navigation.navigate('AuthStack');
      }
    });
  }

  render() {
    return (
      <View>
        {
          this.state.error.length > 0 
          ? <FormValidationMessage>{this.state.error}</FormValidationMessage>
          : null
        }
        <FormLabel>Email</FormLabel>
        <FormInput onChangeText={(input) => this.setState({email: input})} />
        <FormLabel>Password</FormLabel>
        <FormInput
          textAlignVertical='center' 
          secureTextEntry={true} 
          password={true} 
          onChangeText={(input) => this.setState({password: input})} 
        />
        <Button
          textAlignVertical='center' 
          title='Login' 
          onPress={this.login}
          style={{marginTop: '5%'}}
        />
        <Button 
          title="Register" 
          onPress={() => this.props.navigation.navigate('Register')} 
        />
      </View>
    );
  }
}

export default Login;