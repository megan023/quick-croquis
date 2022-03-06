import { StyleSheet, Text, Pressable, View, Image, SafeAreaView, Button } from "react-native";
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
        <Pressable style={styles.buttonBar} onPress={() => navigation.navigate('')}>
          <Text style={styles.text}> Connect with {"\n"} Pinterest</Text>
          <Ionicons style={styles.icon} name="logo-pinterest" size={ normalize(40)} color="black" />
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
      backgroundColor:Colors.gray,
    },
    buttonBar:{
      flex:0,
      flexDirection: "row",
      backgroundColor: Colors.teal,
      marginBottom:normalize(15),
      alignContent:"center",
    },
    text:{
      fontSize: normalize(40),
    },
    icon:{
      alignSelf:"flex-end"
    }
  });