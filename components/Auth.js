import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../firebase';

class Auth extends Component {
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate('AppStack');
      } else {
        this.props.navigation.navigate('AuthStack');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title='Login' 
          buttonStyle={styles.button}
          onPress={() => this.props.navigation.navigate('Login')} 
        />
        <Button 
          title='Register' 
          buttonStyle={styles.button}
          onPress={() => this.props.navigation.navigate('Register')} 
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#5077eb',
    borderRadius: 4,
    width: 140,
    marginTop: 4,
    marginBottom: 4,
    paddingTop: 18,
    paddingBottom: 18,
  }
});

export default Auth;