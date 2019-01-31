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
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {
            this.state.error.length > 0 
            ? <FormValidationMessage>{this.state.error}</FormValidationMessage>
            : null
          }
          <FormLabel>Email</FormLabel>
          <FormInput onChangeText={(input) => this.setState({email: input})} />
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry={true} 
            password={true} 
            onChangeText={(input) => this.setState({password: input})} 
          />
          <Button 
            title='Register' 
            buttonStyle={styles.button}
            onPress={this.handlePress} 
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -90,
  },
  innerContainer: {
    marginLeft: 30,
    marginRight: 30
  },
  button: {
    backgroundColor: '#5077eb',
    borderRadius: 4,
    width: '100%',
    marginTop: 20,
    paddingTop: 18,
    paddingBottom: 18,
    alignSelf: 'center'
  }
});

export default Register;