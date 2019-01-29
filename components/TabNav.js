
import React from 'react'
import AllWordsScreen from './AllWordsScreen'
import FlashCardScreen from './FlashCardScreen'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';


const TabNavigator = createBottomTabNavigator({
    AllWords: AllWordsScreen,
    FlashCards: FlashCardScreen
  });

  
export default createAppContainer(TabNavigator);