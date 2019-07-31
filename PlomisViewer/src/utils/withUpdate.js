
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { NativeModules, Platform, Linking, Alert } from 'react-native';
import { getAppstoreAppVersion } from 'react-native-appstore-version-checker';
import { withAppConfig } from '../components/AppContext';
import compare from './compareVersion';


function withUpdate( Component ) {

  @withAppConfig
  class Wrapped extends React.Component {

    state = {
      version: null
    };

    componentDidMount() {
      this.handleVersion();
    }

    handleVersion = () => {
      if ( Platform.OS === 'ios' ) {
        const appId = '1474338848';
        getAppstoreAppVersion( appId ).then( latest => {
          if ( compare( latest, DeviceInfo.getVersion()) > 0 ) {
            this.setState({ version: latest });
          }
        }).catch(() => {
          this.setState({ version: DeviceInfo.getVersion() });
        });
      } else if ( Platform.OS === 'android' ) {
        const { configuration } = this.props;
        fetch( `${configuration.versionUrl}?v=${+ new Date()}` ).then(
          res => res.json()
        ).then(({ latest }) => {
          if ( compare( latest, DeviceInfo.getVersion()) > 0 ) {
            this.setState({ version: latest });
          }
        });
      }
    };

    handleUpdate = () => {
      if ( Platform.OS === 'ios' ) {
        const appId = '1474338848';
        getAppstoreAppVersion( appId ).then( latest => {
          if ( compare( latest, DeviceInfo.getVersion()) > 0 ) {
            Linking
              .openURL( `itms-apps://itunes.apple.com/cn/app/id${appId}` )
              .catch( err => {
                Alert.alert(
                  '错误',
                  err.toString(),
                  [{ text: 'OK', style: 'cancel' }]
                );
              });
          }
        });
      } else if ( Platform.OS === 'android' ) {
        const { configuration } = this.props;
        fetch( configuration.versionUrl ).then(
          res => res.json()
        ).then(({ latest, downloadUrl }) => {
          if ( compare( latest, DeviceInfo.getVersion()) > 0 ) {
            Alert.alert(
              '更新',
              '发现新版本，是否立即更新？',
              [
                { text: '取消', style: 'cancel' },
                {
                  text: '立即下载',
                  onPress() {
                    NativeModules.DownloadApk.downloading(
                      downloadUrl,
                      `android-@{latest}.apk`
                    );
                  }
                }
              ]
            );
          }
        });
      }
    };

    render() {

      const { version } = this.state;

      return (
        <Component version={version} checkUpdate={this.handleUpdate} />
      );
    }
  }

  return Wrapped;
}

export default withUpdate;
