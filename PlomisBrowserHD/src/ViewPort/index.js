// @flow

// import React, { Component } from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
// import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
// import { Transition } from 'react-native-reanimated';
import ViewPortController from '../ViewPortController';
// import type { ViewPortProps } from '../ViewPortController';
import WebViewPage from '../WebViewPage';


const ViewPortStack = createStackNavigator({
  Viewer: {
    screen: WebViewPage
  }
}, {
  initialRouteName: 'Viewer',
  headerMode: 'none'
});

const ViewPortContainer = createAppContainer( ViewPortStack );


// class ViewPort extends Component<ViewPortProps> {
//   render() {
//     return (
//       <ViewPortContainer />
//     );
//   }
// }

export default ViewPortController( ViewPortContainer );
