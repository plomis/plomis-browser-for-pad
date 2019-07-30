// @flow

import React from 'react';
import { View } from 'react-native';
import { Provider } from '@ant-design/react-native';
import Orientation from 'react-native-orientation-locker';
import StatusBarToggle from './components/StatusBarToggle';
import { AppProvider } from './components/AppContext';
import RootLayout from './RootLayout';


class App extends React.Component {

  componentDidMount() {
    Orientation.lockToLandscape();
  }

  render() {
    return (
      <Provider>
        <View style={{ flex: 1 }}>
          <StatusBarToggle />
          <AppProvider>
            <RootLayout />
          </AppProvider>
        </View>
      </Provider>
    );
  }
}

export default App;
