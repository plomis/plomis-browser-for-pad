
export default `
  (function() {

    console.log( 'injectedJavaScript' );
    var open = window.open;
    var origin = location.origin;
    var makeLocation = function( url ) {
      var obj = {};
      var _href = url;
      Object.defineProperty( obj, 'href', {
        configurable: true,
        enumerable: true,
        writeable: true,
        get: function() {
          return _href;
        },
        set: function( href ) {
          window.ReactNativeWebView.postMessage( JSON.stringify({
            url: href,
            location: location,
            type: 'href'
          }));
          _href = href;
        }
      })
      return obj;
    };

    window.open = function( url, opt ) {
      if ( opt !== '_self' ) {
        var newLocation = makeLocation( url );
        window.ReactNativeWebView.postMessage( JSON.stringify({
          url: url,
          location: location,
          type: 'add'
        }));
        return {
          location: newLocation,
          document: {}
        };
      } else {
        return open( url, '_self' );
      }
    }

  })();
`;
