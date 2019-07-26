// @flow

import is from 'whatitis';
import React, { Component } from 'react';
import codePush from "react-native-code-push";
import { Provider } from '@ant-design/react-native';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation-locker';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { StatusBar, StyleSheet, NativeModules, View, Platform } from 'react-native';
import { AppProvider } from './utils/AppContext';
import { State } from './ViewPortState';
import Container from './Container';
import Setting from './Setting';


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


type Props = {};
@codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESTART
})
class App extends Component<Props> {

  state = {
    configLoaded: false,
    statusBarHidden: true
  };

  componentDidMount() {
    Orientation.lockToLandscape();
    this.createListener();
    this.syncImmediate();
    this.handleUpdate();
  }

  componentWillUnmount() {
    this.clearListener();
  }

  handleLoad = () => {
    this.setState({
      configLoaded: true
    }, () => SplashScreen.hide());
  };

  handleUpdate = () => {
    if ( Platform.OS === 'ios' ) {

    } else {
      NativeModules.DownloadApk.downloading(
        'https://thingspower.com.cn/tpCloud.apk',
        'tpCloud.apk'
      );
    }
  };

  createListener = () => {
    this.statusBarToggle = State.watch( 'statusBarToggle', ( hidden ) => {
      this.setState(( state ) => ({
        statusBarHidden: is.Boolean( hidden ) ? hidden : !state.statusBarHidden
      }));
    });
  };

  clearListener = () => {
    if ( this.statusBarToggle ) {
      this.statusBarToggle.clear();
      this.statusBarToggle = null;
    }
  };

  codePushStatusDidChange = ( syncStatus ) => {
    switch( syncStatus ) {
      case codePush.SyncStatus.UPDATE_INSTALLED:
      case codePush.SyncStatus.UP_TO_DATE:
      case codePush.SyncStatus.UPDATE_IGNORED:
      case codePush.SyncStatus.UNKNOWN_ERROR:
        codePush.allowRestart();
        break;
      // case codePush.SyncStatus.CHECKING_FOR_UPDATE:
      // case codePush.SyncStatus.DOWNLOADING_PACKAGE:
      // case codePush.SyncStatus.AWAITING_USER_ACTION:
      // case codePush.SyncStatus.INSTALLING_UPDATE:
      //   break;
    }
  };

  syncImmediate() {
    codePush.disallowRestart();
    codePush.sync({
      // 安装模式
      // ON_NEXT_RESUME 下次恢复到前台时
      // ON_NEXT_RESTART 下一次重启时
      // IMMEDIATE 马上更新
      installMode : codePush.InstallMode.ON_NEXT_RESUME
      // 对话框
      // updateDialog: {
      //   // 是否显示更新描述
      //   appendReleaseDescription: false,
      //   // 更新描述的前缀。 默认为"Description"
      //   // descriptionPrefix: "更新内容：",
      //   // 强制更新按钮文字，默认为continue
      //   mandatoryContinueButtonLabel: "立即更新",
      //   // 强制更新时的信息. 默认为"An update is available that must be installed."
      //   mandatoryUpdateMessage: "必须更新后才能使用",
      //   // 非强制更新时，按钮文字,默认为"ignore"
      //   optionalIgnoreButtonLabel: '忽略更新',
      //   // 非强制更新时，确认按钮文字. 默认为"Install"
      //   optionalInstallButtonLabel: '下载更新',
      //   // 非强制更新时，检查到更新的消息文本
      //   optionalUpdateMessage: '有新版本了，是否更新？',
      //   // Alert窗口的标题
      //   title: '更新提示'
      // }
    }, this.codePushStatusDidChange );
  }

  render() {
    const { statusBarHidden, configLoaded } = this.state;
    return (
      <AppProvider onLoad={this.handleLoad}>
        <View style={styles.screen}>
          <StatusBar hidden={statusBarHidden} />
          {configLoaded ? <AppContainer /> : null}
        </View>
      </AppProvider>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default () => (
  <Provider>
    <App />
  </Provider>
);
