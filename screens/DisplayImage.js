import { StyleSheet, Text, Pressable, View, Image, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Colors from "../Themes/colors"

import React, { useState, useEffect } from "react";

import Modal from 'react-modal';
import PickTime from "./PickTime";
import {normalize} from "../utils/normalize"

import { collection, getDocs, doc } from "firebase/firestore"; 
import {db} from "../firebase";

class DisplayImage extends React.Component {
    constructor(props) {
        super(props);
        let route = this.props.route;
        //console.log("constructor:", route);
        
        this.state ={ 
            show:false,
            startMins: 1,
            startSecs: 0,
            timer: 60, 
            update:false,
            playing: false, 
            imageArr: [],
            rand:  Math.floor(Math.random()*2),
        }
        
    }
    updateMinsSecs(){
      let route = this.props.route;
      //console.log("updateMinsSecs:", route);
      let mins = route.params.startTime.minutes;
      //console.log("mins = ",mins);
      let secs = route.params.startTime.seconds;
      //console.log("secs = ", secs);
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
    async componentDidMount(){
      this.restartTimer();
      this.startTimer();
      try {
        const allDocs = await getDocs(collection(db, "images"));

        console.log("componentDidMount: allDocs.docs:", allDocs.docs);
        console.log("componentDidMount: allDocs:", {allDocs});
        let docsArr = [];
        allDocs.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          docsArr.push(doc.data());
          console.log(doc.id, " => ", doc.data());
        });
        console.log("componentDidMount: docsArr:", docsArr);
        this.setState({imageArr: [...docsArr]});
        // docsArr = [{}, {}]
      } catch (e){
        console.log(e);
        alert("Sorry! We were unable to retrieve the images from Firebase.");
      }
    }
    
    componentDidUpdate(){
      //console.log("componentDidUpdate:", this.props.route,this.state.update);
      let route = this.props.route;
      if (this.state.update == true && route.params
        && !isNaN(route.params.startTime.minutes)
          && !isNaN(route.params.startTime.seconds)){
            //console.log("UPDATING:");
            this.updateMinsSecs();
            this.setState({playing: false, update: false});
            this.render();
      }
      else if(this.state.timer === 1){
        //new image?
        this.newRand();
        this.restartTimer(); 
        //clearInterval(this.interval);
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
    
    newRand(){
      let r = Math.floor(Math.random()*this.state.imageArr.length);
      this.setState({rand: r})
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


      let url = "";
      if(this.state.imageArr.length > 0){
        //console.log("render imgArr: ", this.state.imageArr);
        url = this.state.imageArr[this.state.rand].url;
        //console.log("render: ", url);
      }

      return (
        <View style={styles.top}>
          {/*<Modal show = {this.state.show}>
            {PickTime}
          </Modal>*/}
          <Image style={styles.image} source={{uri: url}}/>
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
            <Pressable style={styles.play} onPress={() => {
              this.restartTimer();
              this.newRand();
            }}>
            <Ionicons name="play-skip-back-sharp" size={ play_button_size} color="black" />
            </Pressable>
            {pausePlay}
            <Pressable style={styles.play} onPress={() => {
              this.restartTimer();
              this.newRand();
            }}>
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