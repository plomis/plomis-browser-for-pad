// @flow

import React, { Component } from 'react';
import codePush from "react-native-code-push";
import Orientation from 'react-native-orientation';
import SplashScreen from 'react-native-splash-screen';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { useScreens } from 'react-native-screens';
import { StatusBar, StyleSheet, View } from 'react-native';
import Container from './Container';


useScreens();

const AppStack = createStackNavigator({
  Home: Container
}, {
  initialRouteName: 'Home',
  headerMode: 'none'
});

const AppContainer = createAppContainer( AppStack );


type Props = {};
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START
};

@codePush( codePushOptions )
class App extends Component<Props> {

  componentDidMount() {
    SplashScreen.hide();
    Orientation.lockToLandscape();
    codePush.disallowRestart();
    this.syncImmediate();
    codePush.allowRestart();
  }

  syncImmediate() {
    codePush.sync({
      //安装模式
      //ON_NEXT_RESUME 下次恢复到前台时
      //ON_NEXT_RESTART 下一次重启时
      //IMMEDIATE 马上更新
      installMode : codePush.InstallMode.IMMEDIATE,
      //对话框
      updateDialog : {
        //是否显示更新描述
        appendReleaseDescription : true,
        //更新描述的前缀。 默认为"Description"
        descriptionPrefix : "更新内容：",
        //强制更新按钮文字，默认为continue
        mandatoryContinueButtonLabel : "立即更新",
        //强制更新时的信息. 默认为"An update is available that must be installed."
        mandatoryUpdateMessage : "必须更新后才能使用",
        //非强制更新时，按钮文字,默认为"ignore"
        optionalIgnoreButtonLabel : '稍后',
        //非强制更新时，确认按钮文字. 默认为"Install"
        optionalInstallButtonLabel : '后台更新',
        //非强制更新时，检查到更新的消息文本
        optionalUpdateMessage : '有新版本了，是否更新？',
        //Alert窗口的标题
        title : '更新提示'
      }
    });
  }

  render() {
    return (
      <View style={styles.screen}>
        <StatusBar hidden={true} />
        <AppContainer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default App;
