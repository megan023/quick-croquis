import { Dimensions,PixelRatio } from "react-native";

//Dynamic sizing
const {
    width: SCREEN_WIDTH,
  } = Dimensions.get('window');
  // based on iphone 5s's scale
  const scale = SCREEN_WIDTH / 400;
  export function normalize(size) {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
  }