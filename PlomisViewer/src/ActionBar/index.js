// @flow

import is from 'whatitis';
import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, StyleSheet, View, TouchableOpacity, Easing, Dimensions,
  UIManager, findNodeHandle, Platform } from 'react-native';
import { BlurView } from "@react-native-community/blur";
import { History, Tabs, State } from '../ViewPortState';
import { withAppConfig } from '../components/AppContext';


type BarItemProps = {
  name: any,
  disabled?: boolean,
  onPress?: () => void
};
class BarItem extends Component<BarItemProps> {
  render() {
    const { name, style, disabled, onPress } = this.props;
    const itemStyle = [styles.item];
    if ( style ) {
      itemStyle.push( style );
    }
    const button = (
      <View style={itemStyle}>
        <MaterialCommunityIcons
          size={24}
          name={name}
          style={styles.icon} />
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

class Blur extends React.Component {
  render() {
      const { style } = this.props;
    const viewStyle = style ? [ style, styles.androidBlurView ] : style;
    return Platform.OS === 'ios'
      ? <BlurView {...this.props} />
      : <View {...this.props} style={viewStyle} />;
  }
}

type PropsType = {
  style: any,
  children: any
};
type StateType = {
  barWidth: any,
  dotOpacity: any,
  ctrlOpacity: any,
  barRadius: any,
  translateY: any,
  position: any,
  occurError: boolean,
  initialized: boolean,
  canGoBack: boolean
};
@withAppConfig
@withNavigation
class ActionBar extends Component<PropsType, StateType> {

  tabsAdd: any;
  StateLoad: any;
  StateError: any;
  TabsChange: any;

  constructor( props ) {
    super( props );
    this.state = {
      ctrlOpacity: null,
      dotOpacity: null,
      barWidth: null,
      position: {},
      translateY: null,
      barRadius: null,
      initialized: false,
      occurError: false,
      canGoBack: false
    };
    this.barRef = React.createRef();
  }

  componentDidMount() {
    this.StateError = State.watch( 'error', () => {
      this.setState({ occurError: true });
      this.handleHide();
    });
    this.StateLoad = State.watch( 'load', () => {
      if ( this.state.initialized === false ) {
        this.state.initialized = true;
        this.handleFirstShow();
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

  handleHide = async () => {
    // const windowSize = this.getWindowSize();
    Animated.timing( this.state.position.y, {
      toValue: -48,
      easing: Easing.out( Easing.exp )
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

  handleSetting = () => {
    this.props.navigation.navigate( 'Setting' );
  }

  handleTheme = () => {
    const { setConfig } = this.props;
    setConfig( 'setting', {
      theme: 'dark'
    });
  };

  handleFirstShow = async () => {
    // const windowSize = this.getWindowSize();
    const offset = await this.getOffset( this.barRef.current );
    const y = 20;
    await this.setBarStyle({ bottom: - offset.height });
    Animated.timing( this.state.position.y, {
      toValue: y,
      easing: Easing.out( Easing.exp )
    }).start();
  };

  handleMinimize = async () => {
    const windowSize = this.getWindowSize();
    const offset = await this.getOffset( this.barRef.current );
    const x = ( windowSize.width - offset.width ) / 2;
    const barRadius = 20;
    await this.setBarStyle({
      left: x,
      bottom: 20,
      translateY: 0,
      ctrlOpacity: 1,
      dotOpacity: 0,
      borderRadius: barRadius,
      width: offset.width
    });
    Animated.parallel([
      Animated.timing( this.state.ctrlOpacity, {
        toValue: 0,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.dotOpacity, {
        toValue: 1,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.translateY, {
        toValue: -60,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.barRadius, {
        toValue: 30,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.barWidth, {
        toValue: 60,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.position.x, {
        toValue: 8,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.position.y, {
        toValue: 8,
        easing: Easing.out( Easing.exp )
      })
    ]).start();
  };

  handleMaximize = async () => {
    const windowSize = this.getWindowSize();
    const offset = await this.getOffset( this.barRef.current );
    const x = offset.left;
    // const y = offset.top;
    const barRadius = 30;
    const width = 60;
    await this.setBarStyle({
      bottom: 20,
      left: x,
      ctrlOpacity: 0,
      dotOpacity: 1,
      translateY: -60,
      borderRadius: barRadius,
      width
    });
    Animated.parallel([
      Animated.timing( this.state.ctrlOpacity, {
        toValue: 1,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.dotOpacity, {
        toValue: 0,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.translateY, {
        toValue: 0,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.barRadius, {
        toValue: 20,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.barWidth, {
        toValue: 300,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.position.x, {
        toValue: ( windowSize.width - 300 ) / 2,
        easing: Easing.out( Easing.exp )
      }),
      Animated.timing( this.state.position.y, {
        toValue: 20,
        easing: Easing.out( Easing.exp )
      })
    ]).start();
  };

  getWindowSize() {
    return Dimensions.get( 'window' );
  }

  getOffset( current ) {
    return new Promise(( resolve ) => {
      // android 里面 x y 都是 0
      UIManager.measure( findNodeHandle( current ), ( x_, y_, width, height, left, top ) => {
        resolve({ left, top, width, height });
      });
    });
  }

  setBarStyle( style ) {
    return new Promise(( resolve ) => {
      this.setState({
        ctrlOpacity: is.Defined( style.ctrlOpacity ) ? new Animated.Value( style.ctrlOpacity ) : null,
        dotOpacity: is.Defined( style.dotOpacity ) ? new Animated.Value( style.dotOpacity ) : null,
        translateY: is.Defined( style.translateY ) ? new Animated.Value( style.translateY ) : null,
        barRadius: is.Defined( style.borderRadius ) ? new Animated.Value( style.borderRadius ) : null,
        barWidth: is.Defined( style.width ) ? new Animated.Value( style.width ) : null,
        position: {
          x: is.Defined( style.left ) ? new Animated.Value( style.left ) : null,
          y: is.Defined( style.bottom ) ? new Animated.Value( style.bottom ) : null
        }
      }, resolve );
    });
  }

  render() {

    const { barWidth, barRadius, position, translateY, canGoBack,
      ctrlOpacity, dotOpacity  } = this.state;
    const { style, children, configuration } = this.props;
    const barStyle = {};
    const dotStyle = {};
    const ctrlStyle = {};
    if ( position.x ) {
      barStyle.left = position.x;
    }
    if ( position.y ) {
      barStyle.bottom = position.y;
    }
    if ( barWidth ) {
      barStyle.width = barWidth;
    }
    if ( barRadius ) {
      barStyle.borderRadius = barRadius;
    }
    if ( translateY ) {
      dotStyle.transform = [{ translateY }];
      ctrlStyle.transform = [{ translateY }];
    }
    if ( ctrlOpacity ) {
      ctrlStyle.opacity = ctrlOpacity;
    }
    if ( dotOpacity ) {
      dotStyle.opacity = dotOpacity;
    }

    return (
      <View style={style}>
        {children}
        <Animated.View ref={this.barRef} style={[ styles.bar, barStyle ]}>
          <Blur blurType={configuration.setting.theme} style={styles.blur}>
            <Animated.View style={[ styles.controls, ctrlStyle ]}>
              <BarItem name="arrow-left" onPress={this.handleBack} />
              <BarItem name="arrow-right" onPress={this.handleForward} />
              <BarItem name="home-outline" text="首页" disabled={canGoBack} onPress={this.handleGoHome} />
              <BarItem name="loop" text="刷新" onPress={this.handleReload} />
              {/* <BarItem name="import" disabled={!canGoBack} onPress={this.handlePop} /> */}
              {/* <BarItem name="settings-outline" text="设置" onPress={this.handleSetting} /> */}
              <BarItem name="unfold-less-horizontal" text="隐藏" onPress={this.handleMinimize} style={{ transform: [{ rotate: '45deg' }]}} />
              {/* <BarItem name="unfold-less-horizontal" text="主题" onPress={this.handleTheme} /> */}
            </Animated.View>
            <Animated.View style={[ styles.dot, dotStyle ]}>
              <BarItem name="unfold-more-horizontal" onPress={this.handleMaximize} style={{ transform: [{ rotate: '45deg' }]}} />
            </Animated.View>
          </Blur>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: 45,
    height: 48,
    justifyContent: 'center'
  },
  icon: {
    textAlign: 'center',
    color: '#9C9EA9'
  },
  bar: {
    bottom: -48,
    height: 48,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 10
  },
  blur: {
    width: 300
  },
  androidBlurView: {
    backgroundColor: '#373945'
  },
  controls: {
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingRight: 15,
    paddingLeft: 15,
    height: 60
  },
  dot: {
    top: 60,
    left: 0,
    width: 60,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1
  }
});

export default ActionBar;
