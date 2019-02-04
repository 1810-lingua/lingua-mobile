import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Dialog, { DialogContent } from 'react-native-popup-dialog'
import { Camera, Permissions, ImageManipulator } from "expo";
import { GCV_key } from "../config/environment";

export default class ImageDetection extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    identifier: '',
    visible: false
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
              <View>
                  <TouchableOpacity
                    style={{
                      flex: 0.1,
                      alignSelf: "flex-end",
                      alignItems: "center"
                    }}
                    onPress={this.takePicture}
                  >
                    <Text
                      style={{ fontSize: 18, marginBottom: 20, color: "white" }}
                    >
                      {" "}
                      Capture{" "}
                    </Text>
                  </TouchableOpacity>
                    <Dialog
                    visible={this.state.visible}
                    onTouchOutside={() => {
                      this.setState({ visible: false });
                    }}
                  >
                    <DialogContent>
                    <Text>{this.state.identifier}</Text>
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
