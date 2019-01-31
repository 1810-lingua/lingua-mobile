import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import FormLabel from './react-native-elements/FormLabel';
import FormInput from './react-native-elements/FormInput';
import FormValidationMessage from './react-native-elements/FormValidationMessage';
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
      this.setState({ error: err.message });
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
          <FormLabel>Email Address</FormLabel>
          <FormInput
            autoCapitalize='none'
            onChangeText={(input) => this.setState({email: input})} 
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry={true} 
            password={true} 
            onChangeText={(input) => this.setState({password: input})} 
          />
          <Button
            title='Log In'
            textStyle={{ fontWeight: 'bold' }}
            buttonStyle={styles.button}
            onPress={this.login}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7995b5'
  },
  innerContainer: {
    marginLeft: 20,
    marginRight: 20
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderWidth: 3,
    borderColor: 'white',
    width: '100%',
    paddingTop: 18,
    paddingBottom: 18,
    marginTop: 20,
    alignSelf: 'center'
  }
});

export default Login;