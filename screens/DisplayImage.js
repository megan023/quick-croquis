import { StyleSheet, Text, Pressable, View, Image, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Colors from "../Themes/colors"

import React, { useState, useEffect } from "react";

import Modal from 'react-modal';
import PickTime from "./PickTime";
import {normalize} from "../utils/normalize"

class DisplayImage extends React.Component {
    constructor(props) {
        super(props);
        let route = this.props.route;
        console.log("constructor:", route);
        
        this.state ={ 
            show:false,
            startMins: 1,
            startSecs: 0,
            timer: 60, 
            update:false,
            playing: false, 
        }
        
    }
    updateMinsSecs(){
      let route = this.props.route;
      
      console.log("updateMinsSecs:", route);
      mins = route.params.startTime.minutes;
      console.log("mins = ",mins);
      secs = route.params.startTime.seconds;
      console.log("secs = ", secs);
      this.setState({
          startMins: mins,
          startSecs: secs,
          timer: mins*60 + secs
        });
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
    handleShow(){

    }
    componentDidMount(){
      this.restartTimer();
      this.startTimer();
    }
    
    componentDidUpdate(){
      console.log("componentDidUpdate:", this.props.route,this.state.update);
      let route = this.props.route;
      if (this.state.update == true && route.params
        && (route.params.startTime.minutes!=this.state.startMins 
          || route.params.startTime.seconds!=this.state.startSecs)){
            console.log("UPDATING:");
            this.updateMinsSecs();
            this.setState({playing: false, update: false});
            this.render();
      }
      else if(this.state.timer === 1){
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
      //console.log("render:", this.props.route);
      
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
          {/*<Modal show = {this.state.show}>
            {PickTime}
          </Modal>*/}
          <Image style={styles.image} source={{uri:"https://i.pinimg.com/750x/80/84/bb/8084bb2f52ae01e4e5d24a0358150126.jpg"}}/>
          <View style={styles.timerBar}>
            <Text style={styles.timer}> {mins}:{sec} </Text>
            <Pressable style={styles.play} onPress={() => {
              this.restartTimer(); 
              this.setState({playing: false});
              }}>
              <Ionicons name="refresh-sharp" size={play_button_size} color="black" />
            </Pressable>
            <Pressable style={styles.settings}  onPress={() => {
              this.setState({update: true});
              navigation.navigate('Change Cycle Length');
              
            }}>
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