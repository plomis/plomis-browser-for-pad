// @flow

import React, { Component } from 'react';
import Orientation from 'react-native-orientation';
import SplashScreen from 'react-native-splash-screen';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { useScreens } from 'react-native-screens';
import { StatusBar, StyleSheet, View } from 'react-native';
import Container from './Container';


useScreens();

const AppStack = createStackNavigator({
  Home: Container
}, {
  initialRouteName: 'Home',
  headerMode: 'none'
});

const AppContainer = createAppContainer( AppStack );

type Props = {};
class App extends Component<Props> {

  componentDidMount() {
    SplashScreen.hide();
    Orientation.lockToLandscape();
  }

  render() {
    return (
      <View style={styles.screen}>
        <StatusBar hidden={true} />
        <AppContainer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default App;
