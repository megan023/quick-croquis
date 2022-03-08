import { StyleSheet, Text, Pressable, FlatList, View, Image, SafeAreaView, Button } from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "../utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "../utils/constants";
import { normalize } from "../utils/normalize";
import Colors from "../Themes/colors"
import images from "../Themes/images"
import { Ionicons } from '@expo/vector-icons';


import {WebView} from 'react-native-webview';
// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://api.pinterest.com/v5/oauth/token",
  tokenEndpoint: "https://api.pinterest.com/v5/oauth/token"
};

export default function PinterestBoards({ navigation }) {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      // Comment out the one you are not using
      myTopTracks(setTracks, token);
      //albumTracks(ALBUM_ID, setTracks, token);
    }
  }, [token]);
  //console.log(tracks[0])
  
  const renderItem = (item, index) => (
    <View style = {styles.songBox}>
      <Pressable style={styles.songPlay} onPress={() => navigation.navigate('Song Preview', {url: item.preview_url})}>
        <Ionicons name="play-circle" size={22} color="green" />
      </Pressable>
      <Image style={styles.songImage} source={item.album.images[0]}/>
      <View style={styles.songNameBox}>
        <Pressable style={styles.song} onPress={() => navigation.navigate('Song Details', {url: item.external_urls.spotify})}>
          <Text style={styles.songName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.songArtist}>
            {item.artists[0].name}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.songAlbum} numberOfLines={1}>
          {item.album.name}
        </Text>
      <Text style={styles.songDur}>
        {millisToMinutesAndSeconds(item.duration_ms)}
      </Text>   
    </View>
  );
  let contentDisplayed = null;
  if(token){
    contentDisplayed = 
    <FlatList 
      data={tracks} 
      renderItem ={({item, index}) => renderItem(item,index)}
      keyExtractor={(item, index) => item.id}
    />
  } else {
    contentDisplayed =
    <Pressable style={styles.button} onPress={() => {promptAsync();}} >
     <Text style={styles.buttonText}>
        CONNECT WITH PINTEREST
      </Text>
      <Ionicons style={styles.icon} name="logo-pinterest" size={ normalize(20)} color="red" />
      
  </Pressable>
  }
  return (
    <SafeAreaView style={styles.container}>
      {contentDisplayed}
    </SafeAreaView>
  );
}

function DetailedSong({navigation, route}){
  const { url } = route.params;
  return(
    <WebView
        source={{
          uri: url
        }}
      />
  );
}
function SongPreview({navigation, route}){
  const { url } = route.params;
  return(
    <WebView
      source={{
        uri: url
      }}
    />
  );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 99999,
        backgroundColor: Colors.lightGray,
        flex: 0,
        flexDirection: "row",
        justifyContent: "center",
        padding: 10,
        alignContent: "center"
      },
      buttonText: {
        color: "black",
        fontFamily: "Arial",
        fontWeight: "bold",
        fontSize: 20,
        margin: 15,
      },
});