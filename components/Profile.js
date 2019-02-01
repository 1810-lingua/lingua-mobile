
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements'
import { Button } from 'react-native-elements';
import firebase from '../firebase';

class Profile extends Component {

    render() {
        return (
            <View style={styles.container}>
                <ListItem
                    onPress={() => firebase.auth().signOut()}
                    title="Log Out"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

export default Profile;