import { StyleSheet, Text, Pressable, View, Image, PixelRatio, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Colors from "../Themes/colors"

import React from 'react';

import {normalize} from "../utils/normalize"

class DisplayImage extends React.Component {
    constructor(props) {
        super(props);
        this.state ={ timer: 30, playing: false}
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
      if(this.state.playing== true){
        pausePlay = 
          <Pressable style={styles.play} onPress={() => this.setState({playing: false})}>
              <Ionicons name="pause-sharp" size={ normalize(60)} color="black" />
          </Pressable>
      } else {
        pausePlay =
          <Pressable style={styles.play} onPress={() => this.startTimer()}>
              <Ionicons name="play-sharp" size={ normalize(60)} color="black" />
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
          <Text style={styles.timer}> {mins}:{sec} </Text>
          <View style={styles.controlBar}>
            <Ionicons name="play-skip-back-sharp" size={ normalize(60)} color="black" />
            {pausePlay}
            <Ionicons name="play-skip-forward-sharp" size={ normalize(60)} color="black" />
            <Pressable style={styles.play} onPress={() => this.setState({timer: 30, playing: false})}>
              <Ionicons name="refresh-sharp" size={normalize(60)} color="black" />
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
    flex: 6,
    width: "90%",
    backgroundColor: Colors.red,
    marginTop:15,
    resizeMode: "cover",
    alignSelf: "center",
  },
  timer:{
    alignSelf: "center",
    fontSize: normalize(40),
  },
  play:{
    
  },
  controlBar:{
    flex:1,
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "space-around",
   
  },
});

export default DisplayImage;