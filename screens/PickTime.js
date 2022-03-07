
import React, {useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, Text, Pressable, View, Image, Button } from "react-native";
import Colors from "../Themes/colors"

import {secContext, minContext} from '../App'
import {TimePicker} from 'react-native-simple-time-picker';

import {normalize} from "../utils/normalize"

class PickTime extends React.Component{
  constructor(props) {
    super(props);
    this.state ={ 
      selectedMinutes: 0,
      selectedSeconds: 30,
    }
  }
    setSelectedMinutes(i){
      this.setState({selectedMinutes: i})
    }
    setSelectedSeconds(i){
      this.setState({selectedSeconds: i})
    };
    handleChange(m, s){
      <secContext.Provider value={this.state.selectedMinutes}></secContext.Provider>
      this.context.childToParent(m,s);
    }
    render(){
      console.log(this);
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <TimePicker pickerShows = {["seconds", "minutes"]}
              selectedMinutes={this.state.selectedMinutes} 
              minutesUnit = {"mins"}
              selectedSeconds={this.state.selectedSeconds}
              secondsUnit = {"secs"}
              onChange={(minutes, seconds) => {
                this.setSelectedMinutes(minutes);
                this.setSelectedSeconds(seconds);
                this.handleChange(minutes, seconds);
              }}
            />
          </View>
        </SafeAreaView>
      );
    }
};

export default PickTime;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 20,
    },
});

