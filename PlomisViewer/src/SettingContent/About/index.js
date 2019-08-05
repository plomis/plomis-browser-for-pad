//@flow

import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import ScrollStackView from '../../components/ScrollStackView';
import withUpdate from '../../utils/withUpdate';


@withUpdate
class Content extends React.Component {

  render() {

    const { version, checkUpdate } = this.props;
    const current = DeviceInfo.getVersion();

    return (
      <ScrollStackView>
        <View style={styles.wrapper}>
          <View style={styles.logo}>
            <Image style={styles.logoImage} resizeMode="contain" source={require( '../../../assets/logo.png' )} />
          </View>
          <View style={styles.version}>
            <Text style={styles.versionText}>版本 {DeviceInfo.getVersion()}</Text>
          </View>
          {!version ? (
            <View style={styles.update}>
              <ActivityIndicator />
            </View>
          ) : version === current ? (
            <View style={styles.update}>
              <Text style={styles.versionText}>
                当前为最新版本
              </Text>
            </View>
          ) : (
            <TouchableOpacity activeOpacity={0.8} onPress={checkUpdate}>
              <View style={styles.update}>
                <Text style={styles.updateText}>
                  更新最新版本({version})
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollStackView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 100,
    alignItems: 'center'
  },
  logo: {
    alignItems: 'center'
  },
  logoImage: {
    width: 200
  },
  version: {
    paddingTop: 8
  },
  versionText: {
    fontSize: 16,
    color: '#8e8e93'
  },
  update: {
    paddingTop: 8
  },
  updateText: {
    fontSize: 16,
    color: '#007CFF'
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
