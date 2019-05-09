// @flow

import React, { Component } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, Text } from 'react-native';

class SiderItem extends Component<Props> {
  render() {
    return (
      <View style={styles.item}>
        <FontAwesome name="hand-peace-o" size={48} />
        <View style={styles.itemText}>
          <Text>按钮</Text>
        </View>
      </View>
    );
  }
}

type Props = {};
class SideBar extends Component<Props> {
  render() {
    return (
      <View style={styles.sider}>
        <SiderItem />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sider: {
    flex: 1,
    flexDirection: 'row'
  },
  item: {
    flex: 1
  },
  itemIcon: {

  },
  itemText: {
    flex: 1
  }
});

export default SideBar;
