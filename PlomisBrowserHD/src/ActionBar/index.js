// @flow

import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, StyleSheet, View, /* Text, */ TouchableOpacity, TouchableWithoutFeedback, Easing } from 'react-native';
import { History, Tabs, State } from '../ViewPortState';


// type BarItemProps = {
//   name: any,
//   text: string,
//   active?: boolean,
//   onPress?: () => void
// };
// class BarItem extends Component<BarItemProps> {
//   render() {
//     const { active, name, text, onPress } = this.props;
//     return (
//       <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
//         <View style={styles.item}>
//           <MaterialCommunityIcons
//             size={32} name={name}
//             style={[styles.itemIcon].concat( active ? [styles.itemActive] : [])} />
//           <Text style={[styles.itemText].concat( active ? [styles.itemActive] : [])}>{text}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }
// }

type MinBarItemProps = {
  name: any,
  disabled?: boolean,
  onPress?: () => void
};
class MinBarItem extends Component<MinBarItemProps> {
  render() {
    const { name, disabled, onPress } = this.props;
    const button = (
      <View style={styles.minItem}>
        <MaterialCommunityIcons
          size={24} name={name}
          style={styles.itemIcon} />
      </View>
    );
    return disabled ? (
      <View style={{ opacity: 0.3 }}>
        {button}
      </View>
    ) : (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        {button}
      </TouchableOpacity>
    );
  }
}

type PropsType = {
  style: any,
  children: any
};
type StateType = {
  minY: any,
  occurError: boolean,
  initialized: boolean,
  canGoBack: boolean
};
class ActionBar extends Component<PropsType, StateType> {

  tabsAdd: any;
  StateError: any;
  StateLoad: any;
  TabsChange: any;

  state = {
    minY: new Animated.Value( -44 ),
    occurError: false,
    initialized: false,
    canGoBack: false
  };

  componentDidMount() {
    this.StateError = State.watch( 'error', () => {
      this.setState({ occurError: true });
      this.handleHide();
    });
    this.StateLoad = State.watch( 'load', () => {
      if ( this.state.initialized === false ) {
        this.state.initialized = true;
        this.handleShowBar();
      }
    });
    this.TabsChange = Tabs.watch( 'tabsChange', () => {
      const current = Tabs.get( 'current' );
      const all = Tabs.get( 'all' );
      this.setState({ canGoBack: current !== all[0] });
    });
  }

  componentWillUnmount = () => {
    function remove( listener ) {
      if ( listener ) {
        ( listener.clear || listener.remove )();
      }
    }
    remove( this.tabsAdd );
    remove( this.StateError );
    remove( this.TabsChange );
  };

  handleHide = () => {
    Animated.timing( this.state.minY, {
      toValue: -44,
      easing:  Easing.out( Easing.exp )
    }).start();
  };

  handleBack = () => {
    History.dispense( 'back' );
  }

  handleForward = () => {
    History.dispense( 'forward' );
  }

  handleReload = () => {
    History.dispense( 'reload' );
  }

  handlePop = () => {
    Tabs.dispense( 'pop' );
  }

  handleGoHome = () => {
    Tabs.dispense( 'home' );
  }

  // handleAddTabs = () => {
  //   this.tabsAdd = Tabs.watch( 'add', () => {
  //     this.handleHide();
  //   });
  // };

  handleShowBar = () => {
    if ( !this.state.occurError ) {
      Animated.timing( this.state.minY, {
        toValue: 0,
        easing:  Easing.out( Easing.exp )
      }).start();
    }
  };

  render() {

    const { minY, canGoBack } = this.state;
    const { style, children } = this.props;

    return (
      <View style={style}>
        {children}
        {/* <Animated.View style={[ styles.bar, { bottom: y }]}>
          <BarItem name="arrow-left" text="后退" onPress={this.handleBack}  />
          <BarItem name="arrow-right" text="前进" onPress={this.handleForward} />
          <BarItem name="loop" text="刷新" onPress={this.handleReload} />
          <BarItem onPress={this.handleHide} name="arrow-expand-down" text="隐藏"  />
        </Animated.View> */}
        <Animated.View style={[ styles.minBar, { bottom: minY }]}>
          {/* <BarItem active name="clock-outline" text="历史记录" /> */}
          {/* <BarItem name="selection-drag" text="截图分享"  /> */}
          {/* <BarItem name="settings-outline" text="系统设置"  /> */}
          <MinBarItem name="arrow-left" size={24} onPress={this.handleBack} />
          <MinBarItem name="arrow-right" size={24} onPress={this.handleForward} />
          <MinBarItem name="loop" text="刷新" onPress={this.handleReload} />
          <MinBarItem name="home-outline" text="首页" onPress={this.handleGoHome} />
          <MinBarItem name={'import'} size={24} disabled={!canGoBack} onPress={this.handlePop} />
          <MinBarItem onPress={this.handleHide} name="arrow-expand-down" text="隐藏"  />
        </Animated.View>
        <TouchableWithoutFeedback onPress={this.handleShowBar}>
          <View style={styles.corner} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    height: 96,
    bottom: 17,
    borderRadius: 25,
    position: 'absolute',
    backgroundColor: '#373945',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 22,
    paddingLeft: 22,
    zIndex: 10
  },
  item: {
    width: 64,
    height: 64,
    marginLeft: 8,
    marginRight: 8
  },
  itemIcon: {
    textAlign: 'center',
    color: '#9C9EA9',
    lineHeight: 44,
    height: 44
  },
  itemText: {
    color: '#9C9EA9',
    textAlign: 'center',
    lineHeight: 20,
    width: '100%',
    height: 20,
    fontSize: 12
  },
  itemActive: {
    color: '#ddd'
  },
  minBar: {
    bottom: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    position: 'absolute',
    backgroundColor: '#373945',
    flexDirection: 'row',
    paddingRight: 8,
    paddingLeft: 8,
    zIndex: 10
  },
  minItem: {
    width: 60,
    height: 44,
    textAlign: 'center'
  },
  corner: {
    width: 280,
    height: 25,
    // left: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 9
  }
});

export default ActionBar;
