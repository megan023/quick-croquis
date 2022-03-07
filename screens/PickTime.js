
import React, {useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, Text, Pressable, View, Image, Button } from "react-native";
import Colors from "../Themes/colors"

import {TimePicker} from 'react-native-simple-time-picker';

import {normalize} from "../utils/normalize"

function PickTime({navigation, route}){
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
        <TimePicker
          pickerShows = {["seconds", "minutes"]}
          selectedMinutes={selectedMinutes} 
          minutesUnit = {"mins"}
          selectedSeconds={selectedSeconds}
          secondsUnit = {"secs"}
          onChange={(minutes, seconds) => {
            setSelectedSeconds(seconds);
            setSelectedMinutes(minutes);
          }}
        />
        <Button
        title="Done"
        onPress={() => {
          // Pass and merge params back to home screen
          navigation.navigate({
            name: 'Draw!',
            params: { startTime: selectedMinutes},
            merge: true,
          });
        }}
      />
    </SafeAreaView>
  );
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

