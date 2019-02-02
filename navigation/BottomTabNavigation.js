import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";

import AllWordsScreen from '../components/AllWordsScreen';
import FlashCardScreen from '../components/FlashCardScreen';
import Profile from '../components/Profile';

export const TabNavigator = createBottomTabNavigator({
  Words: {
    screen: AllWordsScreen,
    navigationOptions: {
      tabBarLabel: "Words",
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? "ios-list" : "ios-list"}
          size={26}
          style={{ color: tintColor }}
        />
      )
    }
  },
  FlashCards: {
    screen: FlashCardScreen,
    navigationOptions: {
      tabBarLabel: "Flash Cards",
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={
            focused
              ? "ios-checkmark-circle-outline"
              : "ios-checkmark-circle-outline"
          }
          size={26}
          style={{ color: tintColor }}
        />
      )
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: "Profile",
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? "ios-person" : "ios-person"}
          size={26}
          style={{ color: tintColor }}
        />
      )
    }
  }
});

export default createAppContainer(TabNavigator);