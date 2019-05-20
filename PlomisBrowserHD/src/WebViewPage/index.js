// @flow


import URI from 'urijs';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { withNavigationFocus, StackActions } from 'react-navigation';
import { StyleSheet, View, Text, Platform } from 'react-native';
// import LoadingPage from '../LoadingPage';
// import LoadErrorPage from '../LoadErrorPage';
import { History, Tabs } from '../ViewPortState';
import jsForInjection from './injectionString';

// const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize( dp );
// const px2dp = px => PixelRatio.roundToNearestPixel( px );
// const { height, width } = Dimensions.get( 'window' );

// console.log(`height:${height},width:${dp2px(width)}`)
// console.log("Dimensions.get( 'window' ):", Dimensions.get( 'window' ))

const DefaultUrl = 'https://www.thingspower.com.cn/';
// const DefaultUrl = 'https://baidu.com';


type Props = {
  navigation: any,
  isFocused: boolean
};
type State = {
  uuid: string,
  current: any
};
class ViewPage extends Component<Props, State> {

  webViewRef: any;
  historyUrl: any;
  historyBack: any;
  historyForward: any;
  historyReload: any;
  tabsPop: any;
  tabsHome: any;
  didFocusSubscription: any;

  constructor( props: Props ) {
    super( props );
    this.webViewRef = React.createRef();
    this.state = {
      current: { url: this.props.navigation.getParam( 'url' ) || DefaultUrl },
      uuid: this.props.navigation.state.key
    };
    History.set( this.state.uuid, []);
    Tabs.set( 'current', this.state.uuid );
    const allTabs = Tabs.get( 'all' ) || [];
    Tabs.set( 'all', [ ...allTabs, this.state.uuid ]);
  }

  componentDidMount = () => {
    this.handleUrl();
    this.handleBack();
    this.handleForward();
    this.handlePop();
    this.handleReload();
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
    remove( this.didFocusSubscription );
  };

  handleHome = () => {
    this.tabsHome = Tabs.watch( 'home', () => {
      if ( this.props.isFocused ) {
        this.setState({ current: { url: DefaultUrl }});
      }
    });
  };

  handleDidFocus = () => {
    this.didFocusSubscription = this.props.navigation.addListener( 'didFocus', () => {
      Tabs.set( 'current', this.state.uuid );
    });
  };

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
        navigation.pop();
      }
    });
  };

  handleLoad = () => {

  };

  handleLoadEnd = () => {

  };

  handleLoadStart = ( state: any ) => {
    console.log( "state:", state );
  };

  handleError = () => {
    console.log( 'Error' );
  };

  handleRenderError = () => {
    console.log( 'RenderError' );
  };

  handleMessage = ( event: any ) => {
    const data = JSON.parse( event.nativeEvent.data );
    // console.log( "url:", data.url );
    const uri = new URI( data.url, data.location.href );
    Tabs.dispense( 'add' );
    this.props.navigation.dispatch( StackActions.push({
      routeName: 'Viewer',
      params: {
        url: uri.href()
      }
    }));
  };

  handleNavigationStateChange = ( state: any ) => {
    this.state.current = Object.assign({}, state );
  };

  // handleShouldStartLoadWithRequest = ( request: any ) => {
  //   return true;
  // };

  renderLoading = () => {
    return (
      <View>
        <Text>
          正在加载...
        </Text>
      </View>
    );
  };

  // renderError = () => {
  //   return (
  //     <LoadErrorPage />
  //   );
  // };

  render() {

    const props: any = {
      javaScriptEnabled: true,
      domStorageEnabled: true,
      geolocationEnabled: false,
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

    return (
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
        // renderError={this.renderError}

        // load 时注入 js 代码
        injectedJavaScript={jsForInjection} />
    );
  }
}

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%'
  }
});

export default withNavigationFocus( ViewPage );
