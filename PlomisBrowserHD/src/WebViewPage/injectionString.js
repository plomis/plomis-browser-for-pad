
export default `
  (function() {
    console.log( 'injectedJavaScript' );
    var open = window.open;
    var origin = location.origin;
    window.open = function( url, opt ) {
      if ( opt !== '_self' ) {
        window.ReactNativeWebView.postMessage( JSON.stringify({
          url: url,
          location: location
        }));
        return {
          location: {},
          document: {}
        };
      } else {
        return open( url, '_self' );
      }
    }
  })();
`;
