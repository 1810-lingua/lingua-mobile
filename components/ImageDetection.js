import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Dialog, { DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog'
import { Camera, Permissions, ImageManipulator } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { GCV_key } from "../config/environment";
import firebase from '../firebase'

export default class ImageDetection extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    identifier: '',
    visible: false,
    loading: false
  };

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  takePicture = async () => {
    const capture = await this.camera.takePictureAsync();
    const resized = await ImageManipulator.manipulateAsync(
      capture.uri,
      [{ resize: { height: 1024 } }],
      { base64: true }
    );
    const results = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GCV_key}`,
      {
        method: "POST",
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: resized.base64
              },
              features: [
                {
                  type: "LABEL_DETECTION",
                  maxResults: 1
                }
              ]
            }
          ]
        })
      }
    );
    const response = await results.json();
    const objectIdentifier = response.responses[0].labelAnnotations[0].description;
    this.setState({identifier: objectIdentifier, visible: true})
  };

  addWordFromCam = async (word) => {
    const { uid } = await firebase.auth().currentUser;
    await firebase
      .database()
      .ref(`${uid}/spanish/${word}`)
      .set({
        word: word,
        translation: 'TEST',
        learned: false
      });
      this.setState({visible: false})
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <TouchableOpacity
                    style={{
                      // flex: 0.1,
                      alignItems: "center",
                    }}
                    onPress={this.takePicture}
                  >
                    {/* <Text
                      style={{ fontSize: 18, marginBottom: 20, color: "white" }}
                    >
                      {" "}
                      Capture{" "}
                    </Text> */}
                    <Ionicons
                    name={"ios-camera"}
                    size={50}
                    style={{ color: "white" }}
                  />
                  </TouchableOpacity>
                    <Dialog
                    width={0.7}
                    visible={this.state.visible}
                    footer={
                      <DialogFooter>
                          <DialogButton 
                            text="ADD TO WORDS"
                            onPress={() => {this.addWordFromCam(this.state.identifier)}}
                            textStyle={styles.textStyle}
                          />
                          <DialogButton 
                          text="OK"
                          onPress={() => {this.setState({visible: false})}}
                          textStyle={styles.textStyle}
                        />
                      </DialogFooter>
                    }
                    onTouchOutside={() => {
                      this.setState({ visible: false });
                    }}
                  >
                    <DialogContent>
                      <Text style={styles.dialogContentStyle}>{this.state.identifier}</Text>
                    </DialogContent>
                  </Dialog>
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  textStyle: {
    textAlign: "center",
    fontSize: 12
  },
  dialogContentStyle: {
    textAlign: "center",
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});