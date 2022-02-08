import { StyleSheet, Text, Pressable, FlatList, View, Image, SafeAreaView, Button } from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"
import images from "./Themes/images"
import millisToMinutesAndSeconds from "./utils/millisToMinuteSeconds.js"
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {WebView} from 'react-native-webview';
// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};
function MainScreen({ navigation }) {
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
  console.log(tracks[0])
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
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions= {{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Back" 
          component={MainScreen}
          options={{headerShown: false}}/>
        <Stack.Screen name="Song Details" component={DetailedSong}
        />
        <Stack.Screen name="Song Preview" component={SongPreview}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  homeScreenText: {
    fontSize: 32,
  },
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
  song:{
    flex: 1,
  },
  songPlay:{
    flex: 1,
    
    alignSelf: "center",
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
