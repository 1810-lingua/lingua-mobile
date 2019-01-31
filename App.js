import React, { Component } from 'react';
import { Font } from 'expo';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import TabNav from './components/TabNav'
import Auth from './components/Auth';
import Login from './components/Login';
import Register from './components/Register';
import Component1 from './components/Component1';

const AuthStack = createStackNavigator(
  { Auth, Login, Register }, 
  { initialRouteName: 'Auth',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#7995b5',
        borderBottomWidth: 0
      },
      headerTintColor: '#fff',
    }
  }
);

const AppStack = createStackNavigator({ Component1 });

const AppContainer = createAppContainer(createSwitchNavigator(
  { AuthStack, AppStack }, 
  { initialRouteName: 'AuthStack' }
));

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}