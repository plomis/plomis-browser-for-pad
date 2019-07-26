// @flow

import { createAppContainer, createStackNavigator } from 'react-navigation';
import WebViewPage from '../WebViewPage';


const ViewPortStack = createStackNavigator({
  MainViewer: {
    screen: WebViewPage
  },
  Viewer: {
    screen: WebViewPage
  }
}, {
  initialRouteName: 'Viewer',
  headerMode: 'none',
  cardStyle: {
    backgroundColor: '#2E303A'
  }
});

const ViewPortContainer = createAppContainer( ViewPortStack );

export default ViewPortContainer;
