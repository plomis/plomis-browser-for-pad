// @flow

import React, { Component } from 'react';
import codePush from "react-native-code-push";
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation-locker';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { StatusBar, StyleSheet, View, Alert/* , AlertIOS, Platform */ } from 'react-native';
import { Provider } from '@ant-design/react-native';
import Container from './Container';


const AppStack = createStackNavigator({
  Home: Container
}, {
  initialRouteName: 'Home',
  headerMode: 'none'
});

const AppContainer = createAppContainer( AppStack );
// const AppAlert = Platform.OS === 'ios' ? Alert : AlertIOS;


type PropsType = {};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESTART
};

@codePush( codePushOptions )
class App extends Component<PropsType> {

  componentDidMount() {
    SplashScreen.hide();
    Orientation.lockToLandscape();
    this.syncImmediate();
  }

  codePushStatusDidChange = ( syncStatus ) => {
    switch( syncStatus ) {
      case codePush.SyncStatus.UPDATE_INSTALLED:
        this.installedAlert();
        break;
      // case codePush.SyncStatus.CHECKING_FOR_UPDATE:
      // case codePush.SyncStatus.DOWNLOADING_PACKAGE:
      // case codePush.SyncStatus.AWAITING_USER_ACTION:
      // case codePush.SyncStatus.INSTALLING_UPDATE:
      // case codePush.SyncStatus.UP_TO_DATE:
      // case codePush.SyncStatus.UPDATE_IGNORED:
      // case codePush.SyncStatus.UNKNOWN_ERROR:
      //   break;
    }
  };

  installedAlert = () => {
    Alert.alert(
      '更新提示',
      '更新已经下载完成，是否重启完成更新？',
      [{
        text: '以后',
        style: 'cancel'
      }, {
        text: '立即重启',
        onPress() {
          codePush.restartApp();
        }
      }],
      { cancelable: false }
    );
  };

  syncImmediate() {
    codePush.disallowRestart();
    codePush.sync({
      // 安装模式
      // ON_NEXT_RESUME 下次恢复到前台时
      // ON_NEXT_RESTART 下一次重启时
      // IMMEDIATE 马上更新
      installMode : codePush.InstallMode.ON_NEXT_RESTART,
      //对话框
      updateDialog : {
        // 是否显示更新描述
        appendReleaseDescription: false,
        // 更新描述的前缀。 默认为"Description"
        // descriptionPrefix: "更新内容：",
        // 强制更新按钮文字，默认为continue
        mandatoryContinueButtonLabel: "立即更新",
        // 强制更新时的信息. 默认为"An update is available that must be installed."
        mandatoryUpdateMessage: "必须更新后才能使用",
        // 非强制更新时，按钮文字,默认为"ignore"
        optionalIgnoreButtonLabel: '忽略更新',
        // 非强制更新时，确认按钮文字. 默认为"Install"
        optionalInstallButtonLabel: '下载更新',
        // 非强制更新时，检查到更新的消息文本
        optionalUpdateMessage: '有新版本了，是否更新？',
        // Alert窗口的标题
        title: '更新提示'
      }
    }, this.codePushStatusDidChange );
    codePush.allowRestart();
  }

  render() {
    return (
      <Provider>
        <View style={styles.screen}>
          <StatusBar hidden={true} />
          <AppContainer />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default App;
