// @flow

// import React, { Component } from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
// import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
// import { Transition } from 'react-native-reanimated';
// import ViewPortController from '../ViewPortController';
// import type { ViewPortProps } from '../ViewPortController';
import WebViewPage from '../WebViewPage';


const DefaultUrl = 'https://www.thingspower.com.cn/';
const ViewPortStack = createStackNavigator({
  MainViewer: {
    screen: WebViewPage,
    params: {
      home: DefaultUrl
    }
  },
  Viewer: {
    screen: WebViewPage,
    params: {
      home: DefaultUrl
    }
  }
}, {
  initialRouteName: 'Viewer',
  initialRouteParams: {
    url: DefaultUrl
  },
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#2E303A'
  }
});

const ViewPortContainer = createAppContainer( ViewPortStack );


// class ViewPort extends Component<ViewPortProps> {
//   render() {
//     return (
//       <ViewPortContainer />
//     );
//   }
// }

export default ViewPortContainer;
