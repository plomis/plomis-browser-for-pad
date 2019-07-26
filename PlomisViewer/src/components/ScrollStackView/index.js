//@flow

import React from 'react';
import is from 'whatitis';
import { StyleSheet, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';


class ScrollStackView extends React.Component {

  state = {
    isBlur: false
  };

  handleWillFocus = () => {
    const { isBlur } = this.state;
    const { onWillFocus } = this.props;
    if ( isBlur ) {
      this.state.isBlur = false;
      if ( is.Function( onWillFocus )) {
        onWillFocus();
      }
    }
  };

  handleWillBlur = () => {
    this.state.isBlur = true;
    const { onWillBlur } = this.props;
    if ( is.Function( onWillBlur )) {
      onWillBlur();
    }
  };

  render() {

    const { style } = this.props;
    const viewStyle = [styles.scroll];
    if ( style ) {
      viewStyle.push( style );
    }

    return (
      <ScrollView
        style={viewStyle}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <NavigationEvents
          onWillBlur={this.handleWillBlur}
          onWillFocus={this.handleWillFocus} />
        {this.props.children}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingTop: 35,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#EFEFF4'
  }
});

export default ScrollStackView;
