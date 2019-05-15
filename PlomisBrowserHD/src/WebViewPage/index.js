// @flow


import uuid from 'uuid/v1';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { withNavigationFocus } from 'react-navigation';
import { StyleSheet, View, Text, Platform } from 'react-native';
// import LoadingPage from '../LoadingPage';
// import LoadErrorPage from '../LoadErrorPage';
import { History } from '../ViewPortState';
import jsForInjection from './injectionString';

// const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize( dp );
// const px2dp = px => PixelRatio.roundToNearestPixel( px );
// const { height, width } = Dimensions.get( 'window' );

// console.log(`height:${height},width:${dp2px(width)}`)
// console.log("Dimensions.get( 'window' ):", Dimensions.get( 'window' ))

type Props = {
  navigation: any
};
type State = {
  uuid: string,
  current: string
};
class ViewPage extends Component<Props, State> {

  webViewRef: any;

  constructor( props: Props ) {
    super( props );
    this.webViewRef = React.createRef();
    // const DefaultUrl = 'https://emms.thingspower.com.cn/';
    // const DefaultUrl = 'http://127.0.0.1:8000';
    // const DefaultUrl = 'https://baidu.com';
    const DefaultUrl = 'https://emms.thingspower.com.cn/emms/face';
    this.state = {
      current: this.props.navigation.getParam( 'url', '' ) || DefaultUrl,
      uuid: uuid()
    };
    History.set( this.state.uuid, [this.state.current]);
  }

  componentDidMount = () => {console.log("this.props.fovus:", this.props.focus)
    this.handleUrl();
    this.handleBack();
    this.handleForward();
  };

  handleUrl = () => {
    History.watch( 'url', ( url ) => {
      const history = History.get( this.state.uuid );
      const index = history.findIndex( this.state.current );
      History.set( this.state.uuid, [ ...history.slice( 0, index + 1 ), url ]);
      this.setState({
        current: url
      });
    });
  };

  handleBack = () => {
    History.watch( 'back', () => {
      const history = History.get( this.state.uuid );
      const index = history.findIndex( this.state.current );
      if ( index > 1 ) {
        this.setState({
          current: history[ index - 1 ]
        });
      }
    });
  };

  handleForward = () => {
    History.watch( 'back', () => {
      const history = History.get( this.state.uuid );
      const index = history.findIndex( this.state.current );
      if ( index < history.length - 1 ) {
        this.setState({
          current: history[ index + 1 ]
        });
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
    console.log( "url:", event.nativeEvent.data );
    this.props.navigation.navigate( 'Viewer', { url: event.nativeEvent.data });
  };

  handleNavigationStateChange = ( state: any ) => {
    const history = History.get( this.state.uuid );
    history.push( Object.assign({}, state ));
    History.dispense( this.state.uuid, [...history]);
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
      // allowUniversalAccessFromFileURLs: false,
      // allowsInlineMediaPlayback: false,
      automaticallyAdjustContentInsets: false,
      source: { uri: this.state.current }
    };
    // 仅在ios有效
    if ( Platform.OS === "ios" ) {
      Object.assign( props, {
        useWebKit: true,
        bounces: false
      });
    }
    // 缩放页面适应
    // 安卓取了个反
    if ( Platform.OS === 'android' ) {
      Object.assign( props, {
        scalesPageToFit: false
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
    flex: 1
  }
});

export default withNavigationFocus( ViewPage );
