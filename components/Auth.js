import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
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
        <Text style={styles.title}>Welcome to Lingua.</Text>
        <Button
          title='Log In' 
          textStyle={{ fontWeight: 'bold' }}
          buttonStyle={styles.button}
          onPress={() => this.props.navigation.navigate('Login')} 
        />
        <Button 
          title='Register'
          textStyle={{ fontWeight: 'bold' }}
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
    alignItems: 'center',
    backgroundColor: '#7995b5',
    marginTop: -60
  },
  button: {
    backgroundColor: 'transparent',
    width: 170,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: 'white',
    paddingTop: 18,
    paddingBottom: 18,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'center'
  },
  title: {
    color: 'white',
    fontSize: 34,
    marginBottom: 14
  }
});

export default Auth;