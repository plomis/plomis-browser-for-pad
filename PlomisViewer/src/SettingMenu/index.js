//@flow

import React from 'react';
import { StyleSheet, ScrollView, Platform, View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { State } from '../ViewPortState';
import List from '../components/List';
import { BackButton } from '../components/HeaderButton';


const Item = List.Item;

class Menu extends React.Component {

  static navigationOptions({ screenProps }) {
    return {
      headerTitle: '设置',
      headerTitleStyle: Platform.OS !== 'ios' ? {
        textAlign: 'center',
        flex: 1
      } : null,
      headerLeft: (
        <BackButton
          title={Platform.OS === 'ios' ? '返回' : ''}
          onPress={() => {
            if ( Platform.OS === 'ios' ) {
              setTimeout(() => {
                State.dispense( 'statusBarToggle', true );
              }, 80 );
            }
            screenProps.navigation.navigate( 'ViewPort' );
          }} />
      ),
      // Android占位
      headerRight: Platform.OS === 'ios' ? null : <View />
    };
  }

  state = {
    selectedKey: 'Common'
  };

  componentDidMount() {
    State.dispense( 'SettingMenuChange', this.state.selectedKey );
  }

  handleSelect = ( selectedKey ) => {
    this.setState({ selectedKey });
    State.dispense( 'SettingMenuChange', selectedKey );
  };

  render() {

    const { selectedKey } = this.state;

    return (
      <ScrollView
        style={styles.menu}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <List selectedKey={selectedKey} onSelect={this.handleSelect}>
          <Item key="Common">
            通用
          </Item>
          <Item key="DownloadConfig">
            功能配置
          </Item>
          <Item key="About">
            关于
          </Item>
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: '#EFEFF4'
  }
});

const AppStack = createStackNavigator({
  Menu: {
    screen: Menu
  }
}, {
  initialRouteName: 'Menu'
});

const AppContainer = createAppContainer( AppStack );

export default AppContainer;
