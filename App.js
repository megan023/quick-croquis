import { StyleSheet, Text, Pressable, FlatList, View, Image, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"
import images from "./Themes/images"
import millisToMinutesAndSeconds from "./utils/millisToMinuteSeconds.js"

// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

export default function App() {
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
      // TODO: Select which option you want: Top Tracks or Album Tracks

      // Comment out the one you are not using
      myTopTracks(setTracks, token);
      //albumTracks(ALBUM_ID, setTracks, token);
    }
  }, [token]);

  const renderItem = (item, index) => (
    <View style = {styles.songBox}>
      <Text style={styles.songNum}>
        {index+1}
      </Text>
      <Image style={styles.songImage} source={item.album.images[0]}/>
      <View style={styles.songNameBox}>
        <Text style={styles.songName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.songArtist}>
          {item.artists[0].name}
        </Text>
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
      renderItem ={({item,index}) => renderItem(item,index)}
      keyExtractor={(item, index) => item.id}
    />
  } else {
    contentDisplayed =
    <Pressable style={styles.button} onPress={() => {promptAsync();}} >
      <Image source={images.spotify} style={styles.buttonIcon}></Image>
      <Text style={styles.buttonText}>
        CONNECT WITH SPOTIFY
      </Text>
  </Pressable>
  }
  return (
    <SafeAreaView style={styles.container}>
      {contentDisplayed}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  button: {
    borderRadius: 99999,
    backgroundColor: Colors.spotify,
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    padding: 10

  },
  buttonText: {
    color: "white",
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonIcon:{
    resizeMode: "contain",
    height: 20,
    width: 20,
    marginRight:10,
  },
  songBox:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    margin: 5,
    color: Colors.gray,
  },
  songNum:{
    color: "white",
    fontFamily: "Arial",
    width: "5%",
    height:15,
    fontSize: 14,
    alignSelf: "center",
    color: "grey",
  },
  songDur:{
    color: "white",
    fontFamily: "Arial",
    width: "10%",
    height:20,
    fontSize: 14,
    alignSelf: "center",
    marginLeft:5,
  },
  songNameBox:{
    flex: 0,
    width: "30%",
    flexDirection: "column",
    justifyContent: "center",
    marginRight:5,
  },
  songName:{
    color: "white",
    fontFamily: "Arial",
    width: 100,
    height:20,
    fontSize: 14,
    alignSelf: "center",
  },
  songAlbum:{
    color: "white",
    width: "30%",
    fontFamily: "Arial",
    width: 100,
    height:20,
    fontSize: 14,
    alignSelf: "center",
  },
  songArtist:{
    color: Colors.gray,
    fontFamily: "Arial",
    width: 100,
    height:20,
    fontSize: 14,
    alignSelf: "center",
  },
  songImage:{
    flex: 0,
    height: 60,
    width: "20%",
    marginRight:5,
    resizeMode: "contain",
    alignSelf: "center",
  }
});
