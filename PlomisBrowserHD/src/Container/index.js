// @flow

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ActionBar from '../ActionBar';
import { colors } from '../Themes/styles';


type Props = {};
class Conainer extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <ActionBar style={styles.action} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#2E303A'
  },
  action: {
    minWidth: 380,
    height: 96,
    bottom: 17,
    position: 'absolute',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#373945'
  },
  content: {
    flex: 1
  }
});

export default Conainer;
