// @flow

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SideBar from '../SideBar';
import { colors } from '../Themes/styles';


type Props = {};
class Conainer extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sider}>
          <SideBar />
        </View>
        <View style={styles.content}>
          <Text>2</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  sider: {
    width: 80,
    backgroundColor: colors.gray[2]
  },
  content: {
    flex: 1,
    backgroundColor: colors.gray[3]
  }
});

export default Conainer;
