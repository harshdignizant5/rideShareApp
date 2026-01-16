import { Dimensions, Platform } from 'react-native';
import { create } from 'react-native-pixel-perfect';

const designResolution = {
  width: 390, // 375,
  height: 844, // 812,
};
export const perfectSize = create(designResolution);

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const { height: HEIGHT, width: WIDTH } = Dimensions.get('screen');

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

export const IS_ANDROID_35_PLUS =
  Platform.OS === 'android' && Platform.Version >= 35;

export const hasAndroidNavigationBar = () => {
  if (!IS_ANDROID) return false;
  return HEIGHT > SCREEN_HEIGHT;
};

export const getBottomBarHeight = (): number => {
  if (!IS_ANDROID) return 0;
  const navBarHeight = HEIGHT - SCREEN_HEIGHT;

  return navBarHeight > 0 ? navBarHeight : 0;
};

export const verticalScale = (size: number) =>
  (SCREEN_HEIGHT / designResolution.height) * size;

export const scaleAndClampFontSize = (
  size: number,
  minSize = size,
  maxSize = size,
) => {
  const scaledSize = verticalScale(size);
  return Math.min(Math.max(scaledSize, minSize), maxSize);
};
