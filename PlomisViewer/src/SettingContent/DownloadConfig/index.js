
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Content from './Content';


export default createAppContainer( createStackNavigator({
  Content: {
    screen: Content
  }
}, {
  initialRouteName: 'Content',
  defaultNavigationOptions: {
    gesturesEnabled: false
  }
}));
