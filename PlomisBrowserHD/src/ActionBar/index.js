// @flow

import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';


type ItemProps = {
  name: any,
  text: string,
  active?: boolean,
  onPress?: () => void
};
class SiderItem extends Component<ItemProps> {
  render() {
    const { active, name, text, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
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

type Props = {
  style: any
};
type State = {
  y: any
};
class ActionBar extends Component<Props, State> {

  state = {
    y: new Animated.Value( -98 )
  };

  componentDidMount() {
    Animated.timing( this.state.y, {
      toValue: 17,
      duration: 1000
    }).start();
  }

  handleHide = () => {
    Animated.timing( this.state.y, {
      toValue: -98,
      duration: 1000
    }).start();
  };

  render() {
    const { y } = this.state;
    const { style } = this.props;
    return (
      <Animated.View style={[ style, { bottom: y }]}>
        <View style={styles.action}>
          <SiderItem name="reorder-horizontal" text="最近打开"  />
          <SiderItem active name="clock-outline" text="历史记录" />
          <SiderItem name="loop" text="刷新页面"  />
          <SiderItem name="selection-drag" text="截图分享"  />
          <SiderItem name="home" text="跳转首页"  />
          <SiderItem name="settings-outline" text="系统设置"  />
          <SiderItem onPress={this.handleHide} name="arrow-expand-down" text="隐藏界面"  />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  }
});

export default ActionBar;
