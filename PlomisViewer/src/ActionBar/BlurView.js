
import React from 'react';
import { StyleSheet, BlurView } from "@react-native-community/blur";
import { View, Platform } from 'react-native';


class Blur extends React.Component {
  render() {
      const { style } = this.props;
    const viewStyle = style ? [ style, styles.androidBlurView ] : style;
    return Platform.OS === 'ios'
      ? <BlurView {...this.props} />
      : <View {...this.props} style={viewStyle} />;
  }
}

const styles = StyleSheet.create({
  androidBlurView: {
    backgroundColor: '#373945'
  }
});

export default Blur;
