//@flow

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { State } from '../ViewPortState';
import Common from './Common';
import DownloadConfig from './DownloadConfig';


class Content extends React.Component {

  static navigationOptions({ screenProps }) {
    return {
      headerTitle: screenProps.title || ''
    };
  }

  state = {
    key: ''
  };

  componentDidMount() {
    this.settingMenuChangeWait = State.wait( 'SettingMenuChange', ( key ) => {
      this.setState({ key });
      this.settingMenuChange = State.watch( 'SettingMenuChange', ( key ) => {
        this.setState({ key });
      });
    });
  }

  componentWillUnmount() {
    if ( this.settingMenuChangeWait ) {
      this.settingMenuChangeWait.clear();
      this.settingMenuChangeWait = null;
    }
    if ( this.settingMenuChange ) {
      this.settingMenuChange.clear();
      this.settingMenuChange = null;
    }
  }

  getContent() {
    const { key } = this.state;
    return key === "Common"
      ? <Common /> : key === "DownloadConfig"
      ? <DownloadConfig /> : null;
  }

  render() {
    return (
      <View style={styles.menuContent}>
        {this.getContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuContent: {
    flex: 1,
    backgroundColor: '#EFEFF4'
  }
});

export default Content;
