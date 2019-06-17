// @flow

import { createAppContainer, createStackNavigator } from 'react-navigation';
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

export default ViewPortContainer;
