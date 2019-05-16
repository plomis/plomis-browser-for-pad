
export default `
  (function() {
    console.log( 'injectedJavaScript' );
    var open = window.open;
    var origin = location.origin;
    window.open = function( url, opt ) {
      if ( opt !== '_self' ) {
        window.ReactNativeWebView.postMessage( origin + url );
      } else {
        open( url, '_self' );
      }
    }
  })();
`;
