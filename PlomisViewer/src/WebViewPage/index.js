// @flow

import URI from 'urijs';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { withNavigationFocus, StackActions } from 'react-navigation';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { withAppConfig } from '../utils/AppContext';
// import LoadingPage from '../LoadingPage';
// import LoadErrorPage from '../LoadErrorPage';
import ViewPortError from '../ViewPortError';
import { History, Tabs, State } from '../ViewPortState';
import jsForInjection from './injectionString';

// const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize( dp );
// const px2dp = px => PixelRatio.roundToNearestPixel( px );
// const { height, width } = Dimensions.get( 'window' );

// console.log(`height:${height},width:${dp2px(width)}`)
// console.log("Dimensions.get( 'window' ):", Dimensions.get( 'window' ))

// const DefaultUrl = 'https://www.thingspower.com.cn/';
// const DefaultUrl = 'https://baidu.com';


type PropsType = {
  navigation: any,
  isFocused: boolean
};
type StateType = {
  uuid: string,
  current: any
};

@withAppConfig
class ViewPage extends Component<PropsType, StateType> {

  webViewRef: any;
  historyUrl: any;
  historyBack: any;
  historyForward: any;
  historyReload: any;
  tabsPop: any;
  tabsHome: any;

  constructor( props: PropsType ) {
    super( props );
    this.webViewRef = React.createRef();
    const { configuration } = props;
    const url = this.props.navigation.getParam( 'url' ) || configuration.config.homePage;
    this.state = {
      current: { url },
      uuid: this.props.navigation.state.key
    };
    History.set( this.state.uuid, []);
    Tabs.set( 'current', this.state.uuid );
    const allTabs = Tabs.get( 'all' ) || [];
    Tabs.set( 'all', [ ...allTabs, this.state.uuid ]);
    Tabs.dispense( 'tabsChange' );
  }

  componentDidMount = () => {
    this.handleUrl();
    this.handleBack();
    this.handleForward();
    this.handlePop();
    this.handleReload();
    this.handleHome();
  };

  shouldComponentUpdate = ( _, nextState ) => {
    return this.state.current.url !== nextState.current.url;
  };

  componentWillUnmount = () => {
    function remove( listener ) {
      if ( listener ) {
        ( listener.clear || listener.remove )();
      }
    }
    remove( this.historyUrl );
    remove( this.historyBack );
    remove( this.historyForward );
    remove( this.tabsPop );
    remove( this.tabsHome );
  };

  handleHome = () => {
    this.tabsHome = Tabs.watch( 'home', () => {
      if ( this.props.isFocused ) {
        const home = this.props.configuration.config.homePage;
        this.state.current.url = home;
        this.webViewRef.current.injectJavaScript( `location.href = '${home}'` );
      }
    });
  };

  // handleDidFocus = () => {
  //   this.didFocusSubscription = this.props.navigation.addListener( 'didFocus', () => {
  //     Tabs.set( 'current', this.state.uuid );
  //   });
  // };

  handleUrl = () => {
    this.historyUrl = History.watch( 'url', ( url ) => {
      if ( this.props.isFocused ) {
        this.setState({ current: { url }});
      }
    });
  };

  handleBack = () => {
    this.historyBack = History.watch( 'back', () => {
      if ( this.props.isFocused ) {
        this.webViewRef.current.goBack();
      }
    });
  };

  handleForward = () => {
    this.historyForward = History.watch( 'forward', () => {
      if ( this.props.isFocused ) {
        this.webViewRef.current.goForward();
      }
    });
  };

  handleReload = () => {
    this.historyReload = History.watch( 'reload', () => {
      if ( this.props.isFocused ) {
        this.webViewRef.current.reload();
      }
    });
  };

  handlePop = () => {
    this.tabsPop = Tabs.watch( 'pop', () => {
      if ( this.props.isFocused ) {
        const { navigation } = this.props;
        const allTabs = Tabs.get( 'all' );
        allTabs.pop();
        Tabs.set( 'all', [...allTabs]);
        Tabs.set( 'current', allTabs[ allTabs.length - 1 ]);
        Tabs.dispense( 'tabsChange' );
        navigation.pop();
      }
    });
  };

  handleLoad = () => {
    State.dispense( 'load' );
  };

  handleLoadEnd = () => {
  };

  handleLoadStart = ( state: any ) => {
    console.log( "state:", state );
  };

  handleError = ( error ) => {
    State.dispense( 'error', error );
  };

  handleRenderError = ( errorName ) => {
    return <ViewPortError name={errorName} />;
  };

  handleMessage = ( event: any ) => {
    const data = JSON.parse( event.nativeEvent.data );
    let uri = null;
    if ( data.type === 'add' ) {
      try {
        uri = ( new URI( data.url, data.baseUrl )).href();
      } catch( e ) {
        uri = '';
      }
      this.props.navigation.dispatch( StackActions.push({
        routeName: 'Viewer',
        params: {
          url: uri
        }
      }));
    } else if ( data.type === 'href' ) {
      History.dispense( 'url',  data.url );
    }
  };

  handleNavigationStateChange = ( state: any ) => {
    this.state.current = Object.assign({}, state );
  };

  renderLoading = () => {
    return (
      <View>
        <Text>
          正在加载...
        </Text>
      </View>
    );
  };

  render() {

    const props: any = {
      javaScriptEnabled: true,
      domStorageEnabled: true,
      geolocationEnabled: true,
      androidHardwareAccelerationDisabled: false,
      // allowUniversalAccessFromFileURLs: false,
      // allowsInlineMediaPlayback: false,
      automaticallyAdjustContentInsets: false,
      source: { uri: this.state.current.url }
    };
    // 仅在ios有效
    if ( Platform.OS === "ios" ) {
      Object.assign( props, {
        useWebKit: true,
        bounces: false,
        dataDetectorTypes: 'none'
      });
    }
    // 缩放页面适应
    // 安卓取了个反
    if ( Platform.OS === 'android' ) {
      Object.assign( props, {
        // scalesPageToFit: false
      });
    }

    return props.source.uri ? (
      <WebView
        {...props}
        style={styles.viewer}
        ref={this.webViewRef}
        onLoad={this.handleLoad}
        onError={this.handleError}
        onLoadEnd={this.handleLoadEnd}
        // onLoadStart={this.handleLoadStart} // 导致页面浮动元素不能点击
        onMessage={this.handleMessage}
        onNavigationStateChange={this.handleNavigationStateChange}

        // 加载过度界面
        // startInLoadingState
        // renderLoading={this.renderLoading}

        // 加载错误页面
        renderError={this.handleRenderError}

        // load 时注入 js 代码
        injectedJavaScript={jsForInjection} />
    ) : <View style={styles.blank} />;
  }
}

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  blank: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default withNavigationFocus( ViewPage );
