import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  LogBox,
  TextInput,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import uuid from "uuid";

import { collection, addDoc } from "firebase/firestore"; 
import {db} from "../firebase";

//ImagePicker to firebase storage code comes from here : https://github.com/expo/examples/tree/master/with-firebase-storage-upload

// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

export default class PickImage extends React.Component {
  state = {
    image: null,
    uploading: false,
    text: "",
  };

  async componentDidMount() {
    
  }
   isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return true
    //return url.protocol === "http:" || url.protocol === "https:";
  }
  render() {
    let { image } = this.state;
    return (
      <View style={styles.top}>
        {!!image && (
          <Text
            style={{
              fontSize: 20,
              marginBottom: 20,
              textAlign: "center",
              marginHorizontal: 15,
            }}
          >
            Successfully Uploaded Image!
          </Text>
        )}

        <Button
          onPress={this._pickImage}
          title="Pick an image from camera roll"
        />

        <Button onPress={this._takePhoto} title="Take a photo" />
        
        <View>
          <TextInput value={this.state.text} numberOfLines={1} onChangeText={(newText) =>{
              this.setState({text: newText});
            }}
            style={styles.urlBox} placeholder={"Upload Image URL"}
            />
          <Button style={styles.uploadButton} onPress={() => {
            if (!this.isValidHttpUrl(this.state.text)){
              alert("Please input a valid URL!");
            }else{
              addURL(this.state.text);
              this.setState({image:this.state.text,  text: ""})
            }
              
            }} title= "Submit URL" />
        </View>

        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}

        <StatusBar barStyle="default" />
      </View> 
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>

        <Text numberOfLines={1}
          onPress={() => {
            image._copyToClipboard;
            alert("Copied link to clipboard")
          }}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        >
          Share Link: {image}
        </Text>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: "Check out this photo",
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert("Copied image URL to clipboard");
  };

  _takePhoto = async () => {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }else{
        let pickerResult = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        this._handleImagePicked(pickerResult);
      }
    }
  };
  
  _pickImage = async () => {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else{
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
    
        console.log({ pickerResult });
    
        this._handleImagePicked(pickerResult);
      }
    }
    
  };

  
  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        await addURL(uploadUrl);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };
}



async function addURL(uploadUrl){
  
  try{
    const docRef = await addDoc(collection(db, "images"), {
      url: uploadUrl
    });
    console.log(docRef.id);
  } catch(e){
    console.log(e);
    alert("URL Upload failed");
  }
}

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(getStorage(), uuid.v4());
  const result = await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  return await getDownloadURL(fileRef);
}

const styles = StyleSheet.create({
  top:{ 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  urlBox:{
    flex:0,
    fontSize: 18,
    height: 40,
    width: 370,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  uploadUrlBar:{
    flex:0,
    flexDirection:"row",
    justifyContent:"center",
    width: "70%",
    alignContent:"center"
  },
  uploadButton:{
    alignSelf:"flex-end",
    backgroundColor: '#007AFF',
    color: "#FFFFFF",
  }
});
