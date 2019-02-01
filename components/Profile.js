import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "../firebase";

class Profile extends Component {
  render() {
    return (
      <View>
        <ListItem onPress={() => firebase.auth().signOut()} title="Log Out" />
      </View>
    );
  }
}

export default Profile;
