// @flow

import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Easing } from 'react-native';
import { History, Tabs } from '../ViewPortState';


type BarItemProps = {
  name: any,
  text: string,
  active?: boolean,
  onPress?: () => void
};
class BarItem extends Component<BarItemProps> {
  render() {
    const { active, name, text, onPress } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <View style={styles.item}>
          <MaterialCommunityIcons
            size={32} name={name}
            style={[styles.itemIcon].concat( active ? [styles.itemActive] : [])} />
          <Text style={[styles.itemText].concat( active ? [styles.itemActive] : [])}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

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

type Props = {
  style: any,
  children: any
};
type State = {
  y: any,
  minY: any,
  popupBar: boolean,
  fullScreen: boolean
};
class ActionBar extends Component<Props, State> {

  tabsAdd: any;

  state = {
    y: new Animated.Value( -98 ),
    minY: new Animated.Value( -44 ),
    popupBar: false,
    fullScreen: false
  };

  componentDidMount() {
    this.handleAddTabs();
    Animated.timing( this.state.minY, {
      toValue: 0,
      easing:  Easing.out( Easing.cubic )
    }).start();
  }

  componentWillUnmount = () => {
    function remove( listener ) {
      if ( listener ) {
        ( listener.clear || listener.remove )();
      }
    }
    remove( this.tabsAdd );
  };

  handleShow = () => {
    const { popupBar } = this.state;
    if ( !popupBar ) {
      Animated.timing( this.state.y, {
        toValue: 17,
        easing:  Easing.out( Easing.exp )
      }).start();
      Animated.timing( this.state.minY, {
        toValue: -44,
        easing:  Easing.out( Easing.exp )
      }).start();
    }
  };

  handleHide = () => {
    Animated.timing( this.state.y, {
      toValue: -98,
      easing:  Easing.out( Easing.exp )
    }).start();
    Animated.timing( this.state.minY, {
      toValue: 0,
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

  handlePopToTop = () => {
    Tabs.dispense( 'pop' );
    this.setState({ popupBar: false });
  }

  handleGoHome = () => {
    Tabs.dispense( 'home' );
  }

  handleAddTabs = () => {
    this.tabsAdd = Tabs.watch( 'add', () => {
      this.setState({ popupBar: true });
      this.handleHide();
    });
  };

  handleFullscreen = () => {
    const { fullScreen, popupBar } = this.state;
    if ( !fullScreen ) {
      this.state.fullScreen = true;
      Animated.timing( this.state.y, {
        toValue: -98,
        easing:  Easing.out( Easing.exp )
      }).start();
      Animated.timing( this.state.minY, {
        toValue: -44,
        easing:  Easing.out( Easing.exp )
      }).start();
    } else if ( popupBar ) {
      this.state.fullScreen = false;
      Animated.timing( this.state.minY, {
        toValue: 0,
        easing:  Easing.out( Easing.exp )
      }).start();
    } else {
      this.state.fullScreen = false;
      Animated.timing( this.state.minY, {
        toValue: 0,
        easing:  Easing.out( Easing.exp )
      }).start();
    }
  };

  render() {
    const { y, minY, popupBar } = this.state;
    const { style, children } = this.props;
    return (
      <View style={style}>
        {children}
        <Animated.View style={[ styles.bar, { bottom: y }]}>
          <BarItem name="arrow-left" text="后退" onPress={this.handleBack}  />
          <BarItem name="arrow-right" text="前进" onPress={this.handleForward} />
          {/* <BarItem name="reorder-horizontal" text="最近打开"  /> */}
          {/* <BarItem active name="clock-outline" text="历史记录" /> */}
          <BarItem name="loop" text="刷新" onPress={this.handleReload} />
          {/* <BarItem name="selection-drag" text="截图分享"  /> */}
          {/* <BarItem name="home" text="首页" onPress={this.handleGoHome} /> */}
          {/* <BarItem name="settings-outline" text="系统设置"  /> */}
          <BarItem onPress={this.handleHide} name="arrow-expand-down" text="隐藏"  />
        </Animated.View>
        <Animated.View style={[ styles.minBar, { bottom: minY }]}>
          <MinBarItem name={popupBar ? 'loop' : 'arrow-left'} size={24} onPress={popupBar ? this.handleReload : this.handleBack} />
          <MinBarItem name="apps" size={24} disabled={popupBar} onPress={this.handleShow} />
          <MinBarItem name={popupBar ? 'import' : 'arrow-right'} size={24} onPress={popupBar ? this.handlePopToTop : this.handleForward} />
        </Animated.View>
        <TouchableWithoutFeedback onPress={this.handleFullscreen}>
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
    height: 120,
    width: 20,
    // left: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 9
  }
});

export default ActionBar;
