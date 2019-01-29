import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import TabNav from './components/TabNav'

import Login from './components/Login';
import Register from './components/Register';
import Component1 from './components/Component1';

// Stacks
const AuthStack = createStackNavigator({ Login, Register }, { initialRouteName: 'Login' });
const AppStack = createStackNavigator({ Component1 });
const AppContainer = createAppContainer(createSwitchNavigator({ AuthStack, AppStack }, { initialRouteName: 'AuthStack' }));

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
