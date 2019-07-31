//@flow

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { Toast, Modal } from '@ant-design/react-native';
import ScrollStackView from '../../components/ScrollStackView';
import { withAppConfig } from '../../components/AppContext';
// import { restore } from '../../utils/configuration';
import List from '../../components/List';


const Item = List.Item;

@withAppConfig
class Content extends React.Component {

  state = {
    selectedKey: null
  };

  handleSelect = ( selectedKey, { arrow }) => {
    if ( arrow ) {
      this.setState({
        selectedKey
      });
      // this.props.navigation.navigate( 'Content1' );
    }
  };

  handleWillFocus = () => {
    this.setState({
      selectedKey: null
    });
  };

  handlePress = ( key ) => {
    const { restore } = this.props;
    if ( key === 'init' ) {
      Modal.alert( '', '是否还原程序设置？', [{
        text: '取消',
        style: 'cancel'
      }, {
        text: '确定',
        onPress() {
          restore();
          Toast.success( '还原成功' );
        }
      }]);
    }
  };

  render() {

    const { selectedKey } = this.state;
    const listProps = {
      selectedKey,
      mode: 'card',
      onSelect: this.handleSelect,
      onPress: this.handlePress
    };

    return (
      <ScrollStackView onWillFocus={this.handleWillFocus}>
        <List {...listProps}>
          <Item key="init">
            <Text style={styles.buttonText}>还原设置</Text>
          </Item>
        </List>
      </ScrollStackView>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#007CFF',
    fontSize: 17
  }
});

const AppStack = createStackNavigator({
  Content: {
    screen: Content
  }
}, {
  initialRouteName: 'Content',
  defaultNavigationOptions: {
    gesturesEnabled: false
  }
});

export default createAppContainer( AppStack );
