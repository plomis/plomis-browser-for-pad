// @flow

import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import withRate from '../utils/withRate';
import withAutoUpdate from '../utils/withAutoUpdate';
import Container from '../Container';
import Setting from '../Setting';


const AppStack = createStackNavigator({
  Setting: {
    screen: Setting
  },
  ViewPort: {
    screen: Container
  }
}, {
  mode: 'modal',
  headerMode: 'none',
  initialRouteName: 'Setting'
});

const AppContainer = createAppContainer( AppStack );


@withRate
@withAutoUpdate
class RootLayout extends Component {

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return <AppContainer {...this.props} />;
  }
}


export default RootLayout;
