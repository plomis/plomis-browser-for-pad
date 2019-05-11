// @flow

import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { useScreens } from 'react-native-screens';
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
  }

  render() {
    return (
      <AppContainer />
    );
  }
}

export default App;
