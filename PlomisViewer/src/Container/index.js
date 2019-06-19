// @flow

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionBar from '../ActionBar';
import ViewPort from '../ViewPort';


type Props = {};
class Conainer extends Component<Props> {
  render() {
    return (
      <ActionBar style={styles.container}>
        <View style={styles.viewPort}>
          <ViewPort />
        </View>
      </ActionBar>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E303A',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  viewPort: {
    flex: 1,
    zIndex: 1,
    position: 'relative'
  }
});

export default Conainer;
