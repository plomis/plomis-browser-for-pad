// @flow

import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from 'react-navigation';
import WebViewPage from './WebViewPage';


const AppStack = createStackNavigator({
  Home: WebViewPage,
  Viewer: WebViewPage
}, {
  initialRouteName: 'Home',
  headerMode: 'none'
});

type Props = {};
class App extends Component<Props> {

  state = {
    // showTabs: true
  };

  componentDidMount() {
    SplashScreen.hide();
  }

  // handleActionPress = () => {
  //   this.setState({
  //     showTabs: !this.state.showTabs
  //   });
  // };

  render() {
    // const { showTabs } = this.state;
    return (
      <AppStack />
    );
  }
}

export default App;
