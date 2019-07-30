
import React from 'react';
// import DeviceInfo from "react-native-device-info";
import codePush from "react-native-code-push";
import { NativeModules, Platform } from 'react-native';


function withUpdate( Component ) {

  class Wrapped extends React.Component {

    componentDidMount() {
      this.handleUpdate();
      this.syncImmediate();
    }

    handleUpdate = () => {
      // console.log("DeviceInfo:", DeviceInfo.getVersion())
      if ( Platform.OS === 'ios' ) {

      } else {
        NativeModules.DownloadApk.downloading(
          'https://thingspower.com.cn/tpCloud.apk',
          'tpCloud.apk'
        );
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

    render() {
      return (
        <Component />
      );
    }
  }

  return codePush({
    checkFrequency: codePush.CheckFrequency.ON_APP_RESTART
  })( Wrapped );
}

export default withUpdate;
