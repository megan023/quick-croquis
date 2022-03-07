import { StyleSheet, Text, Pressable, View, Image, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Colors from "../Themes/colors"

import React, { useState, useEffect } from "react";

import {normalize} from "../utils/normalize"

React.useEffect(() => {
  if (route.params?.post) {
    // Post updated, do something with `route.params.post`
    // For example, send the post to the server
  }
}, [route.params?.post]);

class DisplayImage extends React.Component {
  
    constructor(props) {
        super(props);
        this.state ={ 
          startMins: 0,
          startSecs: 30,
          timer: 30, 
          playing: false,
        }
    }
    restartTimer(){
      this.setState({
        timer: this.state.startMins*60 + this.state.startSecs, 
        });
    }
    startTimer() {
      this.setState({playing: true});
      this.interval = setInterval(
        () => this.setState((prevState)=> ({ timer: prevState.timer - 1 })),
        1000
      );
    }
    componentDidMount(){
      this.startTimer()
    }
    
    componentDidUpdate(){
      if(this.state.timer === 1){
        //new image?
        clearInterval(this.interval);
      }
      else if(this.state.playing == false){ 
        clearInterval(this.interval);
      }
      /*
      else if(this.state.playing == true){ 
        this.innterval = setInterval(
          () => this.setState((prevState)=> ({ timer: prevState.timer - 1 })),
          1000
        );
      }*/
    }
      
    componentWillUnmount(){
       clearInterval(this.interval);
    }
    

    render() {
      let pausePlay = null;
      let play_button_size = normalize(45);
      let navigation = this.props.navigation;
      if(this.state.playing== true){
        pausePlay = 
          <Pressable style={styles.play} onPress={() => this.setState({playing: false})}>
              <Ionicons name="pause-sharp" size={play_button_size} color="black" />
          </Pressable>
      } else {
        pausePlay =
          <Pressable style={styles.play} onPress={() => this.startTimer()}>
              <Ionicons name="play-sharp" size={play_button_size} color="black" />
          </Pressable>
      }
      let mins = Math.floor(this.state.timer/60);
      if(mins <10){
        mins = "0" + mins
      }
      let sec = this.state.timer%60;
      if(sec <10){
        sec = "0" + sec
      }
      
      

      return (
        <View style={styles.top}>
          <Image style={styles.image} source={{uri:"https://i.pinimg.com/750x/80/84/bb/8084bb2f52ae01e4e5d24a0358150126.jpg"}}/>
          <View style={styles.timerBar}>
            <Text style={styles.timer}> {mins}:{sec} </Text>
            <Pressable style={styles.play} onPress={() => {
              this.restartTimer(); 
              this.setState({playing: false});
              }}>
              <Ionicons name="refresh-sharp" size={play_button_size} color="black" />
            </Pressable>
            <Pressable style={styles.settings}  onPress={() => navigation.navigate('Change Cycle Length')}>
              <Ionicons name="settings-sharp" size={ normalize(20)} color="black" />
            </Pressable>
          </View>
          <View style={styles.controlBar}>
            <Pressable style={styles.play} onPress={() => this.restartTimer()}>
            <Ionicons name="play-skip-back-sharp" size={ play_button_size} color="black" />
            </Pressable>
            {pausePlay}
            <Pressable style={styles.play} onPress={() => this.restartTimer()}>
              <Ionicons name="play-skip-forward-sharp" size={play_button_size} color="black" />
            </Pressable>
          </View>
        </View> 
      )
    }
}
const styles = StyleSheet.create({
  top:{
    flex: 1, 
    justifyContent: 'center', 
    
  },
  image:{
    flex: 5,
    width: "90%",
    marginTop:15,
    resizeMode: "cover",
    alignSelf: "center",
  },
  timer:{
    alignSelf: "center",
    fontSize: normalize(50),
    width:normalize(150),
  },
  settings:{
    alignSelf: "flex-start",
    paddingTop:5,
    marginLeft:25,
  },
  controlBar:{
    flex:1,
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "space-evenly",
  },
  timerBar:{
    flex:1,
    width:"80%",
    alignSelf:"flex-end",
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "center",
  },
});

export default DisplayImage;