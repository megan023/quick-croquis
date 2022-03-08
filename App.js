import { StyleSheet, Text, Pressable, View, Image, SafeAreaView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "./Themes/colors"
import {normalize} from "./utils/normalize"

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from "./screens/Home";
import DisplayImage from "./screens/DisplayImage";
import PickTime from "./screens/PickTime";
import PickImage from "./screens/PickImage";
//import PinterestBoards from "./screens/PinterestBoards"; <Stack.Screen name="Pinterest Boards" component={PinterestBoards}/>


const Stack = createStackNavigator();

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
          <Stack.Screen name="Upload Image" component={PickImage}/>
          <Stack.Screen name="Draw!" component={DisplayImage}/>
          <Stack.Screen name="Change Cycle Length" component={PickTime} options={{headerShown: false}}/>
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
