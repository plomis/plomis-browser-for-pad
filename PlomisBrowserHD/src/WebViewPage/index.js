// @flow

import React, { Component } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
// import LoadingPage from '../LoadingPage';
// import LoadErrorPage from '../LoadErrorPage';
import jsForInjection from './injectionString';

// const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize( dp );
// const px2dp = px => PixelRatio.roundToNearestPixel( px );
// const { height, width } = Dimensions.get( 'window' );

// console.log(`height:${height},width:${dp2px(width)}`)
// console.log("Dimensions.get( 'window' ):", Dimensions.get( 'window' ))

type Props = {};
class ViewPage extends Component<Props> {

  constructor( props ) {
    super( props );
    this.webViewRef = React.createRef();
  }

  handleLoad = () => {

  };

  handleLoadEnd = () => {
    // console.log( 'LoadEnd' )
  };

  handleLoadStart = ( state ) => {
    console.log("state:", state)
  };

  handleError = () => {
    console.log( 'Error' )
  };

  handleRenderError = () => {
    console.log( 'RenderError' )
  };

  handleMessage = ( event ) => {
    console.log("url:", event.nativeEvent.data)
    this.props.navigation.navigate( 'Viewer', { url: event.nativeEvent.data });
  };

  handleNavigationStateChange = ( state ) => {
    // console.log("state:", state)
  };

  handleShouldStartLoadWithRequest = ( request ) => {
    return true;
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

  // renderError = () => {
  //   return (
  //     <LoadErrorPage />
  //   );
  // };

  render() {

    const DefaultUrl = 'https://emms.thingspower.com.cn/emms/face';
    // const DefaultUrl = 'https://emms.thingspower.com.cn/';
    // const DefaultUrl = 'http://127.0.0.1:8000';
    // const DefaultUrl = 'https://baidu.com';
    const props = {
      javaScriptEnabled: true,
      domStorageEnabled: true,
      geolocationEnabled: false,
      // allowUniversalAccessFromFileURLs: false,
      // allowsInlineMediaPlayback: false,
      automaticallyAdjustContentInsets: false,
      source: { uri: this.props.navigation.getParam( 'url', '' ) || DefaultUrl }
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

export default ViewPage;
