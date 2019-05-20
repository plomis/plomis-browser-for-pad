// @flow

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionBar from '../ActionBar';
import ViewPort from '../ViewPort';
// import { colors } from '../Themes/styles';


type Props = {};
type State = {
  url: string
};
class Conainer extends Component<Props, State> {

  state = {
    url: ''
  };

  render() {
    const { url } = this.state;
    return (
      <ActionBar style={styles.container}>
        <View style={styles.viewPort}>
          <ViewPort url={url} />
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
