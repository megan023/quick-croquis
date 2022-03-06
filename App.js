import { StyleSheet, Text, Pressable, View, Image, SafeAreaView, Button } from "react-native";
import { useState, useEffect } from "react";
import Colors from "./Themes/colors"
import {normalize} from "./utils/normalize"

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {WebView} from 'react-native-webview';

import DisplayImage from "./screens/DisplayImage";
import Home from "./screens/Home";


const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions= {{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitleStyle: {
            color: 'white',
            fontSize: normalize(30),
            fontWeight: 'bold',
          },
        }}
      >
       <Stack.Screen name="Navigation" component={Home}/>
        <Stack.Screen name="Draw!" component={DisplayImage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*
<Stack.Screen 
name="Back" 
component={Home}
options={{headerShown: false}}/>*/

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  homeScreenText: {
    fontSize: 32,
  },
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  button: {
    borderRadius: 99999,
    backgroundColor: Colors.spotify,
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    padding: 10

  },
  buttonText: {
    color: "white",
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonIcon:{
    resizeMode: "contain",
    height: 20,
    width: 20,
    marginRight:10,
  },
  songBox:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    margin: 5,
    color: Colors.gray,
  },
  song:{
    flex: 1,
  },
  songPlay:{
    flex: 1,
    
    alignSelf: "center",
  },
  songDur:{
    color: "white",
    fontFamily: "Arial",
    width: "10%",
    height:20,
    fontSize: 14,
    alignSelf: "center",
    marginLeft:5,
  },
  songNameBox:{
    flex: 0,
    width: "30%",
    flexDirection: "column",
    justifyContent: "center",
    marginRight:5,
  },
  songName:{
    color: "white",
    fontFamily: "Arial",
    width: 100,
    height:20,
    fontSize: 14,
    alignSelf: "center",
  },
  songAlbum:{
    color: "white",
    width: "30%",
    fontFamily: "Arial",
    width: 100,
    height:20,
    fontSize: 14,
    alignSelf: "center",
  },
  songArtist:{
    color: Colors.gray,
    fontFamily: "Arial",
    width: 100,
    height:20,
    fontSize: 14,
    alignSelf: "center",
  },
  songImage:{
    flex: 0,
    height: 60,
    width: "20%",
    marginRight:5,
    resizeMode: "contain",
    alignSelf: "center",
  }
});
