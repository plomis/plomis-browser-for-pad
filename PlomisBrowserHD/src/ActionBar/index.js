// @flow

import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, StyleSheet, View, Text, TouchableOpacity, Easing } from 'react-native';


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
  onPress?: () => void
};
class MinBarItem extends Component<MinBarItemProps> {
  render() {
    const { name, onPress } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <View style={styles.minItem}>
          <MaterialCommunityIcons
            size={24} name={name}
            style={styles.itemIcon} />
        </View>
      </TouchableOpacity>
    );
  }
}

type Props = {
  style: any
};
type State = {
  y: any,
  minY: any
};
class ActionBar extends Component<Props, State> {

  state = {
    y: new Animated.Value( -98 ),
    minY: new Animated.Value( -44 )
  };

  componentDidMount() {
    Animated.timing( this.state.minY, {
      toValue: 0,
      easing:  Easing.out( Easing.cubic )
    }).start();
  }

  handleShow = () => {
    Animated.timing( this.state.y, {
      toValue: 17,
      easing:  Easing.out( Easing.exp )
    }).start();
    Animated.timing( this.state.minY, {
      toValue: -44,
      easing:  Easing.out( Easing.exp )
    }).start();
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

  render() {
    const { y, minY } = this.state;
    const { style } = this.props;
    return (
      <View style={style}>
        <Animated.View style={[ styles.bar, { bottom: y }]}>
          <BarItem name="arrow-left" text="后退"  />
          <BarItem name="arrow-right" text="前进"  />
          <BarItem name="reorder-horizontal" text="最近打开"  />
          <BarItem active name="clock-outline" text="历史记录" />
          <BarItem name="loop" text="刷新页面"  />
          <BarItem name="selection-drag" text="截图分享"  />
          <BarItem name="home" text="返回首页"  />
          <BarItem name="settings-outline" text="系统设置"  />
          <BarItem onPress={this.handleHide} name="arrow-expand-down" text="隐藏界面"  />
        </Animated.View>
        <Animated.View style={[ styles.minBar, { bottom: minY }]}>
          <MinBarItem name="arrow-left" size={24}  />
          <MinBarItem onPress={this.handleShow} name="apps" size={24}  />
          <MinBarItem name="arrow-right" size={24}  />
        </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 22,
    paddingLeft: 22
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
    paddingLeft: 8
  },
  minItem: {
    width: 60,
    height: 44,
    textAlign: 'center'
  }
});

export default ActionBar;
