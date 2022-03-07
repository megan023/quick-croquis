import { StyleSheet, Text, Pressable, View, Image, SafeAreaView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "./Themes/colors"
import {normalize} from "./utils/normalize"

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {WebView} from 'react-native-webview';

import Home from "./screens/Home";
import DisplayImage from "./screens/DisplayImage";
import PickTime from "./screens/PickTime";


const Stack = createStackNavigator();

export const startTimes = {
  secs: 30,
  mins: 0,
};
export const secContext = React.createContext(
  {
    secs: 30 // default value
  }
);
export const minContext = React.createContext(
  {
    mins: 0 // default value
  }
);
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state ={ 
    }
  }

  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions= {{
            headerStyle: {
              backgroundColor: '#000',
              height: normalize(50),
            },
            headerTitleStyle: {
              color: 'white',
              fontSize: normalize(20),
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Navigation" component={Home}/>
          <Stack.Screen name="Draw!" component={DisplayImage} />
          <Stack.Screen name="Change Cycle Length" component={PickTime}>
            {/*props => <PickTime {...props} childToParent={{this.childToParent}} />*/}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

/*
<Stack.Screen 
name="Back" 
component={Home}
options={{headerShown: false}}/>*/

const styles = StyleSheet.create({

});
