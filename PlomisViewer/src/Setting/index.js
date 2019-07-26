//@flow

import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { State } from '../ViewPortState';
import SettingMenu from '../SettingMenu';
import SettingContent from '../SettingContent';


class Setting extends React.Component {

  componentDidMount() {
    if ( Platform.OS === 'ios' ) {
      this.statusBarShowTimer = setTimeout(() => {
        State.dispense( 'statusBarToggle', false );
      }, 300 );
    }
  }

  componentWillUnmount() {
    if ( this.statusBarShowTimer ) {
      clearTimeout( this.statusBarShowTimer );
      this.statusBarShowTimer = null;
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.setting}>
        <View style={styles.menu}>
          <SettingMenu screenProps={{ navigation }} />
        </View>
        <View style={styles.divisor} />
        <View style={styles.content}>
          <SettingContent />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  setting: {
    flex: 1,
    flexDirection: 'row'
  },
  divisor: {
    width: 0.5,
    backgroundColor: '#8E8E92'
  },
  menu: {
    width: 375
  },
  content: {
    flex: 1
  }
});

export default Setting;
