// @flow

import React, { Component } from 'react';
import { StyleSheet, View/* , Text, TouchableOpacity */ } from 'react-native';
import ActionBar from '../ActionBar';
import ViewPort from '../ViewPort';


type Props = {};
class Conainer extends Component<Props> {
  render() {
    return (
      <ActionBar style={styles.container}>
        <View style={styles.viewPort}>
          <ViewPort />
          {/* <View style={styles.viewVersion}>
            <TouchableOpacity>
              <Text>
                1.0.8
              </Text>
            </TouchableOpacity>
          </View> */}
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
  }/* ,
  viewVersion: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    color: '#ffffff',
    zIndex: 1,
    backgroundColor: '#fff'
  } */
});

export default Conainer;
