// @flow

import React, { Component } from 'react';
import type { AbstractComponent } from 'react';
// import { View } from 'react-native';
// import { createAppContainer, createStackNavigator } from 'react-navigation';

export type ViewPortProps = {
  url?: string
};

type ViewPortControllerProps = {
  url?: string
};
function ViewPortController(
  ViewPort: AbstractComponent<ViewPortProps>
): AbstractComponent<ViewPortControllerProps> {
  return class extends Component<ViewPortControllerProps> {
    render() {
      const { ...props } = this.props;
      return (
        <ViewPort {...props} />
      );
    }
  };
}


export default ViewPortController;
