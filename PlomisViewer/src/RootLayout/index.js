// @flow

import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import withAutoUpdate from '../utils/withAutoUpdate';
import withRate from '../utils/withRate';
import { withTheme } from '../Themes';
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
  initialRouteName: 'ViewPort'
});

const AppContainer = createAppContainer( AppStack );


@withRate
@withTheme
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
