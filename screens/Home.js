import { StyleSheet, Text, Pressable, View, Alert, SafeAreaView, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
//import { useNavigation } from "@react-navigation/native";
import {normalize} from "../utils/normalize"

import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Colors from "../Themes/colors"

function Home({ navigation }){
    return (
      <View style={styles.top}>
        <Pressable style={styles.buttonBar} onPress={() => navigation.navigate('')}>
          <Text style={styles.text}> Add Image </Text>
          <Ionicons name="add-sharp" size={ normalize(40)} color="black" />
        </Pressable>
        <Pressable style={styles.buttonBar} onPress={() => Alert.alert("Connect with Pinterest Not Yet Implemented")}>
          <Text style={styles.text}> Connect with {"\n"} Pinterest</Text>
          <Ionicons style={styles.icon} name="logo-pinterest" size={ normalize(40)} color="red" />
        </Pressable>
        <Pressable style={styles.buttonBar} onPress={() => navigation.navigate('Draw!')}>
          <Text style={styles.text} numberOfLines={1}> Start Drawing! </Text>
          <Ionicons name="arrow-forward" size={ normalize(40)} color="black" />
        </Pressable>
      </View>
    );
  };
  
  export default Home;
  
  const styles = StyleSheet.create({
    top:{
      flex: 1, 
      flexDirection:"column",
      justifyContent:"space-evenly",
    },
    buttonBar:{
      flex:0,
      flexDirection: "row",
      backgroundColor: Colors.lightGray,
      marginBottom: normalize(15),
      justifyContent: "flex-start",
      alignContent:"center",
      padding:15,
    },
    text:{
      fontSize: normalize(30),
      fontFamily: "Helvetica",
    },
    icon:{
      alignSelf:"center"
    }
  });