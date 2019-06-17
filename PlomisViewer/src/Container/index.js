// @flow

import React, { Component } from 'react';
import codePush from "react-native-code-push";
import { StyleSheet, View, Text, TouchableOpacity, Toast } from 'react-native';
import ActionBar from '../ActionBar';
import ViewPort from '../ViewPort';


type Props = {};
class Conainer extends Component<Props> {

  handleCheckForUpdate = () => {
    codePush.checkForUpdate()
      .then(( update ) => {
          if ( !update ) {
            Toast.info( 'The app is up to date!' );
          } else {
            Toast.info( 'An update is available! Should we download it?' );
          }
      });
  };

  render() {
    return (
      <ActionBar style={styles.container}>
        <View style={styles.viewPort}>
          <ViewPort />
          <View style={styles.viewVersion}>
            <TouchableOpacity onPress={this.handleCheckForUpdate}>
              <Text>
                1.0.16
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  viewVersion: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    color: '#ffffff',
    zIndex: 1,
    backgroundColor: '#fff'
  }
});

export default Conainer;
