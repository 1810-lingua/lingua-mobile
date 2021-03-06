import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton
} from "react-native-popup-dialog";
import { Camera, Permissions, ImageManipulator } from "expo";
import { NineCubesLoader } from "react-native-indicator";
import { Ionicons } from "@expo/vector-icons";
import { GCV_key, Yandex_key } from "../config/environment";
import firebase from "../firebase";

export default class ImageDetection extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    word: "",
    identifier: "",
    visible: false,
    loading: false
  };

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  takePicture = async () => {
    if (!this.state.loading) {
      this.setState({
        loading: true
      });
    }
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
    const objectIdentifier =
      response.responses[0].labelAnnotations[0].description;
    this.setState({ word: objectIdentifier });

    const baseUrl =
      "https://translate.yandex.net/api/v1.5/tr.json/translate?key=";
    const apiKey = Yandex_key;
    const text = `&text=${objectIdentifier}`;
    const lang = "&lang=es";
    const fullUrl = baseUrl + apiKey + text + lang;

    const transRequest = new Request(fullUrl, { method: "GET" });
    const transResponse = await fetch(transRequest);
    const translationText = await transResponse.text();
    const translation = JSON.parse(translationText).text[0];
    this.setState({ identifier: translation, visible: true, loading: false });
  };

  addWordFromCam = async word => {
    const { uid } = await firebase.auth().currentUser;
    await firebase
      .database()
      .ref(`${uid}/spanish/${word}`)
      .set({
        word: word,
        translation: this.state.identifier,
        learned: false
      });
    this.setState({ visible: false });
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
              {!this.state.loading ? (
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                  <TouchableOpacity
                    style={{
                      // flex: 0.1,
                      alignItems: "center"
                    }}
                    onPress={this.takePicture}
                  >
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
                          onPress={() => {
                            this.addWordFromCam(this.state.word);
                          }}
                          textStyle={styles.textStyle}
                        />
                        <DialogButton
                          text="OK"
                          onPress={() => {
                            this.setState({ visible: false });
                          }}
                          textStyle={styles.textStyle}
                        />
                      </DialogFooter>
                    }
                    onTouchOutside={() => {
                      this.setState({ visible: false });
                    }}
                  >
                    <DialogContent>
                      <Text style={styles.dialogContentStyle}>
                        Word: {this.state.word}
                      </Text>
                      <Text style={styles.dialogContentStyle}>
                        Translation: {this.state.identifier}
                      </Text>
                    </DialogContent>
                  </Dialog>
                </View>
              ) : (
                <View style={styles.loaderIcon}>
                  <NineCubesLoader
                    style={{ alignSelf: 'center' }}
                    size={40}
                    color={"#80B7F6"}
                  />
                </View>
              )}
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
    alignItems: "center",
    justifyContent: "center"
  },
  loaderIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});
