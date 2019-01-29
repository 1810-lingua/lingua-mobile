import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import firebase from '../firebase';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: ''
    }
  }

  handlePress = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
    } catch (err) {
      this.setState({error: err.message});
    }
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
          title='Register' 
          onPress={this.handlePress} 
          style={{marginTop: '5%'}}
        />
        <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('Login')} 
        />
      </View>
    );
  }
}

export default Register;