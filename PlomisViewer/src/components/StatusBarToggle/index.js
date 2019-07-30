
import is from 'whatitis';
import React from 'react';
import { StatusBar } from 'react-native';
import { State } from '../../ViewPortState';


class StatusBarToggle extends React.Component {

  state = {
    statusBarHidden: true
  };

  componentDidMount() {
    this.statusBarToggle = State.watch( 'statusBarToggle', ( hidden ) => {
      this.setState(( state ) => ({
        statusBarHidden: is.Boolean( hidden ) ? hidden : !state.statusBarHidden
      }));
    });
  }

  componentWillUnmount() {
    if ( this.statusBarToggle ) {
      this.statusBarToggle.clear();
      this.statusBarToggle = null;
    }
  }

  render() {
    const { statusBarHidden } = this.state;
    return (
      <StatusBar hidden={statusBarHidden} />
    );
  }
}

export default StatusBarToggle;
