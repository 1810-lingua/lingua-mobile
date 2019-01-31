import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { fadeIn } from 'react-navigation-transitions';

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
    },
    transitionConfig: () => fadeIn(200)
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