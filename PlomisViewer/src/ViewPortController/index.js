// @flow

import React, { Component } from 'react';
import type { AbstractComponent } from 'react';


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
      return (
        <ViewPort {...this.props} />
      );
    }
  };
}

export default ViewPortController;
